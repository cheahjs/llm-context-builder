import tiktoken
from .base import Tokenizer


class TiktokenTokenizer(Tokenizer):
    def __init__(self, model):
        self.enc = tiktoken.encoding_for_model(model)

    def count_tokens(self, text):
        encoded_text = self.enc.encode(text)
        token_count = len(encoded_text)
        return token_count
