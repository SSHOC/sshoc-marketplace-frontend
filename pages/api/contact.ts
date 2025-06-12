import type { NextApiRequest, NextApiResponse } from "next";
import * as nodemailer from "nodemailer";

import { smtpPort, smtpServer, sshocContactEmailAddress } from "@/config/email.config";
import { log } from "@/lib/utils";

export default async function contact(
	request: NextApiRequest,
	response: NextApiResponse,
): Promise<void> {
	if (request.method !== "POST") {
		response.status(405).end();
		return;
	}

	if (smtpServer == null || smtpPort == null || sshocContactEmailAddress == null) {
		response.status(500).json({ message: "Email service is not configured." });
		return;
	}

	const formSubmission = request.body;

	if (formSubmission == null) {
		response.status(400).end();
		return;
	}

	/** Honeypot field. */
	if (formSubmission.bot != null) {
		response.status(400).end();
		return;
	}

	const transporter = nodemailer.createTransport({
		host: smtpServer,
		port: smtpPort,
		secure: false,
	});

	try {
		const info = await transporter.sendMail({
			to: sshocContactEmailAddress,
			from: formSubmission.email,
			subject: formSubmission.subject,
			text: formSubmission.message,
		});

		log.success("Contact message sent.", info);

		response.end();
		return;
	} catch (error) {
		log.error(error);
		response.status(500).end();
		return;
	}
}
