import requests
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views.decorators.http import require_GET
import json

@require_GET
def get_stock_price(request, stock_code):
    """
    네이버 금융에서 주가 데이터를 가져옵니다.
    """
    try:
        days = int(request.GET.get('days', 30))
        
        # 네이버 금융 API URL
        # 실제로는 네이버 금융 크롤링 또는 KRX API 사용
        url = f"https://api.finance.naver.com/siseJson.naver?symbol={stock_code}&requestType=1&startTime=&endTime=&timeframe=day"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://finance.naver.com/'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            # 네이버 금융 응답 파싱
            text = response.text
            # JSON 파싱 (네이버 금융은 특수한 형태로 반환)
            data = parse_naver_finance_data(text)
            
            # 최근 N일 데이터만 반환
            recent_data = data[-days:] if len(data) > days else data
            
            return JsonResponse(recent_data, safe=False)
        else:
            # 실패 시 Mock 데이터 반환
            return JsonResponse(generate_mock_stock_data(days), safe=False)
            
    except Exception as e:
        print(f"주가 데이터 로딩 에러: {e}")
        # 에러 시 Mock 데이터 반환
        return JsonResponse(generate_mock_stock_data(days), safe=False)


def parse_naver_finance_data(text):
    """
    네이버 금융 데이터 파싱
    """
    try:
        # 네이버 금융은 JavaScript 배열 형태로 반환
        # eval 대신 정규식으로 안전하게 파싱
        import re
        
        # [[날짜, 시가, 고가, 저가, 종가, 거래량], ...] 형태
        pattern = r'\[(.*?)\]'
        matches = re.findall(pattern, text)
        
        result = []
        for match in matches:
            items = match.split(',')
            if len(items) >= 5:
                try:
                    date_str = items[0].strip().replace('"', '')
                    close_price = float(items[4].strip())
                    
                    result.append({
                        'date': date_str,
                        'close': int(close_price)
                    })
                except (ValueError, IndexError):
                    continue
        
        return result
    except Exception as e:
        print(f"네이버 금융 데이터 파싱 에러: {e}")
        return []


def generate_mock_stock_data(days):
    """
    Mock 주가 데이터 생성
    """
    base_price = 50000
    result = []
    today = datetime.now()
    
    for i in range(days):
        date = today - timedelta(days=days - i - 1)
        # 랜덤한 주가 변동
        price_change = (hash(f"{date.date()}{i}") % 10000 - 5000)
        price = base_price + price_change
        
        result.append({
            'date': date.strftime('%m/%d'),
            'close': int(price)
        })
    
    return result
