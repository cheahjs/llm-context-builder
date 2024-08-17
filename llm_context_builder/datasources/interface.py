from typing import Mapping
from abc import ABC, abstractmethod


class Datasource(ABC):
    @abstractmethod
    def get_content(self) -> Mapping[str, str]:
        raise NotImplementedError
