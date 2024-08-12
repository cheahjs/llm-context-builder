import { type GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai'
import { type Tokenizer } from '../interface'

/**
 * GeminiTokenizer class implementing the Tokenizer interface.
 * This class provides an implementation of token counting using the Gemini API.
 * It allows the user to specify the model to be used for tokenization.
 *
 * @implements {Tokenizer}
 */
export class GeminiTokenizer implements Tokenizer {
  private readonly model: GenerativeModel

  /**
   * Constructs a new GeminiTokenizer.
   * Initializes the GenerativeModel using the specified model.
   *
   * @param {string} modelName - The name of the model to be used for tokenization.
   * @throws {Error} If the GEMINI_API_KEY environment variable is not set.
   */
  constructor (modelName: string) {
    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey === null || apiKey === undefined || apiKey === '') {
      throw new Error('GEMINI_API_KEY environment variable is not set.')
    }
    const genAI = new GoogleGenerativeAI(apiKey)
    this.model = genAI.getGenerativeModel({ model: modelName })
  }

  /**
   * Counts the number of tokens in a given text.
   * This method uses the Google Generative AI to count the tokens.
   *
   * @param {string} text - The text to be tokenized.
   * @returns {Promise<number>} - The number of tokens in the text.
   */
  async countTokens (text: string): Promise<number> {
    const { totalTokens } = await this.model.countTokens(text)
    return totalTokens
  }
}
