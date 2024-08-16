import transformers

class TransformersTokenizer:
    def __init__(self, model):
        self.model = model

    async def count_tokens(self, text):
        tokenizer = transformers.AutoTokenizer.from_pretrained(self.model)
        encoded = tokenizer.encode(text)
        return len(encoded)
