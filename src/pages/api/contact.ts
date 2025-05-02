import type { NextApiRequest, NextApiResponse } from "next";
import * as nodemailer from "nodemailer";

import { log } from "@/lib/utils";
import { smtpPort, smtpServer, sshocContactEmailAddress } from "~/config/email.config";

export default async function contact(
	request: NextApiRequest,
	response: NextApiResponse,
): Promise<void> {
	if (request.method !== "POST") {
		return response.status(405).end();
	}

	if (smtpServer == null || smtpPort == null || sshocContactEmailAddress == null) {
		return response.status(500).json({ message: "Email service is not configured." });
	}

	const formSubmission = request.body;

	if (formSubmission == null) {
		return response.status(400).end();
	}

	/** Honeypot field. */
	if (formSubmission.bot != null) {
		return response.status(400).end();
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

		return response.end();
	} catch {
		return response.status(500).end();
	}
}
