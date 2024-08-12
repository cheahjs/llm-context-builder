import { glob } from 'glob'
import path from 'node:path'
import { readFile } from 'fs/promises'
import { type Datasource } from '../interface'
import { isBinaryFile } from 'isbinaryfile'

export class FilesystemDatasource implements Datasource {
  private readonly root: string
  private readonly includePatterns: string[]
  private readonly excludePatterns: string[]
  private readonly useGitignore: boolean

  constructor (root: string, includePatterns: string[], excludePatterns: string[], useGitignore: boolean = false) {
    this.root = root
    this.includePatterns = includePatterns
    this.excludePatterns = excludePatterns
    this.useGitignore = useGitignore
  }

  async getContent (): Promise<Map<string, string>> {
    const content = new Map<string, string>()
    let excludePatterns = this.excludePatterns

    if (this.useGitignore) {
      const gitignorePath = path.join(this.root, '.gitignore')
      try {
        const gitignoreBuffer = await readFile(gitignorePath)
        const gitignoreContents = gitignoreBuffer.toString('utf-8')
        const gitignorePatterns = gitignoreContents.split('\n').filter(line => line.trim() !== '')
        excludePatterns = [...excludePatterns, ...gitignorePatterns]
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error
        }
      }
    }

    const files = await glob(this.includePatterns, {
      cwd: this.root,
      ignore: excludePatterns,
      absolute: false
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
