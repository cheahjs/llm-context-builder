#!/usr/bin/env node

import { Command } from 'commander'
import { version } from '../package.json'
import { FilesystemDatasource } from './datasources/filesystem/filesystem'
import fs from 'fs'
import { NaiveTokenizer } from './tokenizers/naive'
import { TiktokenTokenizer } from './tokenizers/tiktoken'
import { GeminiTokenizer } from './tokenizers/gemini'

const program = new Command()

program
  .description('A CLI tool for bundling files, git repositories, and websites into a single file for LLM consumption')
  .version(version)
  .option('-o, --output <path>', 'Specify the output file path. Defaults to stdout (-)', '-')
  .option('--tokenizer-model [tokenizerModel]', 'Specify the tokenizer model to use for counting tokens', 'gpt-4o')
  .option('--tokenizer [tokenizer]', 'Specify the tokenizer to use for counting tokens', 'tiktoken')
  .option('--template <template>', 'Specify the per-file template to use', '<file path="{{ file_path }}">\n{{ file_contents }}\n</file>\n')
  .option('--count-tokens [countTokens]', 'Count the number of tokens used by the output', true)

program
  .command('file <path>')
  .description('Bundle a directory')
  .option('--include [patterns...]', 'Include files matching these glob patterns', ['**/*'])
  .option('--exclude [patterns...]', 'Exclude files matching these glob patterns', [])
  .option('--use-gitignore', 'Use .gitignore file to exclude files', true)
  .option('--use-common-ignore', 'Use common ignore patterns to exclude files', true)
  .action(async (path: string, options: {
    include: string[]
    exclude: string[]
    useGitignore: boolean
    useCommonIgnore: boolean
  }, cmd: Command) => {
    try {
      const datasource = new FilesystemDatasource(path, options.include, options.exclude, options.useGitignore, options.useCommonIgnore)
      const content = await datasource.getContent()
      const template = program.opts().template as string
      const output = Array.from(content.entries()).map((file) => {
        return template
          .replace('{{ file_path }}', file[0])
          .replace('{{ file_contents }}', file[1])
      }).join('\n')

      const outputPath = program.opts().output
      if (outputPath === '-') {
        console.log(output)
      } else {
        fs.writeFileSync(outputPath as string, output)
      }

      if (program.opts().countTokens) {
        const tokenizerModel = program.opts().tokenizerModel
        const tokenizerType = program.opts().tokenizer
        let tokenizer: NaiveTokenizer | TiktokenTokenizer | GeminiTokenizer
        if (tokenizerType === 'naive') {
          tokenizer = new NaiveTokenizer()
        } else if (tokenizerType === 'tiktoken') {
          tokenizer = new TiktokenTokenizer(tokenizerModel as any)
        } else if (tokenizerType === 'gemini') {
          tokenizer = new GeminiTokenizer(tokenizerModel)
        } else {
          throw new Error(`Unknown tokenizer type: ${tokenizerType}`)
        }
        const tokenCount = await tokenizer.countTokens(output)
        console.error(`Token count: ${tokenCount}`)
      }
    } catch (error: unknown) {
      console.error('An unknown error occurred:', error)
      process.exit(1)
    }
  })

program.parse(process.argv)
