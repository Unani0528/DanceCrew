from django.db import models

class Stock(models.Model):
    # PK
    idx = models.AutoField(primary_key=True)

    # 종목 코드 FK
    stock_code = models.CharField(max_length=20, unique=True)

    # 종목 이름
    stock_name = models.CharField(max_length=50, unique=True)

    # 종목 종류(STOCK...)
    stock_type = models.CharField(max_length=10, unique=True)

    # 업종
    stock_category = models.CharField(max_length=10, unique=True)

    class Meta:
        db_table = 'stock'