import glob
import os
import gitignore_parser

from llm_context_builder.datasources.interface import Datasource


def read_file(file):
    with open(file, "rb") as f:
        contents = f.read()
        if b"\x00" in contents:
            return "<BINARY CONTENT>"
        else:
            return contents.decode("utf-8", errors="replace")


class FilesystemDatasource(Datasource):
    def __init__(
            self,
            root,
            include_patterns,
            exclude_patterns,
            use_gitignore=False,
            use_common_ignore=False,
    ):
        self.root = root
        self.include_patterns = include_patterns
        self.exclude_patterns = exclude_patterns
        self.use_gitignore = use_gitignore
        self.use_common_ignore = use_common_ignore

    def get_content(self):
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
            ]

        gitignore = lambda test_path: False

        if self.use_gitignore:
            gitignore = gitignore_parser.parse_gitignore(
                os.path.join(self.root, ".gitignore")
            )
        for pattern in self.include_patterns:
            for file in glob.glob(os.path.join(self.root, pattern), recursive=True):
                if not os.path.isfile(file):
                    continue
                if not gitignore(file) and not any(
                        os.path.basename(file) == exclude_pattern
                        for exclude_pattern in exclude_patterns
                ):
                    file_path = os.path.relpath(file, self.root)
                    file_contents = read_file(file)
                    content[file_path] = file_contents

        return content
