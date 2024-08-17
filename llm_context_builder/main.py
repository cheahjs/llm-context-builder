import argparse
import os
import sys
from typing import Optional

from llm_context_builder.datasources.interface import Datasource
from .datasources.filesystem import FilesystemDatasource
from .tokenizers.naive import NaiveTokenizer
from .tokenizers.tiktoken import TiktokenTokenizer
from .tokenizers.gemini import GeminiTokenizer
from .tokenizers.transformers import TransformersTokenizer


def main():
    parser = argparse.ArgumentParser(
        description="A CLI tool for bundling files, git repositories, and websites into a single file for LLM consumption"
    )
    parser.add_argument(
        "-o",
        "--output",
        help="Specify the output file path. Defaults to stdout (-)",
        default="-",
    )
    parser.add_argument(
        "--tokenizer-model",
        help="Specify the tokenizer model to use for counting tokens",
        default="gpt-4o",
    )
    parser.add_argument(
        "--tokenizer",
        help="Specify the tokenizer to use for counting tokens",
        default="tiktoken",
    )
    parser.add_argument(
        "--template",
        help="Specify the per-file template to use",
        default='<file path="{{ file_path }}">\n{{ file_contents }}\n</file>\n',
    )
    parser.add_argument(
        "--count-tokens",
        help="Count the number of tokens used by the output",
        action="store_true",
    )
    parser.add_argument(
        "--no-count-tokens",
        help="Do not count the number of tokens used by the output",
        action="store_false",
        dest="count_tokens",
    )
    parser.set_defaults(count_tokens=True)

    subparsers = parser.add_subparsers(dest="command")

    file_parser = subparsers.add_parser("file")
    file_parser.add_argument("path", help="Bundle a directory")
    file_parser.add_argument(
        "--include",
        nargs="+",
        help="Include files matching these glob patterns",
        default=["**/*"],
    )
    file_parser.add_argument(
        "--exclude",
        nargs="+",
        help="Exclude files matching these glob patterns",
        default=[],
    )
    file_parser.add_argument(
        "--use-gitignore",
        help="Use .gitignore file to exclude files",
        action="store_true",
    )
    file_parser.add_argument(
        "--no-use-gitignore",
        help="Do not use .gitignore file to exclude files",
        action="store_false",
        dest="use_gitignore",
    )
    file_parser.add_argument(
        "--use-common-ignore",
        help="Use common ignore patterns to exclude files",
        action="store_true",
    )
    file_parser.add_argument(
        "--no-use-common-ignore",
        help="Do not use common ignore patterns to exclude files",
        action="store_false",
        dest="use_common_ignore",
    )
    file_parser.set_defaults(use_gitignore=True, use_common_ignore=True)

    args = parser.parse_args()

    datasource: Optional[Datasource] = None

    if args.command == "file":
        datasource = FilesystemDatasource(
            args.path,
            args.include,
            args.exclude,
            args.use_gitignore,
            args.use_common_ignore,
        )
    else:
        parser.print_help()
        return

    if datasource is not None:
        content = datasource.get_content()
        template = args.template
        output = "\n".join(
            template.replace("{{ file_path }}", file_path).replace(
                "{{ file_contents }}", file_contents
            )
            for file_path, file_contents in content.items()
        )

        if args.output == "-":
            sys.stdout.write(output)
        else:
            with open(args.output, "w") as f:
                f.write(output)

        if args.count_tokens:
            tokenizer_model = args.tokenizer_model
            tokenizer_type = args.tokenizer
            if tokenizer_type == "naive":
                tokenizer = NaiveTokenizer()
            elif tokenizer_type == "tiktoken":
                tokenizer = TiktokenTokenizer(tokenizer_model)
            elif tokenizer_type == "gemini":
                tokenizer = GeminiTokenizer(tokenizer_model)
            elif tokenizer_type == "transformers":
                tokenizer = TransformersTokenizer(tokenizer_model)
            else:
                print(f"Unknown tokenizer type: {tokenizer_type}")
                return
            token_count = tokenizer.count_tokens(output)
            print(
                f"Token count: {token_count} (characters: {len(output)}, tokenizer: {tokenizer_type}, model: {tokenizer_model})"
            )


if __name__ == "__main__":
    main()
