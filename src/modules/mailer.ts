import sendgrid = require('sendgrid');
var mailHelper = sendgrid['mail'];
var sg = sendgrid['SendGrid'](process.env.SENDGRID_KEY);

class Mailer {
    private sender (toSend:JSON){
        let emailReq = sendgrid['request'];
        emailReq['method'] = 'POST';
        emailReq['path'] = '/v3/mail/send';
        emailReq['body'] = toSend;

        return new Promise<any>((resolve) => {

            sg.API(emailReq, (response)=>{
                resolve(response)
            })

        })

        
    }

    public async send (template, content, message){
        let self = this;
        let mail = new mailHelper.Mail;
        let fromEmail = new mailHelper.Email(message.from);
        let toEmail = new mailHelper.Email(message.to);
        let textContent = new mailHelper.Content('text/plan', 'some text here');
        let personalization = new mailHelper.Personalization;
        personalization.addTo(toEmail);
        mail.setFrom(fromEmail);
        mail.addContent(textContent);
        mail.setTemplateId(template);
        for(let mailContent of content){
            personalization.addSubstitution(new mailHelper.Substitution(mailContent.name, mailContent.content));
        }

        mail.addPersonalization(personalization);

        return new Promise<any>(async (resolve) => {
            resolve(await self.sender(mail.toJSON()));
        })
        
    }
}

export = new Mailer()