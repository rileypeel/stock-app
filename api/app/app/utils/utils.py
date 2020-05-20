from django.core.management.utils import get_random_secret_key


def new_secret_key():
    """Generate a new secret key and write it to .env.dev"""
    new_key = get_random_secret_key()
    f = open(".env.dev", "a")
    f.write(f"\nSECRET_KEY={new_key}")
    f.close()
    return new_key
