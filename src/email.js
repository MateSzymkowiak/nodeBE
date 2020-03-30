const sgMail = require('@sendgrid/mail');

const emailSender = (email, title, header, description) => {

    const apiKey = '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';

    sgMail.setApiKey(apiKey);
    const msg = {
        to: email,
        from: 'elohim97@gmail.com',
        subject: title,
        html: '<h2>' + header + '</h2>' +
            '<p>' + description + '</p>',
    };

    sgMail
        .send(msg)
        .then(() => {
        }, console.error);
};

module.exports = emailSender;