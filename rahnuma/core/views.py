from core.services.pull_request import get_pull_request
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse
from django.views.generic import TemplateView


class RahnumaView(LoginRequiredMixin, TemplateView):
    template_name = "pages/rahnuma.html"


def pull_request(request):
    repo_name = request.POST.get("repo_name")
    pr_number = int(request.POST.get("pr_number"))
    pr = get_pull_request(repo_name, pr_number)
    return HttpResponse(pr)


def summarize(request):
    repo_name = request.POST.get("repo_name")
    pr_number = int(request.POST.get("pr_number"))
    # summary = summarize(repo_name, pr_number)
    response = f"Summary of {repo_name} PR {pr_number}"
    return HttpResponse(response)
