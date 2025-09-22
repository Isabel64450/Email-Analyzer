export class PromptContext {
  key!: string;
  value!: string;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }

  public getActualKey(): string {
    return `{{${this.key.toUpperCase()}}}`;
  }
}
