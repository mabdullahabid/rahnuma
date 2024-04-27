from fnmatch import fnmatch

from .limits import TokenLimits


class Options:
    def __init__(
        self,
        debug=False,
        disable_review=False,
        disable_release_notes=False,
        max_files=0,
        review_simple_changes=False,
        review_comment_lgtm=False,
        path_filters=None,
        system_message="",
        openai_light_model="gpt-3.5-turbo",
        openai_heavy_model="gpt-3.5-turbo",
        openai_model_temperature=0.0,
        openai_retries=3,
        openai_timeout_ms=120000,
        openai_concurrency_limit=6,
        github_concurrency_limit=6,
        api_base_url="https://api.openai.com/v1",
        language="en-US",
    ):
        self.debug = debug
        self.disable_review = disable_review
        self.disable_release_notes = disable_release_notes
        self.max_files = int(max_files)
        self.review_simple_changes = review_simple_changes
        self.review_comment_lgtm = review_comment_lgtm
        self.path_filters = PathFilter(path_filters)
        self.system_message = system_message
        self.openai_light_model = openai_light_model
        self.openai_heavy_model = openai_heavy_model
        self.openai_model_temperature = float(openai_model_temperature)
        self.openai_retries = int(openai_retries)
        self.openai_timeout_ms = int(openai_timeout_ms)
        self.openai_concurrency_limit = int(openai_concurrency_limit)
        self.github_concurrency_limit = int(github_concurrency_limit)
        # Assuming TokenLimits class implementation is provided or adapted
        self.light_token_limits = TokenLimits(openai_light_model)
        self.heavy_token_limits = TokenLimits(openai_heavy_model)
        self.api_base_url = api_base_url
        self.language = language

    def print(self):
        # Assuming a function or method to log or print info
        print(f"debug: {self.debug}")
        # Additional properties printed similarly...


class PathFilter:
    def __init__(self, rules=None):
        self.rules = []
        if rules is not None:
            for rule in rules:
                trimmed = rule.strip()
                if trimmed:
                    if trimmed.startswith("!"):
                        self.rules.append((trimmed[1:].strip(), True))
                    else:
                        self.rules.append((trimmed, False))

    def check(self, path):
        if not self.rules:
            return True

        included = False
        excluded = False
        inclusion_rule_exists = False

        for rule, exclude in self.rules:
            if fnmatch(path, rule):
                if exclude:
                    excluded = True
                else:
                    included = True
                if not exclude:
                    inclusion_rule_exists = True

        return (not inclusion_rule_exists or included) and not excluded


class OpenAIOptions:
    def __init__(self, model="gpt-3.5-turbo", token_limits=None):
        self.model = model
        self.token_limits = token_limits if token_limits is not None else TokenLimits(model)
