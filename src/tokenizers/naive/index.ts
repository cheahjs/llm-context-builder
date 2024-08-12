import { Tokenizer } from '../interface'

/**
 * NaiveTokenizer class implementing the Tokenizer interface.
 * This class provides a naive implementation of token counting.
 * It considers each token to be 4 characters long.
 * This is a rough approximation based on OpenAI's rule of thumb for English text.
 *
 * @implements {Tokenizer}
 */
export class NaiveTokenizer implements Tokenizer {
  /**
   * Counts the number of tokens in a given text.
   * This method considers each token to be 4 characters long.
   *
   * @param {string} text - The text to be tokenized.
   * @returns {Promise<number>} - The number of tokens in the text.
   */
  async countTokens (text: string): Promise<number> {
    return await Promise.resolve(text.length / 4)
  }
}
