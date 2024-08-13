import globby from 'globby'
import path from 'node:path'
import { readFile } from 'fs/promises'
import { type Datasource } from '../interface'
import { isBinaryFile } from 'isbinaryfile'

const COMMONLY_IGNORED_FILES = [
  'LICENSE',
  'LICENSE.md',
  'LICENSE.txt',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'npm-shrinkwrap.json'
]

export class FilesystemDatasource implements Datasource {
  private readonly root: string
  private readonly includePatterns: string[]
  private readonly excludePatterns: string[]
  private readonly useGitignore: boolean
  private readonly useCommonIgnore: boolean

  constructor (root: string, includePatterns: string[], excludePatterns: string[], useGitignore: boolean = false, useCommonIgnore: boolean = false) {
    this.root = root
    this.includePatterns = includePatterns
    this.excludePatterns = excludePatterns
    this.useGitignore = useGitignore
    this.useCommonIgnore = useCommonIgnore
  }

  async getContent (): Promise<Map<string, string>> {
    const content = new Map<string, string>()
    let excludePatterns = this.excludePatterns

    if (this.useCommonIgnore) {
      excludePatterns = [...excludePatterns, ...COMMONLY_IGNORED_FILES]
    }

    const files = await globby(this.includePatterns, {
      cwd: this.root,
      ignore: excludePatterns,
      absolute: false,
      gitignore: this.useGitignore
    })
    for (const file of files) {
      content.set(file, await this.readFile(file))
    }
    return content
  }

  private async readFile (file: string): Promise<string> {
    const fullPath = path.join(this.root, file)
    const buffer = await readFile(fullPath)
    if (await isBinaryFile(buffer, buffer.length)) {
      return '<BINARY CONTENT>'
    } else {
      return buffer.toString('utf-8')
    }
  }
}
