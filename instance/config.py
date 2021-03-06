# instance/config.py


class Config(object):
    """Configuration for parent class"""
    DEBUG = False
    TESTING = False


class ProductionConfig(Config):
    """Configuration for production"""
    DATABASE_URI = 'postgresql://postgres:postgres@localhost/stackoverflowlite'


class DevelopmentConfig(Config):
    """Configuration for development"""
    DEBUG = True
    TESTING = True
    DATABASE_URI = 'postgresql://postgres:postgres@localhost/stackoverflowlite_test'


app_config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}
