import os

class Config:
    # MySQL Configurations
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'newuser'
    MYSQL_PASSWORD = 'newpassword'
    MYSQL_DB = 'recent_db'
    
    # Clerk Configurations
    CLERK_API_KEY = os.getenv('CLERK_API_KEY', 'your_clerk_api_key')
    CLERK_FRONTEND_API = os.getenv('CLERK_FRONTEND_API', 'your_clerk_frontend_api')
    CLERK_BACKEND_API = os.getenv('CLERK_BACKEND_API', 'your_clerk_backend_api')

    # CORS Configurations
    CORS_HEADERS = 'Content-Type'
    CORS_RESOURCES = {r"/data": {"origins": "http://localhost:5173"}}  # Example CORS setup

    # General Config (if needed)
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')
    DEBUG = os.getenv('DEBUG', True)
