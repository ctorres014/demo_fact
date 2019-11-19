const nodemailer = require('nodemailer');
import { configurations } from '../config/config';

export default class EmailService {
    async sendEmail(content: Buffer, to: string) {
        return new Promise((resolve: Function, reject: Function) => {
            const { host, port, from, subject, html, filename } = configurations.email.options;
            const { user, pass } = configurations.email.credentials;
            nodemailer.createTestAccount(() => {
                let transporter = nodemailer.createTransport({ host, port, secure: true, auth: { user, pass } });
                let mailOptions = { from, to, subject, html, attachments: [{ filename, content }] };
                transporter.sendMail(mailOptions, (error, info) =>  error ? reject(`Email Service: ${error}`) : resolve(info));
            });
        });
    }
}
