export interface LLMServicePort {
  queryLLMText(textInput: string): Promise<string>;
}
