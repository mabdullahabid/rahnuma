import os
from datetime import datetime

from django.conf import settings
from openai import OpenAI

from .options import OpenAIOptions, Options


class Bot:
    def __init__(self, options: Options, openai_options: OpenAIOptions):
        self.options = options
        self.api_key = settings.OPENAI_API_KEY
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set.")

        self.api_org = os.getenv("OPENAI_API_ORG", None)
        self.api = None  # In Python, direct API interaction will be handled by `openai` package

        self.client = OpenAI(
            # This is the default and can be omitted
            api_key=self.api_key,
        )

        # Constructing the system message
        current_date = datetime.now().date().isoformat()
        self.system_message = (
            f"{options.system_message}\n"
            f"Knowledge cutoff: {openai_options.token_limits.knowledge_cut_off}\n"
            f"Current date: {current_date}\n\n"
            f"IMPORTANT: Entire response must be in the language with ISO code: {options.language}"
        )

    def chat(self, message: str, ids: dict):
        if not message:
            return "", {}

        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "system", "content": self.system_message}, {"role": "user", "content": message}],
                model=self.options.openai_light_model,
                max_tokens=self.options.light_token_limits.response_tokens,
                temperature=self.options.openai_model_temperature,
                stop=None,  # Customize as needed
            )
            response_text = response.choices[0].message.content.strip() if response.choices else ""
            new_ids = {
                "parentMessageId": response.id,
                # "conversationId": response.conversation_id
            }
            return response_text, new_ids
        except Exception as e:
            print(f"Failed to chat: {str(e)}")
            return "", {}
