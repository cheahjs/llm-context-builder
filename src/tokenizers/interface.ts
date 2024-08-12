export interface Tokenizer {
  countTokens: (text: string) => Promise<number>
}
