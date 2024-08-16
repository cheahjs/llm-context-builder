import os
import google.auth
from googleapiclient.discovery import build
from .base import Tokenizer


class GeminiTokenizer(Tokenizer):
    def __init__(self, model_name):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set.")
        self.model = (
            build("generativeai", "v1", credentials=google.auth.JWT(api_key))
            .models()
            .get(model=model_name)
            .execute()
        )

    async def count_tokens(self, text):
        response = self.model.countTokens(text=text).execute()
        return response["totalTokens"]
