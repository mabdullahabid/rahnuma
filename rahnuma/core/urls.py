from django.urls import path

from rahnuma.core.views import RahnumaView, pull_request, summarize

app_name = "core"
urlpatterns = [
    path("", RahnumaView.as_view(), name="rahnuma"),
    path("pull-request/", pull_request, name="pull_request"),
    path("summarize/", summarize, name="summarize"),
]
