"""
Django settings for the Nsoro backend.

Secret or machine-specific values (secret key, database address, debug mode)
are read from the .env file in this folder, so they never get committed to Git.
See .env.example for the full list.
"""

from pathlib import Path

import environ

# Folder paths: BASE_DIR is the backend/ folder.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load the .env file and declare each setting's type and default value.
env = environ.Env(
    DEBUG=(bool, False),
    ALLOWED_HOSTS=(list, []),
    CORS_ALLOWED_ORIGINS=(list, []),
)
environ.Env.read_env(BASE_DIR / ".env")

# Core security settings: the secret key signs logins and must stay private;
# DEBUG shows detailed error pages and must be off on the live site.
SECRET_KEY = env("SECRET_KEY")
DEBUG = env("DEBUG")
ALLOWED_HOSTS = env("ALLOWED_HOSTS")

# Installed apps: Django's built-in features, then third-party add-ons.
# Our own store apps (products, orders, ...) will be added at the end.
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
]

# Middleware: code that runs on every request, in order.
# CorsMiddleware must be near the top so it can add CORS headers to every response.
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# URL and server entry points.
ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

# Templates: only used by the Django admin panel (React handles the store pages).
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# Database: PostgreSQL, using the DATABASE_URL from .env
# (for example postgres://localhost:5432/nsoro).
DATABASES = {"default": env.db("DATABASE_URL")}

# Password rules for user accounts: block passwords that are too similar
# to the username, too short, too common, or only numbers.
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Language and time zone: store all times in UTC, show them in Kigali time.
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Africa/Kigali"
USE_I18N = True
USE_TZ = True

# Static files (CSS/JS for the admin panel) and media files (uploaded product photos).
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

# Default type for database ID columns: big integers, so IDs never run out.
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# CORS: which website addresses may call this API from a browser
# (the React dev server in development, the real domain in production).
CORS_ALLOWED_ORIGINS = env("CORS_ALLOWED_ORIGINS")

# Django REST Framework defaults: return JSON and split long lists into pages of 20.
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}
