from apps.referral_app.models import Referral
from apps.referral_app.serializers.hr_serializers import ReferralListSerializer
from helpers.pagination import CustomPageNumberPagination

class HRActions:
    @staticmethod
    def referral_list(request):
        try:
            referrals_list = Referral.objects.all().order_by("id")
            paginator = CustomPageNumberPagination()
            result_page = paginator.paginate_queryset(referrals_list, request)
            serializer = ReferralListSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            raise