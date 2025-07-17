import environ,os

env = environ.Env(
    DEBUG=(bool, False),
)

def get_env_value(key, default=None):
    try:
        return env(key, default=default)
    except environ.ImproperlyConfigured:
        return os.environ.get(key, default)