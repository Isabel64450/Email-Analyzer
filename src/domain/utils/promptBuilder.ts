import { PromptContext } from "@domainModels/PromptContext";

export class PromptBuilder {
  public buildPrompt(template: string, contexts: PromptContext[]) {
    let prompt = template;
    for (let context of contexts) {
      prompt = prompt.replace(context.getActualKey(), context.value);
    }

    return prompt;
  }
}
