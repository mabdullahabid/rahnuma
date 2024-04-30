import logging

from django.conf import settings

# Authentication is defined via github.Auth
from github import Auth, Github


def get_pull_request(repo_name: str, pr_number: int):
    # using an access token
    auth = Auth.Token(settings.GITHUB_TOKEN)

    # Public Web Github
    g = Github(auth=auth)

    repo = g.get_repo(repo_name)
    pr = repo.get_pull(pr_number)
    logging.info(pr)

    g.close()

    return pr
