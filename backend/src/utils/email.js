import nodemailer from "nodemailer";

class Email {

    constructor(user, url = null) {
        this.to = user.email;
        this.name = user.name;
        this.url = url;
        this.from = process.env.EMAIL_FROM;
    }

    newTransport() {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async send(subject, html) {

        await this.newTransport().sendMail({
            from: this.from,
            to: this.to,
            subject,
            html,
        });

    }

    async sendPasswordReset() {

        const html = `
            <h2>Password Reset</h2>

            <p>Hello ${this.name},</p>

            <p>You requested to reset your password.</p>

            <p>
                Click the link below:
            </p>

            <a href="${this.url}">
                Reset Password
            </a>

            <p>
                This link expires in 10 minutes.
            </p>

            <p>
                If you didn't request this,
                simply ignore this email.
            </p>
        `;

        await this.send(
            "Reset Your Password",
            html
        );

    }

}

export default Email;