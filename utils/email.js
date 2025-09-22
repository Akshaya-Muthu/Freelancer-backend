import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const Transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
       user: process.env.SMTP_USER,
       pass: process.env.SMTP_PASSWORD,
    },
});


export const sendEmail = async (to, subject, text) => {
    await Transport.sendMail({
        from: `"Freelancing SaaS" <${process.env.SMTP_EMAIL}>`,
        to,
        subject,
        text,
    });
};


export const sendCertificateEmail = async (to, subject, text, attachment) => {
    await Transport.sendMail({
        from: `"Freelancing SaaS" <${process.env.SMTP_EMAIL}>`,
        to,
        subject,
        text,
        attachments: [
            {
                filename: 'certificate.pdf',
                path: attachment
            }
        ]
    });
};
