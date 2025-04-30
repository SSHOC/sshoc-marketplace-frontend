import { z } from "zod";

import type { AuthData } from "@/data/sshoc/api/common";
import type { RequestOptions } from "@/data/sshoc/lib/client";
import { createUrl, request } from "@/data/sshoc/lib/client";
import type { AllowedRequestOptions, UrlString } from "@/data/sshoc/lib/types";
import {
	mediaLocationInputSchema,
	mediaSourceInputSchema,
} from "@/data/sshoc/validation-schemas/media";

export const mediaCategories = ["image", "video", "embed", "object", "thumbnail"] as const;

export type MediaCategory = (typeof mediaCategories)[number];

export interface MediaDetailsBase {
	mediaId: string;
	category: MediaCategory;
	mimeType: string;
	hasThumbnail: boolean;
}

export interface MediaDetailsFile extends MediaDetailsBase {
	filename: string;
}

export interface MediaDetailsUrl extends MediaDetailsBase {
	location: MediaLocation;
}

/** MediaDetails */
export type MediaDetails = MediaDetailsFile | MediaDetailsUrl;

export function isMediaDetailsFile(media: MediaDetails): media is MediaDetailsFile {
	return "filename" in media;
}

export function isMediaDetailsUrl(media: MediaDetails): media is MediaDetailsUrl {
	return "location" in media;
}

/** MediaDetailsId */
export interface MediaDetailsRef {
	mediaId: string;
}

/** MediaLocation */
export interface MediaLocation {
	sourceUrl: UrlString;
}

export interface MediaLocationInput {
	sourceUrl: UrlString;
}

/** MediaUploadInfo */
export interface MediaUploadInfo {
	mediaId: string;
	filename: string;
	mimeType: string;
	nextChunkNo: number;
}

/** MediaSourceDto */
export interface MediaSource {
	code: string;
	serviceUrl: UrlString;
	mediaCategory: MediaCategory;
	ord: number;
}

/** MediaSourceCore */
export interface MediaSourceInput {
	serviceUrl: UrlString;
	mediaCategory: MediaCategory;
	ord?: number;
}

export namespace UploadMediaChunk {
	export interface SearchParams {
		/** Required on every but the first chunk. */
		mediaId?: string;
		/** Starts at 0. */
		no: number;
	}
	export type Params = SearchParams;
	/** FormData<{ chunk: File }> */
	export type Body = FormData;
	export type Response = MediaUploadInfo;
}

