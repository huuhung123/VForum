import SendGrid from "sendgrid";



export class SendGridMail extends SendGrid.mail.Mail {}
export class SendGridEmail extends SendGrid.mail.Email {}
export class SendGridContent extends SendGrid.mail.Content {}

export class SendGridService {
  private sendGrid: any;

  constructor(private sendgridApiKey: string) {
    this.sendGrid = SendGrid(sendgridApiKey);
  }

  send(mail: SendGridMail): Promise<any> {
    let request = this.sendGrid.emptyRequest({
      method: "POST",
      path: "/v3/mail/send",
      body: mail.toJSON(),
    });

    return this.sendGrid.API(request);
  }
}
