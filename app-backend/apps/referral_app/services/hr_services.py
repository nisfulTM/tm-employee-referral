from apps.referral_app.models import Referral
from apps.referral_app.serializers.hr_serializers import GroupedReferralSerializer
from helpers.pagination import CustomPageNumberPagination

class HRActions:

    @staticmethod
    def paginate_queryset(request,queryset):
        paginator = CustomPageNumberPagination()
        result_page = paginator.paginate_queryset(queryset, request)
        return result_page
    
    @staticmethod
    def referral_list(request):
        try:
            new_list = Referral.objects.filter(status='received').order_by("id")
            active = Referral.objects.filter(status__in=['on_hold','shortlisted']).order_by("id")
            history = Referral.objects.filter(status__in=['hired','rejected']).order_by("id")
            
            grouped_data = {
                'new': new_list,
                'active': active,
                'history': history
            }
            
            serializer = GroupedReferralSerializer(grouped_data, context={'request': request})
            return serializer.data
            
        except Exception as e:
            print(f"Error in referral_list: {str(e)}")
            raise