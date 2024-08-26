from .base import Tokenizer


class NaiveTokenizer(Tokenizer):
    def count_tokens(self, text):
        return int(len(text) / 4)
