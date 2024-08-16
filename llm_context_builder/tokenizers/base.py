from abc import ABC, abstractmethod


class Tokenizer(ABC):
    @abstractmethod
    def count_tokens(self, text):
        pass
