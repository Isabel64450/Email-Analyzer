import LoggerInstance from "@config/logger/loggerInstance";
import { LLMRequestError } from "@domainErrors/LLMRequestError";
import { LLMServicePort } from "@ports/LLMServicePort";
import envConfig from "@envConfig";
import { Mistral } from "@mistralai/mistralai";
import { ChatCompletionResponse } from "@mistralai/mistralai/models/components";

export class MistralLLMServiceAdapter implements LLMServicePort {
  private readonly client = new Mistral({ apiKey: envConfig.mistralAi.apiKey });

  public async queryLLMText(textInput: string): Promise<string> {
    let chatResponse: ChatCompletionResponse | null = null;
    try {
      chatResponse = await this.client.chat.complete({
        model: "mistral-large-latest",
        messages: [{ role: "user", content: textInput }],
      });
    } catch (error) {
      LoggerInstance.error("🔥 error: %o", error);
      throw new LLMRequestError("Request to Mistral failed.", { textInput });
    }
    if (
      !chatResponse?.choices?.length ||
      !(chatResponse?.choices?.length > 0) ||
      !chatResponse.choices[0].message.content
    ) {
      throw new LLMRequestError("Invalid response from Mistral.", {
        textInput,
        chatResponse,
      });
    }
    return chatResponse.choices[0].message.content;
  }
}
