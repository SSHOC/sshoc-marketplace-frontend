export const smtpServer = process.env["SMTP_SERVER"];

export const smtpPort =
	process.env["SMTP_PORT"] != null ? parseInt(process.env["SMTP_PORT"], 10) : undefined;

export const sshocContactEmailAddress = process.env["SSHOC_CONTACT_EMAIL_ADDRESS"];