export function uploadMediaChunk(
	params: UploadMediaChunk.Params,
	data: UploadMediaChunk.Body,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<UploadMediaChunk.Response> {
	const url = createUrl({ pathname: "/api/media/upload/chunk", searchParams: params });
	const options: RequestOptions = { ...requestOptions, method: "post", body: data };

	return request(url, options, auth);
}

export namespace UploadMediaChunksComplete {
	export interface PathParams {
		/** Returned from the `/media/upload/chunk` endpoint. */
		mediaId: string;
	}
	export interface SearchParams {
		filename?: string;
	}
	export type Params = PathParams & SearchParams;
	export type Response = MediaDetails;
}

export function uploadMediaChunksComplete(
	params: UploadMediaChunksComplete.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<UploadMediaChunksComplete.Response> {
	const url = createUrl({
		pathname: `/api/media/upload/complete/${params.mediaId}`,
		searchParams: params,
	});
	const options: RequestOptions = { ...requestOptions, method: "post" };

	return request(url, options, auth);
}

export namespace UploadMedia {
	/** FormData<{ file: File }> */
	export type Body = FormData;
	export type Response = MediaDetails;
}

export function uploadMedia(
	data: UploadMedia.Body,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<UploadMedia.Response> {
	const url = createUrl({ pathname: "/api/media/upload/full" });
	const options: RequestOptions = { ...requestOptions, method: "post", body: data };

	return request(url, options, auth);
}

export namespace ImportMedia {
	export type Body = MediaLocationInput;
	export type Response = MediaDetails;
}

export function importMedia(
	data: ImportMedia.Body,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<ImportMedia.Response> {
	const url = createUrl({ pathname: "/api/media/upload/import" });
	const json = mediaLocationInputSchema.parse(data);
	const options: RequestOptions = { ...requestOptions, method: "post", json };

	return request(url, options, auth);
}

export namespace GetMediaDetails {
	export interface PathParams {
		mediaId: string;
	}
	export type Params = PathParams;
	export type Response = MediaDetails;
}

export function getMediaDetails(
	params: GetMediaDetails.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetMediaDetails.Response> {
	const url = createUrl({ pathname: `/api/media/info/${params.mediaId}` });
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace DownloadMedia {
	export interface PathParams {
		mediaId: string;
	}
	export type Params = PathParams;
	/** Note that the server sets the `content-disposition: attachment` header. */
	export type Response = Blob;
}

export function downloadMedia(
	params: DownloadMedia.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<DownloadMedia.Response> {
	const url = createUrl({ pathname: `/api/media/download/${params.mediaId}` });
	const options: RequestOptions = { ...requestOptions, responseType: "blob" };

	return request(url, options, auth);
}

export namespace DownloadMediaThumbnail {
	export interface PathParams {
		mediaId: string;
	}
	export type Params = PathParams;
	/** Note that the server sets the `content-disposition: attachment` header. */
	export type Response = Blob;
}

export function downloadMediaThumbnail(
	params: DownloadMediaThumbnail.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<DownloadMediaThumbnail.Response> {
	const url = createUrl({ pathname: `/api/media/thumbnail/${params.mediaId}` });
	const options: RequestOptions = { ...requestOptions, responseType: "blob" };

	return request(url, options, auth);
}

export namespace GetMediaUrl {
	export interface PathParams {
		mediaId: string;
	}
	export type Params = PathParams;
	export type Response = URL;
}

export function getMediaUrl(params: GetMediaUrl.Params): GetMediaUrl.Response {
	return createUrl({ pathname: `/api/media/download/${params.mediaId}` });
}

export namespace GetMediaThumbnailUrl {
	export interface PathParams {
		mediaId: string;
	}
	export type Params = PathParams;
	export type Response = URL;
}

export function getMediaThumbnailUrl(
	params: GetMediaThumbnailUrl.Params,
): GetMediaThumbnailUrl.Response {
	return createUrl({ pathname: `/api/media/thumbnail/${params.mediaId}` });
}

export namespace GetMediaSources {
	export type Response = Array<MediaSource>;
}

export function getMediaSources(
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetMediaSources.Response> {
	const url = createUrl({ pathname: "/api/media-sources" });
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace GetMediaSource {
	export interface PathParams {
		code: string;
	}
	export type Params = PathParams;
	export type Response = MediaSource;
}

export function getMediaSource(
	params: GetMediaSource.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<GetMediaSource.Response> {
	const url = createUrl({ pathname: `/api/media-sources/${params.code}` });
	const options: RequestOptions = { ...requestOptions };

	return request(url, options, auth);
}

export namespace CreateMediaSource {
	export type Body = MediaSourceInput & { code: string };
	export type Response = MediaSource;
}

export function createMediaSource(
	data: CreateMediaSource.Body,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<CreateMediaSource.Response> {
	const url = createUrl({ pathname: "/api/media-sources" });
	const json = mediaSourceInputSchema.and(z.object({ code: z.string() })).parse(data);
	const options: RequestOptions = { ...requestOptions, method: "post", json };

	return request(url, options, auth);
}

export namespace UpdateMediaSource {
	export interface PathParams {
		code: string;
	}
	export type Params = PathParams;
	export type Body = MediaSourceInput;
	export type Response = MediaSource;
}

export function updateMediaSource(
	params: UpdateMediaSource.Params,
	data: UpdateMediaSource.Body,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<UpdateMediaSource.Response> {
	const url = createUrl({ pathname: `/api/media-sources/${params.code}` });
	const json = mediaSourceInputSchema.parse(data);
	const options: RequestOptions = { ...requestOptions, method: "put", json };

	return request(url, options, auth);
}

export namespace DeleteMediaSource {
	export interface PathParams {
		code: string;
	}
	export type Params = PathParams;
	export type Response = void;
}

export function deleteMediaSource(
	params: DeleteMediaSource.Params,
	auth?: AuthData,
	requestOptions?: AllowedRequestOptions,
): Promise<DeleteMediaSource.Response> {
	const url = createUrl({ pathname: `/api/media-sources/${params.code}` });
	const options: RequestOptions = { ...requestOptions, method: "put", responseType: "void" };

	return request(url, options, auth);
}
