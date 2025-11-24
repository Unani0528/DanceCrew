from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.core.paginator import Paginator
from ..models.comments_models import Comments
from ..models.stock_models import Stock


@require_GET
def get_realtime_comments(request, ticker):
    """
    실시간 댓글 API - DB에서 최신 댓글을 조회하여 반환
    
    Parameters:
    - ticker: 종목 코드 (예: 005930)
    - limit: 반환할 댓글 개수 (기본: 5)
    - offset: 페이지네이션 오프셋 (기본: 0)
    
    Returns:
    - List of comments with sentiment analysis
    """
    try:
        # 쿼리 파라미터 가져오기
        limit = int(request.GET.get('limit', 5))
        offset = int(request.GET.get('offset', 0))
        
        # 종목 코드로 댓글 조회 (최신순 정렬)
        comments_queryset = Comments.objects.filter(
            stock_code=ticker
        ).order_by('-created_at')
        
        # 페이지네이션 적용
        total_count = comments_queryset.count()
        comments = comments_queryset[offset:offset + limit]
        
        # JSON 형식으로 변환
        result = []
        for comment in comments:
            # 간단한 감정 분석 (실제로는 NLP 모델 사용)
            sentiment = analyze_sentiment(comment.message)
            
            result.append({
                'id': f'comment-{comment.idx}',
                'author': f'{comment.site}사용자',  # 실제 사용자명이 없으므로 사이트 정보로 대체
                'text': comment.message,
                'title': comment.title if comment.title else None,
                'timestamp': comment.created_at.isoformat(),
                'sentiment': sentiment,
                'votes': comment.reply_count,  # reply_count를 votes로 매핑 (프론트엔드 타입에 맞춤)
                'site': comment.site,
                'commentId': str(comment.comment_id),
            })
        
        # 페이지네이션 정보 포함
        response_data = {
            'comments': result,
            'pagination': {
                'total': total_count,
                'limit': limit,
                'offset': offset,
                'hasMore': (offset + limit) < total_count
            }
        }
        
        # limit만 요청한 경우 (기존 API 호환성)
        if 'offset' not in request.GET:
            return JsonResponse(result, safe=False)
        
        return JsonResponse(response_data, safe=False)
        
    except Stock.DoesNotExist:
        return JsonResponse({
            'error': f'종목 코드 {ticker}를 찾을 수 없습니다.'
        }, status=404)
    except ValueError as e:
        return JsonResponse({
            'error': f'잘못된 파라미터: {str(e)}'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'error': f'서버 오류: {str(e)}'
        }, status=500)


def analyze_sentiment(text):
    """
    간단한 감정 분석 함수
    TODO: 실제 NLP 모델 (KoBERT, KoELECTRA 등) 사용하여 정확도 향상
    
    Parameters:
    - text: 분석할 텍스트
    
    Returns:
    - 'positive' or 'negative'
    """
    # 긍정 키워드
    positive_keywords = [
        '상승', '매수', '좋', '기대', '성장', '호재', '급등',
        '투자', '추천', '전망', '개선', '증가', '최고', '성공',
        '긍정', '수익', '이익', '돌파', '강세'
    ]
    
    # 부정 키워드
    negative_keywords = [
        '하락', '매도', '나쁘', '우려', '감소', '악재', '급락',
        '위험', '손실', '하락세', '부정', '실망', '최악', '실패',
        '약세', '조정', '하방', '리스크', '불안'
    ]
    
    # 키워드 카운트
    positive_count = sum(1 for keyword in positive_keywords if keyword in text)
    negative_count = sum(1 for keyword in negative_keywords if keyword in text)
    
    # 감정 판단
    if positive_count > negative_count:
        return 'positive'
    elif negative_count > positive_count:
        return 'negative'
    else:
        # 동점이거나 키워드가 없으면 중립으로 처리 (일단 positive로)
        return 'positive'


@require_GET
def get_comments_by_date_range(request, ticker):
    """
    날짜 범위로 댓글 조회 API
    
    Parameters:
    - ticker: 종목 코드
    - start_date: 시작 날짜 (YYYY-MM-DD)
    - end_date: 종료 날짜 (YYYY-MM-DD)
    - limit: 반환할 댓글 개수 (기본: 100)
    """
    try:
        from datetime import datetime
        
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        limit = int(request.GET.get('limit', 100))
        
        if not start_date or not end_date:
            return JsonResponse({
                'error': 'start_date와 end_date 파라미터가 필요합니다.'
            }, status=400)
        
        # 날짜 형식 변환
        start_dt = datetime.strptime(start_date, '%Y-%m-%d')
        end_dt = datetime.strptime(end_date, '%Y-%m-%d')
        
        # 댓글 조회
        comments = Comments.objects.filter(
            stock_code=ticker,
            created_at__gte=start_dt,
            created_at__lte=end_dt
        ).order_by('-created_at')[:limit]
        
        # JSON 변환
        result = []
        for comment in comments:
            sentiment = analyze_sentiment(comment.message)
            result.append({
                'id': f'comment-{comment.idx}',
                'text': comment.message,
                'title': comment.title,
                'timestamp': comment.created_at.isoformat(),
                'sentiment': sentiment,
                'site': comment.site,
            })
        
        return JsonResponse(result, safe=False)
        
    except ValueError as e:
        return JsonResponse({
            'error': f'날짜 형식 오류: {str(e)}. YYYY-MM-DD 형식을 사용하세요.'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'error': f'서버 오류: {str(e)}'
        }, status=500)


@require_GET
def get_comment_statistics(request, ticker):
    """
    댓글 통계 API
    
    Returns:
    - 총 댓글 수
    - 긍정/부정 비율
    - 사이트별 댓글 수
    - 일별 댓글 추이
    """
    try:
        from django.db.models import Count, Q
        from datetime import datetime, timedelta
        
        # 전체 댓글 수
        total_comments = Comments.objects.filter(stock_code=ticker).count()
        
        # 사이트별 댓글 수
        site_stats = Comments.objects.filter(
            stock_code=ticker
        ).values('site').annotate(
            count=Count('idx')
        )
        
        # 최근 30일 일별 댓글 수
        thirty_days_ago = datetime.now() - timedelta(days=30)
        recent_comments = Comments.objects.filter(
            stock_code=ticker,
            created_at__gte=thirty_days_ago
        )
        
        # 간단한 감정 분석 (전체 댓글 샘플링)
        sample_comments = Comments.objects.filter(stock_code=ticker).order_by('-created_at')[:100]
        positive_count = 0
        negative_count = 0
        
        for comment in sample_comments:
            sentiment = analyze_sentiment(comment.message)
            if sentiment == 'positive':
                positive_count += 1
            else:
                negative_count += 1
        
        total_sample = positive_count + negative_count
        positive_ratio = positive_count / total_sample if total_sample > 0 else 0
        negative_ratio = negative_count / total_sample if total_sample > 0 else 0
        
        return JsonResponse({
            'totalComments': total_comments,
            'sentiment': {
                'positive': round(positive_ratio * 100, 1),
                'negative': round(negative_ratio * 100, 1),
                'sampleSize': total_sample
            },
            'bySite': list(site_stats),
            'recentComments': recent_comments.count()
        })
        
    except Exception as e:
        return JsonResponse({
            'error': f'서버 오류: {str(e)}'
        }, status=500)
