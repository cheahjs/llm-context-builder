#!/usr/bin/env node

import { Command } from 'commander'
import { version } from '../package.json'
import { FilesystemDatasource } from './datasources/filesystem/filesystem'

const program = new Command()

program
  .description('A CLI tool for bundling files, git repositories, and websites into a single file for LLM consumption')
  .version(version)
  .option('-o, --output <path>', 'Specify the output file path. Defaults to stdout (-)', '-')
  .option('--tokenizer-model [tokenizerModel]', 'Specify the tokenizer model to use for counting tokens', 'gpt-4o')
  .option('--tokenizer [tokenizer]', 'Specify the tokenizer to use for counting tokens', 'tiktoken')
  .option('--template <template>', 'Specify the per-file template to use', '<{{ file_path }}>\n{{ file_contents }}\n</{{ file_path }}>\n')

program
  .command('file <path>')
  .description('Bundle a directory')
  .option('--include [patterns...]', 'Include files matching these glob patterns', '**/*')
  .option('--exclude [patterns...]', 'Exclude files matching these glob patterns')
  .option('--use-gitignore', 'Use .gitignore file to exclude files')
  .action(async (path: string, options: { include: string[], exclude: string[], useGitignore: boolean }, cmd: Command) => {
    try {
      const datasource = new FilesystemDatasource(path, options.include, options.exclude, options.useGitignore)
      const content = await datasource.getContent()
      const template = cmd.opts().template
      const filePaths = Array.from(content.keys())
      const output = filePaths.map(filePath => {
        return template
          .replace('{{ file_path }}', filePath)
          .replace('{{ file_contents }}', content.get(filePath) ?? '')
      }).join('\n')

      const outputPath = cmd.opts().output;
      if (outputPath === '-') {
        console.log(output);
      } else {
        // TODO: Implement writing to file
        console.log(`Output should be written to ${outputPath}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`)
      } else {
        console.error('An unknown error occurred:', error)
      }
      process.exit(1)
    }
  })

program.parse(process.argv)
