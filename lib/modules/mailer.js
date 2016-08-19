var mailHelper, send, sg;

mailHelper = require('sendgrid').mail;

sg = require('sendgrid').SendGrid(process.env.SENDGRID_KEY);

send = function(toSend, cb) {
  var emptyRequest, requestBody, requestPost;
  cb = cb !== null ? cb : (function() {});
  requestBody = toSend;
  emptyRequest = require('sendgrid-rest').request;
  requestPost = JSON.parse(JSON.stringify(emptyRequest));
  requestPost.method = 'POST';
  requestPost.path = '/v3/mail/send';
  requestPost.body = requestBody;
  sg.API(requestPost, function(response) {
    console.log('status', response.statusCode);
    console.log('body', response.body);
    console.log('headers', response.headers);
    cb(null, response);
  });
};

module.exports = (function() {
  return {
    send: function(template, content, message, cb) {
      var fromEmail, mail, personalization, textContent, toEmail;
      cb = cb !== null ? cb : (function() {});
      mail = new mailHelper.Mail;
      fromEmail = new mailHelper.Email(message.from);
      textContent = new mailHelper.Content('text/plain', 'some text here');
      personalization = new mailHelper.Personalization;
      toEmail = new mailHelper.Email(message.to);
      personalization.addTo(toEmail);
      mail.setFrom(fromEmail);
      mail.addContent(textContent);
      mail.setTemplateId(template);
      content.forEach(function(mailContent) {
        var sub;
        sub = new mailHelper.Substitution(mailContent.name, mailContent.content);
        personalization.addSubstitution(sub);
      });
      mail.addPersonalization(personalization);
      send(mail.toJSON());
      cb();
    }
  };
})();
