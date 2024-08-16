import tiktoken

class TiktokenTokenizer:
    def __init__(self, model):
        self.enc = tiktoken.encoding_for_model(model)

    async def count_tokens(self, text):
        encoded_text = self.enc.encode(text)
        token_count = len(encoded_text)
        return token_count
