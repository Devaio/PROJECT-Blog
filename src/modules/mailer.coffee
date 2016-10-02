mailHelper = require('sendgrid').mail
sg = require('sendgrid').SendGrid(process.env.SENDGRID_KEY)

send = (toSend, cb) ->
  cb = if cb != null then cb else (->)
  requestBody = toSend
  emptyRequest = require('sendgrid-rest').request
  requestPost = JSON.parse(JSON.stringify(emptyRequest))
  requestPost.method = 'POST'
  requestPost.path = '/v3/mail/send'
  requestPost.body = requestBody
  sg.API requestPost, (response) ->
    # console.log 'status', response.statusCode
    # console.log 'body', response.body
    # console.log 'headers', response.headers
    cb null, response
    return
  return

module.exports = do ->
  { send: (template, content, message, cb) ->
    cb = if cb != null then cb else (->)
    # message['inline_css'] = true;
    # return mandrill('/messages/send-template', {
    #   'template_name': template,
    #   'template_content': content,
    #   message: message
    # }, function(error, response) {
    #   return cb(error, response);
    # });
    # Create mail object
    mail = new (mailHelper.Mail)
    fromEmail = new (mailHelper.Email)(message.from)
    textContent = new (mailHelper.Content)('text/plain', 'some text here')
    personalization = new (mailHelper.Personalization)
    toEmail = new (mailHelper.Email)(message.to)
    personalization.addTo toEmail
    # Add to mail object
    mail.setFrom fromEmail
    mail.addContent textContent
    mail.setTemplateId template
    content.forEach (mailContent) ->
      sub = new (mailHelper.Substitution)(mailContent.name, mailContent.content)
      personalization.addSubstitution sub
      return
    mail.addPersonalization personalization
    send mail.toJSON(), cb
    return
 }
