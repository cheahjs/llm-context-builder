import os
import gitignore_parser
import fnmatch
from typing import Dict, List

from llm_context_builder.datasources.interface import Datasource


def read_file(file: str) -> str:
    with open(file, "rb") as f:
        contents = f.read()
        if b"\x00" in contents:
            return "<BINARY CONTENT>"
        else:
            return contents.decode("utf-8", errors="replace")

def always_false(test_path: str) -> bool:
    return False

class FilesystemDatasource(Datasource):
    def __init__(
            self,
            root: str,
            include_patterns: List[str],
            exclude_patterns: List[str],
            use_gitignore: bool = False,
            use_common_ignore: bool = False,
    ) -> None:
        self.root = root
        self.include_patterns = include_patterns
        self.exclude_patterns = exclude_patterns
        self.use_gitignore = use_gitignore
        self.use_common_ignore = use_common_ignore

    def get_content(self) -> Dict[str, str]:
        content = {}
        exclude_patterns = self.exclude_patterns

        if self.use_common_ignore:
            exclude_patterns += [
                "LICENSE",
                "LICENSE.md",
                "LICENSE.txt",
                "package-lock.json",
                "yarn.lock",
                "pnpm-lock.yaml",
                "npm-shrinkwrap.json",
                "go.sum",
                "requirements-lock.txt",
                "Cargo.lock",
                "composer.lock",
                "Podfile.lock",
                "poetry.lock",
                ".git",
            ]

        gitignore = always_false

        if self.use_gitignore:
            gitignore = gitignore_parser.parse_gitignore(
                os.path.join(self.root, ".gitignore")
            )

        for dirpath, dirnames, filenames in os.walk(self.root, topdown=True):
            for dirname in list(dirnames):
                dir_path = os.path.join(dirpath, dirname)
                dir_relpath = os.path.relpath(dir_path, self.root)

                if gitignore(dir_path) or any(
                        fnmatch.fnmatch(dir_relpath, exclude_pattern)
                        for exclude_pattern in exclude_patterns
                ):
                    dirnames.remove(dirname)

            for filename in filenames:
                file_path = os.path.join(dirpath, filename)
                file_relpath = os.path.relpath(file_path, self.root)

                if not any(fnmatch.fnmatch(file_relpath, pattern) for pattern in self.include_patterns):
                    continue

                if gitignore(file_path) or any(
                        fnmatch.fnmatch(file_relpath, exclude_pattern)
                        for exclude_pattern in exclude_patterns
                ):
                    continue

                file_contents = read_file(file_path)
                content[file_relpath] = file_contents

        return content
