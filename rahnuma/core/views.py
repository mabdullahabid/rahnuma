from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView


class RahnumaView(LoginRequiredMixin, TemplateView):
    template_name = "pages/rahnuma.html"
