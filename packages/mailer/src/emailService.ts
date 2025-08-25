import {User} from "@workspace/types";
import {renderMjmlTemplate} from "./renderMjmlTemplate";
import {NodemailerLike} from "./transport";

export const createMailService = (transport: NodemailerLike) => {

    const sendEMailConfirmEMail = async (user: User) => {

        const {html} = renderMjmlTemplate('emailConfirmTemplate', user);

        await transport.sendMail({
            to: user.email,
            subject: 'subject',
            html: html,
        });
    };

    return {
        sendEmailConfirmEMail: sendEMailConfirmEMail,
    }
};
