import asyncio
import os
from datetime import datetime
import logging
from typing import Dict, Any, List, Optional

import environ
import aiohttp
from asgiref.sync import sync_to_async
from ..models.comments_models import Comments

# 로거 설정 - 애플리케이션 전체에서 사용할 로깅 객체
logger = logging.getLogger(__name__)


class toss_comments_crawler_view:
    # 상수 정의 - 매직 넘버를 방지하고 설정을 중앙화
    DEFAULT_SEMAPHORE_LIMIT = 5  # 동시 요청 수 제한 (서버 부하 방지)
    DEFAULT_RETRY_DELAY = 5  # 재시도 대기 시간 (초)
    DEFAULT_REQUEST_TIMEOUT = 60  # API 요청 타임아웃 (초)

    def __init__(self, semaphore_limit: int = DEFAULT_SEMAPHORE_LIMIT):
        """
        크롤러 초기화

        Args:
            semaphore_limit: 동시 실행 가능한 요청 수 (기본값: 5)
        """
        # environ.Env 인스턴스 생성 - 환경변수 관리 도구
        self.env = environ.Env()

        # .env 파일 경로 설정 - 현재 파일 기준 상대 경로
        env_path = os.path.join(os.path.dirname(__file__), "../../.env")

        # .env 파일 읽기 - 환경변수를 메모리에 로드
        environ.Env.read_env(env_path)

        # API 기본 URL 가져오기 - 토스 댓글 API 엔드포인트
        self.BASE_URL = self.env("TOSS_INVEST_COMMENTS_API_BASE_URL")

        # HTTP 요청 헤더 설정 - API 서버가 요구하는 헤더 정보
        self.headers = {
            'Accept': 'application/json',  # JSON 응답 요청
            'Content-Type': 'application/json',  # JSON 형식으로 전송
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
            # 브라우저 식별 정보
        }

        # Semaphore 생성 - 동시 실행 요청 수 제한 (DDoS 방지 및 서버 부하 분산)
        self.semaphore = asyncio.Semaphore(semaphore_limit)

    async def get_comments(self,
                           subject_id: str,
                           session: aiohttp.ClientSession,
                           delay: float = 0,
                           comment_sort_type: str = "RECENT",
                           max_retries: int = 3,
                           subject_type: str = "STOCK") -> Dict[str, Any]:
        """
        특정 종목의 댓글을 수집하는 메인 메서드

        Args:
            subject_id: 종목 ID (Toss 내부용 -> 규칙이 있는것 같은데 뭔지는 모르겠음)
            session: aiohttp 세션 객체 (재사용을 위해 외부에서 전달)
            delay: 요청 간 대기 시간 (초) - API 부하 방지
            comment_sort_type: 댓글 정렬 방식 ("RECENT": 최신순)
            max_retries: 최대 재시도 횟수
            subject_type: 대상 타입 (기본값: "STOCK")

        Returns:
            Dict[str, Any]: {
                'success': bool,  # 성공 여부
                'collected_count': int,  # 수집된 댓글 수
                'error': Optional[str]  # 에러 메시지 (있을 경우)
            }
        """
        # === 변수 초기화 섹션 ===
        comment_count = 0  # API에서 반환하는 전체 댓글 개수
        comment_id = None  # 페이지네이션을 위한 커서 (다음 페이지 로드용)
        retry_count = 0  # 현재까지의 재시도 횟수
        collected_count = 0  # 실제로 수집된 댓글 개수
        is_collecting = True  # 수집 계속 여부 플래그 (로컬 변수로 동시성 문제 해결)

        # API 요청 페이로드 구성 - POST 요청 본문
        payload = {
            "commentId": None,  # 페이지네이션 커서 (처음엔 None)
            "subjectId": subject_id,  # 종목 ID
            "subjectType": subject_type.upper(),  # 대상 타입 (대문자 변환)
            "commentSortType": comment_sort_type  # 정렬 방식
        }

        try:
            # === DB에서 마지막 댓글 조회 ===
            # 중복 수집 방지를 위해 이전에 수집한 마지막 댓글 확인
            last_comment: Comments = await self._get_last_comment(subject_id=subject_id)

            # 마지막 댓글 ID 추출 (없으면 None)
            last_comment_id: int = last_comment.comment_id if last_comment else None

            # 수집 시작 로그 출력
            logger.info(f"[{subject_id}] 댓글 수집 시작 (마지막 댓글 ID: {last_comment_id})")

            # === 메인 수집 루프 ===
            while is_collecting:
                try:
                    # --- API 요청 전송 ---
                    response = await self._get_response(
                        session=session,
                        payload=payload,
                        comment_id=comment_id  # 페이지네이션 커서
                    )

                    # --- 응답 유효성 검증 ---
                    # API 응답이 올바른 구조인지 확인
                    if not self._validate_response(response):
                        logger.warning(f"[{subject_id}] 유효하지 않은 응답")
                        break

                    # --- 첫 요청에서 전체 댓글 개수 확인 ---
                    if comment_count == 0:
                        comment_count = self._get_comment_count(response)

                        # 댓글이 없으면 종료
                        if comment_count <= 0:
                            logger.info(f"[{subject_id}] 수집할 댓글이 없음")
                            break

                        logger.info(f"[{subject_id}] 전체 댓글 수: {comment_count}")

                    # --- 응답에서 댓글 데이터 추출 ---
                    comments_data = response.get("result", {}).get("comments", {}).get("body", [])
                    print(f"comment_data : {comments_data}")
                    # 더 이상 가져올 댓글이 없으면 종료
                    if not comments_data:
                        logger.info(f"[{subject_id}] 더 이상 가져올 댓글이 없음")
                        break

                    # --- 댓글 저장 및 중복 체크 ---
                    save_result = await self._save_all_comments(
                        data=comments_data,
                        last_comment_id=last_comment_id  # 중복 체크용
                    )

                    # 중복 댓글 발견 시 수집 중단
                    if save_result['stopped']:
                        logger.info(f"[{subject_id}] 중복 댓글 발견, 수집 종료")
                        is_collecting = False

                    # 수집된 댓글 개수 누적
                    collected_count += save_result['saved_count']

                    # 다음 페이지를 위한 커서 업데이트
                    comment_id = save_result['next_comment_id']

                    # --- 요청 간 딜레이 적용 ---
                    # API 부하를 줄이기 위해 설정된 시간만큼 대기
                    if delay > 0 and is_collecting:
                        await asyncio.sleep(delay)

                    # 성공 시 재시도 카운터 초기화
                    retry_count = 0

                # === 네트워크 오류 처리 ===
                except aiohttp.ClientError as e:
                    retry_count += 1
                    logger.error(f"[{subject_id}] 네트워크 오류 {retry_count}/{max_retries}: {e}")

                    # 최대 재시도 횟수 초과 시 실패 반환
                    if retry_count >= max_retries:
                        logger.error(f"[{subject_id}] 최대 재시도 횟수 초과")
                        return {
                            'success': False,
                            'collected_count': collected_count,
                            'error': f'네트워크 오류: {str(e)}'
                        }

                    # 재시도 전 대기
                    await asyncio.sleep(self.DEFAULT_RETRY_DELAY)

                # === 예상치 못한 오류 처리 ===
                except Exception as e:
                    logger.error(f"[{subject_id}] 예상치 못한 오류: {type(e).__name__} - {e}", exc_info=True)
                    return {
                        'success': False,
                        'collected_count': collected_count,
                        'error': f'{type(e).__name__}: {str(e)}'
                    }

            # === 성공 종료 ===
            logger.info(f"[{subject_id}] 댓글 수집 완료 (수집된 댓글: {collected_count}개)")
            return {
                'success': True,
                'collected_count': collected_count,
                'error': None
            }

        # === 최상위 예외 처리 ===
        except Exception as e:
            logger.error(f"[{subject_id}] 크롤링 실패: {e}", exc_info=True)
            return {
                'success': False,
                'collected_count': 0,
                'error': str(e)
            }

    async def _get_response(self,
                            session: aiohttp.ClientSession,
                            payload: Dict[str, str],
                            comment_id: Optional[int] = None) -> Dict[str, Any]:
        """
        비동기 HTTP POST 요청을 보내는 메서드

        Args:
            session: aiohttp 클라이언트 세션
            payload: 요청 본문 (JSON)
            comment_id: 페이지네이션 커서 (선택적)

        Returns:
            Dict[str, Any]: API 응답 JSON

        Raises:
            aiohttp.ClientError: 네트워크 오류 시
        """
        # payload가 None이면 빈 딕셔너리 반환
        if payload is None:
            return {}

        # payload 복사본 생성 - 원본 수정 방지
        request_payload = payload.copy()

        # comment_id가 있으면 페이로드에 추가 (페이지네이션)
        if comment_id is not None:
            request_payload['commentId'] = str(comment_id)

        # Semaphore를 사용하여 동시 요청 수 제한
        async with self.semaphore:
            try:
                # HTTP POST 요청 실행
                async with session.post(
                        self.BASE_URL,  # API 엔드포인트
                        headers=self.headers,  # 요청 헤더
                        json=request_payload,  # 요청 본문 (자동 JSON 직렬화)
                        timeout=aiohttp.ClientTimeout(total=self.DEFAULT_REQUEST_TIMEOUT)  # 타임아웃 설정
                ) as response:
                    # HTTP 상태 코드 확인 (4xx, 5xx 시 예외 발생)
                    response.raise_for_status()
                    print("응답 출력하기")
                    turn = await response.json()
                    print(turn)
                    # 응답을 JSON으로 파싱하여 반환
                    return turn

            # HTTP 응답 오류 처리 (4xx, 5xx 상태 코드)
            except aiohttp.ClientResponseError as e:
                logger.error(f"API 응답 오류 (status: {e.status}): {e.message}")
                raise

            # 타임아웃 오류 처리
            except asyncio.TimeoutError:
                logger.error(f"API 요청 타임아웃 ({self.DEFAULT_REQUEST_TIMEOUT}초)")
                raise

            # 기타 모든 오류 처리
            except Exception as e:
                logger.error(f"API 요청 실패: {e}")
                raise

    @staticmethod
    def _validate_response(response: Dict[str, Any]) -> bool:
        """
        API 응답 구조의 유효성을 검증하는 메서드

        Args:
            response: API 응답 딕셔너리

        Returns:
            bool: 유효하면 True, 아니면 False
        """
        # 응답이 비어있는지 확인
        if not response:
            return False

        # "result" 키 존재 확인
        result = response.get("result")
        if not result:
            return False

        # "comments" 키 존재 확인
        comments = result.get("comments")
        if not comments:
            return False

        # 모든 검증 통과
        return True

    @staticmethod
    def _get_comment_count(response: Dict[str, Any]) -> int:
        """
        API 응답에서 전체 댓글 개수를 추출하는 메서드

        Args:
            response: API 응답 딕셔너리

        Returns:
            int: 댓글 개수 (추출 실패 시 0)
        """
        try:
            # 중첩된 딕셔너리에서 commentCount 값 추출
            return response.get("result", {}).get('commentCount', 0)
        except Exception as e:
            # 추출 실패 시 경고 로그 출력
            logger.warning(f"댓글 개수 추출 실패: {e}")
            return 0

    @staticmethod
    @sync_to_async  # Django ORM을 비동기에서 사용하기 위한 데코레이터
    def _get_last_comment(subject_id: str) -> Optional[Comments]:
        """
        DB에서 특정 종목의 가장 최근 댓글을 조회하는 메서드
        중복 수집 방지를 위해 사용

        Args:
            subject_id: 종목 ID

        Returns:
            Optional[comments_models]: 마지막 댓글 객체 (없으면 None)
        """
        try:
            # Django ORM 쿼리 실행
            return (Comments.objects
                    .filter(subject_id=subject_id, site='TOSS')  # 조건: 해당 종목 + 토스 사이트
                    .order_by('-created_at')  # 작성일 기준 내림차순 정렬
                    .first())  # 첫 번째 결과만 반환 (가장 최근 댓글)
        except Exception as e:
            # 조회 실패 시 오류 로그 출력
            logger.error(f"마지막 댓글 조회 실패 [{subject_id}]: {e}")
            return None

    async def _save_all_comments(self,
                                 data: List[Dict[str, Any]],
                                 last_comment_id: Optional[int]) -> Dict[str, Any]:
        """
        여러 댓글을 동시에 저장하는 메서드
        중복 체크 및 병렬 저장으로 성능 최적화

        Args:
            data: 저장할 댓글 데이터 리스트
            last_comment_id: 마지막으로 저장된 댓글 ID (중복 체크용)

        Returns:
            Dict[str, Any]: {
                'saved_count': int,  # 성공적으로 저장된 댓글 수
                'next_comment_id': Optional[int],  # 다음 페이지 커서
                'stopped': bool  # 중복 발견으로 중단 여부
            }
        """
        tasks = []  # 비동기 작업 리스트
        stopped = False  # 중복 발견 플래그

        # 각 댓글 데이터를 순회하며 처리
        for json_data in data:
            # === 중복 댓글 체크 ===
            # 이전에 저장한 댓글을 만나면 더 이상 저장하지 않음
            if last_comment_id and last_comment_id == json_data.get('id'):
                logger.debug(f"중복 댓글 발견: {json_data.get('id')}")
                stopped = True
                break

            # 저장 작업을 태스크 리스트에 추가 (병렬 실행 준비)
            tasks.append(self._save_comments(json_data))

        # 저장할 댓글이 없으면 빈 결과 반환
        if not tasks:
            return {
                'saved_count': 0,
                'next_comment_id': None,
                'stopped': stopped
            }

        try:
            # === 모든 저장 작업을 동시에 실행 ===
            # return_exceptions=True: 일부 실패해도 계속 진행
            results = await asyncio.gather(*tasks, return_exceptions=True)

            # 성공한 댓글만 필터링 (예외가 발생한 경우 제외)
            saved_comments = [r for r in results if isinstance(r, Comments)]

            # 실패한 댓글 개수 계산
            failed_count = len(results) - len(saved_comments)

            # 실패가 있으면 경고 로그 출력
            if failed_count > 0:
                logger.warning(f"{failed_count}개 댓글 저장 실패")

            # 마지막으로 저장된 댓글의 ID를 다음 페이지 커서로 사용
            next_comment_id = int(saved_comments[-1].comment_id) if saved_comments else None

            # 저장 결과 반환
            return {
                'saved_count': len(saved_comments),
                'next_comment_id': next_comment_id,
                'stopped': stopped
            }

        # 저장 과정에서 예외 발생 시 처리
        except Exception as e:
            logger.error(f"댓글 일괄 저장 중 오류: {e}")
            return {
                'saved_count': 0,
                'next_comment_id': None,
                'stopped': stopped
            }

    @staticmethod
    @sync_to_async  # Django ORM을 비동기에서 사용하기 위한 데코레이터
    def _save_comments(json_data: Dict[str, Any]) -> Comments:
        """
        단일 댓글을 DB에 저장하는 메서드

        Args:
            json_data: API에서 받은 댓글 JSON 데이터

        Returns:
            comments_models: 저장된 댓글 모델 객체

        Raises:
            ValueError: 필수 필드 누락 시
            Exception: DB 저장 실패 시
        """
        try:
            # === 필수 필드 검증 ===
            # API 응답에 필수 필드가 모두 포함되어 있는지 확인
            '''
            required_fields = ['id', 'title', 'message', 'replyCount',
                               'subjectType', 'stockCode', 'subjectId', 'updatedAt']

            for field in required_fields:
                if field not in json_data:
                    raise ValueError(f"필수 필드 누락: {field}")
                    '''
            # === 댓글 모델 객체 생성 ===
            comments = Comments(
                site='TOSS',  # 출처 사이트
                comment_id=int(json_data['id']),  # 댓글 고유 ID
                title=json_data['title'],  # 댓글 제목
                message=json_data['message'],  # 댓글 본문
                reply_count=json_data['replyCount'],  # 답글 개수
                subject_type=json_data['subjectType'].upper(),  # 대상 타입 (대문자 변환)
                # 종목 코드에서 'A' 접두사 제거 (한국 종목 코드 형식)
                stock_code=json_data['stockCode'][1:] if json_data['stockCode'].startswith('A') else json_data[
                    'stockCode'],
                subject_id=json_data['subjectId'],  # 종목 ID
                created_at=datetime.fromisoformat(json_data['updatedAt'])  # 작성일 (ISO 형식 파싱)
            )
            # DB에 저장
            comments.save()
            print(f'댓글 저장 성공 : {comments.comment_id}')

            # 저장 성공 로그
            logger.debug(f"댓글 저장 성공: {comments.comment_id}")
            return comments

        # 저장 실패 시 오류 처리
        except Exception as e:
            logger.error(f"댓글 저장 실패 (ID: {json_data.get('id')}): {e}")
            raise