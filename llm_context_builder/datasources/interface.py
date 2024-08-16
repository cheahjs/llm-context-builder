from typing import Mapping


class Datasource:
    async def get_content(self) -> Mapping[str, str]:
        raise NotImplementedError
