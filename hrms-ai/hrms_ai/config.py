# Configuration settings for the HRMS-AI application

import os

class Config:
    DEBUG = os.getenv('DEBUG', 'False') == 'True'
    DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///hrms_ai.db')
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')
    API_VERSION = os.getenv('API_VERSION', 'v1')
    LOGGING_LEVEL = os.getenv('LOGGING_LEVEL', 'INFO')