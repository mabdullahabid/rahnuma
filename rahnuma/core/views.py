from core.services.code_review import code_review
from core.services.pull_request import get_repo_and_pr
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse
from django.views.generic import TemplateView


class RahnumaView(LoginRequiredMixin, TemplateView):
    template_name = "pages/rahnuma.html"


def pull_request(request):
    repo_name = request.POST.get("repo_name")
    pr_number = int(request.POST.get("pr_number"))
    repo, pr = get_repo_and_pr(repo_name, pr_number)
    return HttpResponse(f"{repo}<br>{pr}")


def summarize(request):
    repo_name = request.POST.get("repo_name")
    pr_number = int(request.POST.get("pr_number"))
    repo, pr = get_repo_and_pr(repo_name, pr_number)
    summary = code_review(repo, pr)
    return HttpResponse(summary, content_type="text/plain")
