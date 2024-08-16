from typing import Mapping


class Datasource:
    def get_content(self) -> Mapping[str, str]:
        raise NotImplementedError
