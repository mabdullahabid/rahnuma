from django.urls import path

from .views import RahnumaView

app_name = "core"
urlpatterns = [
    path("", RahnumaView.as_view(), name="rahnuma"),
]
