from storages.backends.s3boto3 import S3Boto3Storage
from django.conf import settings


class StaticStorage(S3Boto3Storage):
    location = 'static'
    default_acl = 'private'


class PublicMediaStorage(S3Boto3Storage):
    location = 'media'
    default_acl = 'private'
    file_overwrite = False