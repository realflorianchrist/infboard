import nodemailer from "nodemailer";

export type NodemailerLike = ReturnType<typeof nodemailer.createTransport>;

export const createTransport = (opts: {
    host: string;
    port: number;
    user?: string;
    pass?: string;
    secure?: boolean;
    from: string;
}) => {
    const {host, port, user, pass, secure, from} = opts;
    return nodemailer.createTransport(
        {
            host,
            port,
            secure: secure ?? port === 465,
            auth: user && pass ? {user, pass} : undefined,
        }, {
            from: from,
        }
    );
}