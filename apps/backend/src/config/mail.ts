import {ENV} from "@src/constants/ENV";
import {createMailService, createTransport} from "@workspace/mailer";

/**
 * Preconfigured mail transport for SMTP-based email delivery.
 *
 * Configuration:
 * - Uses SMTP connection details from environment variables.
 * - Sets a default "from" address for outgoing emails.
 *
 * Intended use:
 * - Low-level transport configuration.
 * - Passed into the mail service factory.
 */
const transport = createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    user: ENV.SMTP_USER,
    from: ENV.FROM_EMAIL,
    pass: ENV.SMTP_PASS,
});

/**
 * Application-wide mail service instance.
 *
 * Behavior:
 * - Wraps the configured SMTP transport.
 * - Provides a higher-level API for sending emails.
 *
 * Intended use:
 * - Imported wherever emails need to be sent.
 * - Centralized configuration ensures consistent sender and connection settings.
 */
const mailService = createMailService(transport);

export default mailService;