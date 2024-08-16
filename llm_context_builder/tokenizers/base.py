from abc import ABC, abstractmethod


class Tokenizer(ABC):
    @abstractmethod
    async def count_tokens(self, text):
        pass
