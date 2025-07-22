from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView  # Add TokenRefreshView here
# Swagger
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

schema_view = get_schema_view(
   openapi.Info(
      title="Employee Referral API",
      default_version='v1',
      description="API documentation for JWT login",
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [


    
   path('', RedirectView.as_view(url='/swagger'), name='redirect'),
   path('admin/', admin.site.urls),
   path('', include('apps.referral_app.urls')),

   path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)