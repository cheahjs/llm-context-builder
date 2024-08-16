import os
import google.generativeai as genai
from .base import Tokenizer

genai.configure(api_key=os.environ["GEMINI_API_KEY"])


class GeminiTokenizer(Tokenizer):
    def __init__(self, model_name):
        self.model = genai.GenerativeModel(model_name)

    def count_tokens(self, text):
        return self.model.count_tokens(text)
