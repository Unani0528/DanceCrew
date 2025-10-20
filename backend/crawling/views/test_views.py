import aiohttp
from django.http import JsonResponse
from . import toss_comments_crawler_view
async def test(request, subject_id):
    scraper = toss_comments_crawler_view()

    if not subject_id:
        return JsonResponse({
            'success':False,
            'message':'subject_id가 필요합니다.'
            }, status=400)

    async with aiohttp.ClientSession() as session:
        result = await scraper.get_comments(subject_id=subject_id,
                                            session=session,
                                            delay=0)

    return JsonResponse(result)