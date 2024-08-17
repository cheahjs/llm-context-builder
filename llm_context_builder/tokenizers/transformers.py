import os

# Force enable TensorFlow to stop transformers from complaining
# We don't want to install more dependencies than necessary
os.environ["FORCE_TF_AVAILABLE"] = "1"
import transformers
from .base import Tokenizer


class TransformersTokenizer(Tokenizer):
    def __init__(self, model):
        self.model = model

    def count_tokens(self, text):
        tokenizer = transformers.AutoTokenizer.from_pretrained(self.model)
        encoded = tokenizer.encode(text)
        return len(encoded)
