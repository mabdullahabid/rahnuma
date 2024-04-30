from django.urls import path

from . import views

app_name = "core"
urlpatterns = [
    path("", views.RahnumaView.as_view(), name="rahnuma"),
    path("pull-request/", views.pull_request, name="pull_request"),
    path("summarize/", views.pull_request, name="summarize"),
]
