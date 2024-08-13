import { type Tokenizer } from '../interface'
import { AutoTokenizer } from '@xenova/transformers'
import { type PreTrainedTokenizer } from '@xenova/transformers/types/tokenizers'

/**
 * TransformersTokenizer class implementing the Tokenizer interface.
 * This class provides an implementation of token counting using the @xenova/transformers library.
 * It allows the user to specify the HuggingFace repository to be used for tokenization.
 *
 * @implements {Tokenizer}
 */
export class TransformersTokenizer implements Tokenizer {
  private readonly tokenizer: PreTrainedTokenizer

  /**
   * Constructs a new TransformersTokenizer.
   * Initializes the model using the specified HuggingFace repository.
   *
   * @param {string} model - The HuggingFace repository to be used for tokenization.
   */
  async constructor (model: string) {
    await this.init(model)
  }

  private async init(model: string): Promise<void> {
    this.tokenizer = await AutoTokenizer.from_pretrained(model)
  }

  /**
   * Counts the number of tokens in a given text.
   * This method uses the @xenova/transformers library to count the tokens.
   *
   * @param {string} text - The text to be tokenized.
   * @returns {Promise<number>} - The number of tokens in the text.
   */
  async countTokens (text: string): Promise<number> {
    const encoded = this.tokenizer.encode(text)
    return encoded.length
  }
}
