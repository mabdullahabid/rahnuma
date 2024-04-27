class TokenLimits:
    def __init__(self, model="gpt-3.5-turbo"):
        self.knowledge_cut_off = "2021-09-01"
        if model == "gpt-4-32k":
            self.max_tokens = 32600
            self.response_tokens = 4000
        elif model == "gpt-3.5-turbo-16k":
            self.max_tokens = 16300
            self.response_tokens = 3000
        elif model == "gpt-4":
            self.max_tokens = 8000
            self.response_tokens = 2000
        elif model == "gpt-3.5-turbo-0125":
            self.max_tokens = 16385
            self.response_tokens = 4096
        else:
            self.max_tokens = 4000
            self.response_tokens = 1000
        # Provide some margin for the request tokens
        self.request_tokens = self.max_tokens - self.response_tokens - 100

    def __str__(self):
        return f"max_tokens={self.max_tokens}, request_tokens={self.request_tokens}, \
            response_tokens={self.response_tokens}"
