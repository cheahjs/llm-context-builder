import os
import google.generativeai as genai
from .base import Tokenizer


class GeminiTokenizer(Tokenizer):
    def __init__(self, model_name):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(model_name)

    def count_tokens(self, text):
        return self.model.count_tokens(text)
