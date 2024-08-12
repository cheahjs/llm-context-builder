import { encoding_for_model, type Tiktoken, type TiktokenModel } from 'tiktoken'

/**
 * TiktokenTokenizer class implementing the Tokenizer interface.
 * This class provides an implementation of token counting using the tiktoken library.
 * It allows the user to specify the OpenAI model to be used for tokenization.
 *
 * @implements {Tokenizer}
 */
export class TiktokenTokenizer implements Tokenizer {
  private readonly enc: Tiktoken

  /**
   * Constructs a new TiktokenTokenizer.
   * Initializes the encoding using the specified model.
   *
   * @param {TiktokenModel} model - The model to be used for tokenization.
   */
  constructor (model: TiktokenModel) {
    this.enc = encoding_for_model(model)
  }

  /**
   * Counts the number of tokens in a given text.
   * This method uses the tiktoken library to count the tokens.
   *
   * @param {string} text - The text to be tokenized.
   * @returns {Promise<number>} - The number of tokens in the text.
   */
  async countTokens (text: string): Promise<number> {
    const encodedText = this.enc.encode(text)
    const tokenCount = encodedText.length
    this.enc.free()
    return await Promise.resolve(tokenCount)
  }
}
