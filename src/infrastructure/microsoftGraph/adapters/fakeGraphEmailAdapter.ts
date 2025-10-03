export class FakeGraphEmailAdapter {
  private token: string;

  constructor(accessToken: string) {
   
    this.token = accessToken;
  }

  async fetchMessage(userId: string, messageId: string) {
    console.log(`Fake fetchMessage called with userId=${userId} and messageId=${messageId}`);

   
    return {
      id: messageId,
      subject: "Fake Subject",
      from: {
        emailAddress: {
          name: "John Doe",
          address: "john.doe@example.com"
        }
      },
      body: {
        contentType: "HTML",
        content: "<p>This is a fake message body.</p>"
      },
      internetMessageHeaders: [
        {
          name: "Received",
          value: "by fake.smtp.server"
        },
        {
          name: "Content-Type",
          value: "text/html"
        }
      ],
      attachments: [
        {
          id: "fakeAttachment1",
          name: "document.pdf",
          contentType: "application/pdf",
          size: 1024,
          isInline: false
        }
      ]
    };
  }
}