#!/usr/bin/env python
"""
댓글 API 테스트 스크립트
DB에 샘플 데이터를 추가하고 API를 테스트합니다.
"""

import os
import sys
import django
from datetime import datetime, timedelta

# Django 설정
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kss.settings')
django.setup()

from crawling.models.comments_models import Comments
from crawling.models.stock_models import Stock


def create_sample_data():
    """샘플 댓글 데이터 생성"""
    print("샘플 데이터 생성 중...")
    
    # 샘플 종목 생성
    stock, created = Stock.objects.get_or_create(
        stock_code='005930',
        defaults={
            'stock_name': '삼성전자',
            'stock_type': 'STOCK',
            'stock_category': '전기전자'
        }
    )
    if created:
        print(f"✓ 종목 생성: {stock.stock_name} ({stock.stock_code})")
    else:
        print(f"✓ 종목 존재: {stock.stock_name} ({stock.stock_code})")
    
    # 샘플 댓글 생성
    sample_comments = [
        {
            'site': 'Toss',
            'message': '삼성전자 주가 상승 기대됩니다! 실적 발표가 좋았네요.',
            'title': '실적 발표 호재',
            'reply_count': 15
        },
        {
            'site': 'Naver',
            'message': '단기 조정 가능성이 있어 보입니다. 신중한 접근 필요합니다.',
            'title': '단기 조정 우려',
            'reply_count': 8
        },
        {
            'site': 'Toss',
            'message': 'AI 반도체 수요 증가로 장기 성장 전망이 밝습니다.',
            'title': 'AI 반도체 호재',
            'reply_count': 23
        },
        {
            'site': 'Naver',
            'message': '경쟁사 대비 기술력이 우수합니다. 매수 추천!',
            'title': '기술력 우위',
            'reply_count': 12
        },
        {
            'site': 'Toss',
            'message': '글로벌 시장 불확실성으로 리스크가 있습니다.',
            'title': '시장 불확실성',
            'reply_count': 6
        },
    ]
    
    created_count = 0
    for i, comment_data in enumerate(sample_comments):
        # 최근 시간대로 댓글 생성
        created_at = datetime.now() - timedelta(hours=i)
        
        comment, created = Comments.objects.get_or_create(
            site=comment_data['site'],
            comment_id=1000 + i,
            stock_code='005930',
            defaults={
                'title': comment_data['title'],
                'message': comment_data['message'],
                'reply_count': comment_data['reply_count'],
                'subject_type': 'STOCK',
                'subject_id': '005930',
                'created_at': created_at
            }
        )
        
        if created:
            created_count += 1
            print(f"✓ 댓글 생성: {comment.title}")
    
    print(f"\n총 {created_count}개의 새 댓글이 생성되었습니다.")
    print(f"전체 댓글 수: {Comments.objects.filter(stock_code='005930').count()}개\n")


def test_api():
    """API 테스트"""
    import requests
    
    base_url = 'http://localhost:8000/api'
    ticker = '005930'
    
    print("=" * 60)
    print("API 테스트 시작")
    print("=" * 60)
    
    # 1. 실시간 댓글 조회
    print("\n[1] 실시간 댓글 조회 (limit=5)")
    try:
        response = requests.get(f'{base_url}/comments/realtime/{ticker}/?limit=5')
        if response.status_code == 200:
            data = response.json()
            print(f"✓ 성공: {len(data)}개의 댓글 조회됨")
            if data:
                print(f"   첫 번째 댓글: {data[0]['text'][:30]}...")
                print(f"   감정: {data[0]['sentiment']}")
        else:
            print(f"✗ 실패: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"✗ 에러: {e}")
    
    # 2. 페이지네이션 테스트
    print("\n[2] 페이지네이션 테스트 (limit=2, offset=0)")
    try:
        response = requests.get(f'{base_url}/comments/realtime/{ticker}/?limit=2&offset=0')
        if response.status_code == 200:
            data = response.json()
            print(f"✓ 성공")
            print(f"   댓글 수: {len(data['comments'])}개")
            print(f"   전체 개수: {data['pagination']['total']}개")
            print(f"   더 보기: {data['pagination']['hasMore']}")
        else:
            print(f"✗ 실패: {response.status_code}")
    except Exception as e:
        print(f"✗ 에러: {e}")
    
    # 3. 댓글 통계
    print("\n[3] 댓글 통계")
    try:
        response = requests.get(f'{base_url}/comments/statistics/{ticker}/')
        if response.status_code == 200:
            data = response.json()
            print(f"✓ 성공")
            print(f"   전체 댓글: {data['totalComments']}개")
            print(f"   긍정 비율: {data['sentiment']['positive']}%")
            print(f"   부정 비율: {data['sentiment']['negative']}%")
        else:
            print(f"✗ 실패: {response.status_code}")
    except Exception as e:
        print(f"✗ 에러: {e}")
    
    print("\n" + "=" * 60)
    print("API 테스트 완료")
    print("=" * 60)


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='댓글 API 테스트')
    parser.add_argument('--create-data', action='store_true', help='샘플 데이터 생성')
    parser.add_argument('--test', action='store_true', help='API 테스트 실행')
    parser.add_argument('--all', action='store_true', help='데이터 생성 + API 테스트')
    
    args = parser.parse_args()
    
    if args.all or args.create_data:
        create_sample_data()
    
    if args.all or args.test:
        if not (args.all or args.create_data):
            print("주의: --test를 사용하기 전에 Django 서버가 실행 중이어야 합니다.")
            print("터미널에서 'python manage.py runserver'를 실행하세요.\n")
        test_api()
    
    if not any([args.create_data, args.test, args.all]):
        parser.print_help()
