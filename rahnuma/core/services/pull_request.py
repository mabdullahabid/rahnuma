from django.conf import settings

# Authentication is defined via github.Auth
from github import Auth, Github


def get_repo_and_pr(repo_name: str, pr_number: int):
    auth = Auth.Token(settings.GITHUB_TOKEN)
    g = Github(auth=auth)
    repo = g.get_repo(repo_name)
    pr = repo.get_pull(pr_number)
    return repo, pr
