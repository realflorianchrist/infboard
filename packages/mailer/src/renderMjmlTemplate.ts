import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Handlebars from "handlebars";
import mjml2html from "mjml";
import { htmlToText } from "html-to-text";
import logger from "./utils/logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TPL_DIR = path.join(__dirname, "templates");

const readTpl = (name: string) => {
    return fs.readFileSync(path.join(TPL_DIR, name), "utf8");
};

export const renderMjmlTemplate = async (
    templateName: string,
    vars: Record<string, any> = {}
) => {
    const base = readTpl("main.mjml");
    const body = readTpl(`${templateName}.mjml`);

    const year = String(new Date().getFullYear());

    const bodyHtml = Handlebars.compile(body)(vars);

    const mjml = Handlebars.compile(base)({ ...vars, year: year, children: bodyHtml });

    const { html, errors } = await mjml2html(mjml, {
        validationLevel: "soft",
        filePath: TPL_DIR,
    });

    if (errors.length) {
        logger.err(errors.map(e => e.formattedMessage).join("\n"));
    }

    const text = htmlToText(html, { wordwrap: 80 });
    return { html, text };
};
