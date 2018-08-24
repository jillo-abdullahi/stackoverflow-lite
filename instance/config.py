# instance/config.py


class Config(object):
    """Configuration for parent class"""
    DEBUG = False
    TESTING = False


class ProductionConfig(Config):
    """Configuration for production"""
    DATABASE_URI = 'postgresql://samauser:samauser@localhost/stackoverflowlite'


class DevelopmentConfig(Config):
    """Configuration for development"""
    DEBUG = True
    TESTING = True
    DATABASE_URI = 'postgresql://samauser:samauser@localhost/stackoverflowlite_test'


app_config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}
