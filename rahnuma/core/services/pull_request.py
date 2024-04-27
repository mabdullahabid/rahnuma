from django.conf import settings

# Authentication is defined via github.Auth
from github import Auth, Github

# using an access token
auth = Auth.Token(settings.GITHUB_TOKEN)

# Public Web Github
g = Github(auth=auth)

repo = g.get_repo("mabdullahabid/rahnuma")
pr = repo.get_pull(1)
print(pr)

g.close()
