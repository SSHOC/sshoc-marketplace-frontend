import type { Locator, Page } from "@playwright/test";

import type { I18n } from "@/e2e/lib/fixtures/i18n";
import { defaultLocale, type IntlLocale } from "@/lib/i18n/locales";

export class ContactPage {
	readonly page: Page;
	readonly locale: IntlLocale;
	readonly i18n: I18n;
	readonly url: string;
	readonly mainContent: Locator;
	readonly title: Locator;
	readonly skipLink: Locator;
	readonly form: {
		email: Locator;
		subject: Locator;
		message: Locator;
		submit: Locator;
	};

	constructor(page: Page, locale = defaultLocale, i18n: I18n) {
		this.page = page;
		this.locale = locale;
		this.i18n = i18n;
		this.url = "/contact";
		this.mainContent = page.getByRole("main");
		this.title = page.getByRole("heading", { level: 1 });
		this.skipLink = page.getByRole("link", { name: i18n.t("AppGroupLayout.skip-to-main-content") });

		this.form = {
			email: page.getByRole("textbox", { name: i18n.t("ContactForm.email") }),
			subject: page.getByRole("textbox", { name: i18n.t("ContactForm.subject") }),
			message: page.getByRole("textbox", { name: i18n.t("ContactForm.message") }),
			submit: page.getByRole("button", { name: i18n.t("ContactForm.submit") }),
		};
	}

	goto() {
		return this.page.goto(this.url);
	}
}
