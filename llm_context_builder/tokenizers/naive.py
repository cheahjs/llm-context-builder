from .base import Tokenizer


class NaiveTokenizer(Tokenizer):
    def count_tokens(self, text):
        return len(text) / 4
