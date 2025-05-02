import { z } from "zod";

import { mediaCategories } from "@/data/sshoc/api/media";
import { conceptRefSchema } from "@/data/sshoc/validation-schemas/vocabulary";
import { isEmptyFileList } from "@/lib/utils";

export const mediaDetailsRefSchema = z.object({
	mediaId: z.string(),
});

export const mediaLocationInputSchema = z.object({
	sourceUrl: z.string().url(),
});

export const mediaSourceInputSchema = z.object({
	serviceUrl: z.string().url(),
	mediaCategory: z.enum(mediaCategories),
	ord: z.number().optional(),
});

export const mediaUploadSchema =
	// FIXME: Use discriminated union.
	// z.discriminatedUnion('type', [
	//   /** Not using `file: z.instanceof(FileList)` because `FileList` is not available server-side. */
	//   z.object({ type: z.literal('file'), file: z.unknown() }),
	//   z.object({ type: z.literal('url'), sourceUrl: z.string().url() }),
	// ])
	// .and(
	//   z.object({
	//     caption: z.string().optional(),
	//     concept: conceptRefSchema.optional(),
	//   }),
	// )
	z
		.object({
			file: z.any().optional(),
			sourceUrl: z.string().url().optional(),
			caption: z.string().optional(),
			concept: conceptRefSchema.optional(),
		})
		.refine(
			(data) => {
				return !(isEmptyFileList(data.file) && data.sourceUrl == null);
			},
			{
				message: "File or URL required",
				// FIXME: `path: [FORM_ERROR]`
				path: ["sourceUrl"],
				params: { mediaInput: [] },
			},
		)
		.refine(
			(data) => {
				return !(!isEmptyFileList(data.file) && data.sourceUrl != null);
			},
			{
				message: "Provide either file or URL, not both",
				// FIXME: `path: [FORM_ERROR]`
				path: ["sourceUrl"],
				params: { mediaInput: ["file", "url"] },
			},
		)
		.refine(
			(data) => {
				if (data.sourceUrl != null && data.sourceUrl.includes("youtube.com/watch")) {
					return false;
				}
				return true;
			},
			{
				message: "Provide a youtube embed link, not a youtube watch link",
				path: ["sourceUrl"],
			},
		);
