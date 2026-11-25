import { createForm } from "final-form";
import { describe, expect, it, vi } from "vitest";

describe("field unregistration during notifications", () => {
	it("can unregister a conditional field from another field's subscriber", () => {
		const form = createForm({
			onSubmit: vi.fn(),
			initialValues: { kind: "linked", url: "https://example.test" },
		});
		const urlSubscriber = vi.fn();
		const unregisterUrl = form.registerField("url", urlSubscriber, { value: true });
		form.registerField(
			"kind",
			({ value }) => {
				if (value === "plain") unregisterUrl();
			},
			{ value: true },
		);

		expect(() => form.change("kind", "plain")).not.toThrow();
		expect(form.getRegisteredFields()).toEqual(["kind"]);
		const notificationsAfterRemoval = urlSubscriber.mock.calls.length;
		form.change("url", "https://changed.test");
		expect(urlSubscriber).toHaveBeenCalledTimes(notificationsAfterRemoval);

		// Final Form retains hidden values by default; remounting restores the edited value.
		const remounted = vi.fn();
		form.registerField("url", remounted, { value: true });
		expect(remounted.mock.calls.at(-1)![0].value).toBe("https://changed.test");
	});

	it("finishes pending validation safely after its field is unregistered", async () => {
		let resolveValidation!: (error: string | undefined) => void;
		const form = createForm({ onSubmit: vi.fn() });
		const subscriber = vi.fn();
		const unregister = form.registerField(
			"conditional",
			subscriber,
			{ error: true, validating: true },
			{
				getValidator: () => () =>
					new Promise<string | undefined>((resolve) => {
						resolveValidation = resolve;
					}),
			},
		);
		expect(form.getState().validating).toBe(true);
		unregister();
		const notificationsAfterRemoval = subscriber.mock.calls.length;
		resolveValidation("No longer relevant");
		await vi.waitFor(() => expect(form.getState().validating).toBe(false));
		expect(form.getRegisteredFields()).toEqual([]);
		expect(subscriber).toHaveBeenCalledTimes(notificationsAfterRemoval);
		expect(form.getState().errors).toEqual({});
	});
});
