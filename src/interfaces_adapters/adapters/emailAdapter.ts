import { Transporter } from "nodemailer";

class EmailAdapter {
    constructor(
        private transporter : Transporter,
    ){}
    async sendEmail(data : {
        from : string,
        to : string,
        subject : string,
        text : string
    }): Promise<void> {
        return await this.transporter.sendMail({
            from : data.from,
            to : data.to,
            subject : data.subject,
            text : data.text
        });
    }
}
export default EmailAdapter;