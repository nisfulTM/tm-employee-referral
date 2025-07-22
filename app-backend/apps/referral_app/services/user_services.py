from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from apps.referral_app.models import UserToken


class UserActions:

    @staticmethod

    def get_tokens_for_user(user):
        try:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            UserToken.objects.create(
                user=user,
                refresh_token=refresh_token,
                access_token=access_token,
            )
        
            return {
                'refresh': refresh_token,
                'access': access_token,
            }
        except:
            raise

 