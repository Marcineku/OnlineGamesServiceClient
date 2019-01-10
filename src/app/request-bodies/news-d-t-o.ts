export class NewsDTO {
  type: string;
  title: string;
  text: string;
  language: string;

  constructor(type?: string, title?: string, text?: string, language?: string) {
    this.type = type;
    this.title = title;
    this.text = text;
    this.language = language;
  }
}
