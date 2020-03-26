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