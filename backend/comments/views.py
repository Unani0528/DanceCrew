from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from crawling.models.comments_models import Comments  # Comment 모델 임포트 (실제 모델명에 맞게 수정)


# 댓글의 마지막 업데이트 날짜 확인하기
def get_last_update(request):
    try:
        # 가장 최근 댓글 가져오기 (created_at 기준 최신순)
        last_comment = Comments.objects.latest('created_at')

        # 날짜 포맷팅 (예: 2025.11.24)
        last_update = last_comment.created_at.strftime("%Y.%m.%d")

    except Comments.DoesNotExist:
        # 댓글이 하나도 없을 경우
        last_update = "데이터 없음"

    data = {
        "last_update": last_update
    }
    return JsonResponse(data)

