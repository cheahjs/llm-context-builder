from .base import Tokenizer


class NaiveTokenizer(Tokenizer):
    async def count_tokens(self, text):
        return len(text) / 4
