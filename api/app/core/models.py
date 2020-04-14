from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings


class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        """Creates and saves a new user"""
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        """Creates and saves new superuser"""
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model that supports using email instead of username"""
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()
    USERNAME_FIELD = 'email'


class MinutePrice(models.Model):
    """Model for minute price data of a stock"""
    stock = models.ForeignKey('Stock', on_delete=models.CASCADE)
    time_stamp = models.DateTimeField()
    open_price = models.DecimalField(
        max_digits=10, decimal_places=4, blank=True, null=True)
    close_price = models.DecimalField(max_digits=10, decimal_places=4)
    high_price = models.DecimalField(
        max_digits=10, decimal_places=4, blank=True, null=True)
    low_price = models.DecimalField(
        max_digits=10, decimal_places=4, blank=True, null=True)
    volume = models.IntegerField()

    class Meta:
        unique_together = ('stock', 'time_stamp')


class DailyPrice(models.Model):
    """Model for daily price data of a stock"""
    stock = models.ForeignKey('Stock', on_delete=models.CASCADE)
    time_stamp = models.DateTimeField()
    open_price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True)
    close_price = models.DecimalField(max_digits=10, decimal_places=2)
    high_price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True)
    low_price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True)
    volume = models.IntegerField()
    #market_closed = models.BooleanField()

    class Meta:
        unique_together = ('stock', 'time_stamp')


class Stock(models.Model):
    """Model for stock data"""
    name = models.CharField(max_length=255, blank=True, null=True)
    ticker = models.CharField(max_length=255, unique=True)
    latest_price_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.ticker


class Holding(models.Model):
    """Model for a stock being held in a portfolio"""
    number_of_shares = models.IntegerField()
    stock = models.ForeignKey('Stock', on_delete=models.CASCADE)
    portfolio = models.ForeignKey(
        'Portfolio', related_name='holdings', on_delete=models.CASCADE)
    average_cost = models.DecimalField(decimal_places=2, max_digits=10, default=69.00)
    def __str__(self):
        """String representaion of a holding"""
        return f"{self.number_of_shares} shares of {self.stock}"

class PortfolioBalance(models.Model):
    """Model for recording account balance history of a portfolio."""
    time_stamp = models.DateTimeField()
    portfolio = models.ForeignKey('Portfolio', on_delete=models.CASCADE)
    eod_balance = models.DecimalField(max_digits=10, decimal_places=2)

class Portfolio(models.Model):
    """Model for a users stock portfolio"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=255)
    balance = models.DecimalField(
        max_digits=15, decimal_places=2, default=10000.00)

    def __str__(self):
        """String representation of a Portfolio"""
        return self.name


class Transaction(models.Model):
    """Model for a recording a stock market transaction"""
    portfolio = models.ForeignKey('Portfolio', on_delete=models.CASCADE)
    stock = models.ForeignKey('Stock', on_delete=models.CASCADE)
    is_buy = models.BooleanField()
    price = models.DecimalField(max_digits=10, decimal_places=3)
    number_of_shares = models.IntegerField()
    limit_price = models.DecimalField(max_digits=10, decimal_places=3, null=True)
    order_type = models.CharField(max_length=255, default='Market')
    time_stamp = models.DateTimeField(auto_now_add=True, blank=True, null=True)


    def __str__(self):
        """String representation of a Transaction"""
        if self.is_buy:
            return f"BUY {self.stock} {self.number_of_shares} @ {self.price_per_share}"
        else:
            return f"SELL {self.stock} {self.number_of_shares} @ {self.price_per_share}"
