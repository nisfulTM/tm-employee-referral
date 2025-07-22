from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response(
            {
                "success": True,
                "message": "Data fetched successfully",
                "data": {
                    "total": self.page.paginator.count,
                    "page": self.page.number,
                    "page_size": self.page.paginator.per_page,
                    "next": self.get_next_link(),
                    "previous": self.get_previous_link(),
                    "items": data,
                },
            }
        )
