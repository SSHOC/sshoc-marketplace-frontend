import { useButton } from "@react-aria/button";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import type { AriaButtonProps } from "@react-types/button";
import { useTranslations } from "next-intl";
import { type ReactNode, useRef, useState } from "react";

import css from "@/components/item/ItemMedia.module.css";
import type { Item } from "@/data/sshoc/api/item";
import { getMediaThumbnailUrl, getMediaUrl, isMediaDetailsUrl } from "@/data/sshoc/api/media";
import { Icon } from "@/lib/core/ui/Icon/Icon";
import ChevronIcon from "@/lib/core/ui/icons/chevron.svg?symbol-icon";
import DocumentIcon from "@/lib/core/ui/icons/document.svg?symbol-icon";

export interface ItemMediaProps {
	media: Item["media"];
}

export function ItemMedia(props: ItemMediaProps): ReactNode {
	const { media } = props;

	const t = useTranslations();
	const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

	if (media.length === 0) {
		return null;
	}

	function onPreviousMedia() {
		setCurrentMediaIndex((index) => {
			return (index - 1 + media.length) % media.length;
		});
	}

	function onNextMedia() {
		setCurrentMediaIndex((index) => {
			return (index + 1) % media.length;
		});
	}

	const currentMedia = media[currentMediaIndex]!;

	/** Allow circle for more than 1 item. */
	const hasMultipleMedia = media.length > 1;
	const hasPrevious = hasMultipleMedia;
	const hasNext = hasMultipleMedia;

	return (
		<section className={css["container"]}>
			<h2>
				<VisuallyHidden>{t("common.item.media.other")}</VisuallyHidden>
			</h2>
			<div className={css["carousel-container"]}>
				<figure className={css["media-container"]}>
					<Media media={currentMedia} />
					<MediaCaption media={currentMedia} />
				</figure>
				{hasMultipleMedia ? (
					<nav aria-label={t("common.item.media.other")}>
						<ol role="list" className={css["carousel-controls"]}>
							<li data-direction="prev">
								<Button onPress={onPreviousMedia} isDisabled={!hasPrevious}>
									<Icon icon={ChevronIcon} aria-label={t("common.item.previous-media")} />
								</Button>
							</li>
							<li>
								<ItemMediaPreviews
									media={media}
									onSelect={(index) => {
										setCurrentMediaIndex(index);
									}}
								/>
							</li>
							<li data-direction="next">
								<Button onPress={onNextMedia} isDisabled={!hasNext}>
									<Icon icon={ChevronIcon} aria-label={t("common.item.next-media")} />
								</Button>
							</li>
						</ol>
					</nav>
				) : null}
			</div>
		</section>
	);
}

interface ItemMediaPreviewsProps {
	media: Item["media"];
	onSelect: (index: number) => void;
}

function ItemMediaPreviews(props: ItemMediaPreviewsProps): ReactNode {
	const { media, onSelect } = props;

	const t = useTranslations();

	return (
		<ol role="list" className={css["thumbnails"]}>
			{media.map((m, index) => {
				const hasThumbnail = m.info.hasThumbnail;

				return (
					<li key={m.info.mediaId}>
						<Button
							onPress={() => {
								onSelect(index);
							}}
							// TODO: should label use caption?
							aria-label={t("common.item.go-to-media", {
								media: String(index),
							})}
						>
							{hasThumbnail ? (
								/* eslint-disable-next-line @next/next/no-img-element */
								<img
									loading="lazy"
									src={String(getMediaThumbnailUrl({ mediaId: m.info.mediaId }))}
									alt=""
								/>
							) : (
								<Icon icon={DocumentIcon} />
							)}
						</Button>
					</li>
				);
			})}
		</ol>
	);
}

interface MediaProps {
	media: Item["media"][number];
}

function Media(props: MediaProps): ReactNode {
	const { media } = props;
	const { info, caption } = media;
	const url = isMediaDetailsUrl(info)
		? info.location.sourceUrl
		: String(getMediaUrl({ mediaId: info.mediaId }));

	const t = useTranslations();

	switch (media.info.category) {
		case "embed":
			return (
				<iframe
					src={url}
					// TODO:
					// sandbox="allow-popups; allow-same-origin; allow-scripts"
					loading="lazy"
					title={caption ?? t("common.item.embedded-content")}
					allow="fullscreen; picture-in-picture"
					referrerPolicy="no-referrer"
				/>
			);
		case "image":
		case "thumbnail":
			/* eslint-disable-next-line @next/next/no-img-element */
			return <img src={url} alt={caption ?? ""} loading="lazy" />;
		case "object":
			return (
				<a download href={url}>
					<Icon icon={DocumentIcon} />
					{t("common.item.download-media")}
				</a>
			);
		case "video":
			/* eslint-disable-next-line jsx-a11y/media-has-caption */
			return <video src={url} />;
		default:
			return null;
	}
}

interface MediaCaptionProps {
	media: Item["media"][number];
}

function MediaCaption(props: MediaCaptionProps): ReactNode {
	const { media } = props;
	const caption = media.caption;
	const license = media.concept?.label;

	if (caption == null && license == null) {
		return null;
	}

	return (
		<figcaption className={css["caption"]}>
			{caption}
			{license != null ? <span>({license})</span> : null}
		</figcaption>
	);
}

type ButtonProps = AriaButtonProps;

// TODO: <Button variant="ghost" />
function Button(props: ButtonProps): ReactNode {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const { buttonProps } = useButton(props, buttonRef);

	return (
		<button type="button" {...buttonProps} ref={buttonRef} className={css["button"]}>
			{props.children}
		</button>
	);
}
