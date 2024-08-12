interface Datasource {
  /**
   * Gets the content of the datasource.
   * @returns A map of key-value pairs, where the key is the name of the content such as a file path and the value is the content itself.
   */
  getContent: () => Promise<Map<string, string>>
}
