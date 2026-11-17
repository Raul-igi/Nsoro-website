"""
URL routes for the backend: which address goes to which code.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import path


# Health check: a tiny endpoint the frontend (or a hosting service)
# can call to confirm the backend is up and running.
def health(request):
    return JsonResponse({"status": "ok"})


# Address list:
# - /admin/        Django's admin panel for managing the store
# - /api/health/   the health check above
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health),
]

# In development only, let Django serve uploaded product images itself.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
