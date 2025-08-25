import {ENV} from "@src/constants/ENV";
import {createMailService, createTransport} from "@workspace/mailer";

const transport = createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    user: ENV.SMTP_USER,
    from: ENV.FROM_EMAIL,
    pass: ENV.SMTP_PASS,
});

const mailService = createMailService(transport);

export default mailService;