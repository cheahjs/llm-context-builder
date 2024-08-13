import { type Tokenizer } from '../interface'
import { pipeline } from '@xenova/transformers'

/**
 * TransformersTokenizer class implementing the Tokenizer interface.
 * This class provides an implementation of token counting using the @xenova/transformers library.
 * It allows the user to specify the HuggingFace repository to be used for tokenization.
 *
 * @implements {Tokenizer}
 */
export class TransformersTokenizer implements Tokenizer {
  private readonly model: string

  /**
   * Constructs a new TransformersTokenizer.
   * Initializes the model using the specified HuggingFace repository.
   *
   * @param {string} model - The HuggingFace repository to be used for tokenization.
   */
  constructor (model: string) {
    this.model = model
  }

  /**
   * Counts the number of tokens in a given text.
   * This method uses the @xenova/transformers library to count the tokens.
   *
   * @param {string} text - The text to be tokenized.
   * @returns {Promise<number>} - The number of tokens in the text.
   */
  async countTokens (text: string): Promise<number> {
    const tokenizer = await pipeline('tokenize', {
      model: this.model
    })
    const tokens = await tokenizer(text)
    return tokens.length
  }
}
