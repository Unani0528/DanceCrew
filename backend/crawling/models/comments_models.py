from django.db import models

class Comments(models.Model):
    # PK
    idx = models.AutoField(primary_key=True)

    # Toss/Naver 구분용
    site = models.CharField(max_length=5)

    # 댓글 id
    comment_id = models.BigIntegerField()

    # 글 제목
    title = models.CharField(max_length=50)

    # 글 본문
    message = models.TextField()

    # 글에 달린 댓글 수
    reply_count = models.IntegerField()

    # 종목의 종류(STOCK...)
    subject_type = models.CharField(max_length=10)

    # FK 종목 코드
    stock_code = models.CharField(max_length=20)

    # 종목 id(Toss 내부용)
    subject_id = models.CharField(max_length=20)

    # 댓글이 작성된 날짜
    created_at = models.DateTimeField(auto_now_add=False)

    class Meta:
        app_label = 'kss'
        db_table = 'comments'