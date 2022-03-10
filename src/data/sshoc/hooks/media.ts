import type { UseMutationOptions, UseQueryOptions } from 'react-query'
import { useMutation, useQuery, useQueryClient } from 'react-query'

import type { AuthData } from '@/data/sshoc/api/common'
import type {
  CreateMediaSource,
  DeleteMediaSource,
  DownloadMedia,
  DownloadMediaThumbnail,
  GetMediaDetails,
  GetMediaSource,
  GetMediaSources,
  ImportMedia,
  UpdateMediaSource,
  UploadMedia,
  UploadMediaChunk,
  UploadMediaChunksComplete,
} from '@/data/sshoc/api/media'
import {
  createMediaSource,
  deleteMediaSource,
  downloadMedia,
  downloadMediaThumbnail,
  getMediaDetails,
  getMediaSource,
  getMediaSources,
  importMedia,
  updateMediaSource,
  uploadMedia,
  uploadMediaChunk,
  uploadMediaChunksComplete,
} from '@/data/sshoc/api/media'
import { useSession } from '@/data/sshoc/lib/useSession'

/** scope */
const media = 'media'
const source = 'media-source'
/** kind */
const list = 'list'
const detail = 'detail'
const download = 'download'
const thumbnail = 'thumbnail'

export const keys = {
  all(auth?: AuthData | undefined) {
    return [media, auth ?? null] as const
  },
  details(auth?: AuthData | undefined) {
    return [media, detail, auth ?? null] as const
  },
  detail(params: DownloadMedia.Params, auth?: AuthData | undefined) {
    return [media, detail, params, auth ?? null] as const
  },
  downloads(auth?: AuthData | undefined) {
    return [media, download, auth ?? null] as const
  },
  download(params: DownloadMedia.Params, auth?: AuthData | undefined) {
    return [media, download, params, auth ?? null] as const
  },
  thumbnails(auth?: AuthData | undefined) {
    return [media, thumbnail, auth ?? null] as const
  },
  thumbnail(params: DownloadMediaThumbnail.Params, auth?: AuthData | undefined) {
    return [media, thumbnail, params, auth ?? null] as const
  },
  source: {
    all(auth?: AuthData | undefined) {
      return [source, auth ?? null] as const
    },
    lists(auth?: AuthData | undefined) {
      return [source, list, auth ?? null] as const
    },
    list(auth?: AuthData | undefined) {
      return [source, list, auth ?? null] as const
    },
    details(auth?: AuthData | undefined) {
      return [source, detail, auth ?? null] as const
    },
    detail(params: GetMediaSource.Params, auth?: AuthData | undefined) {
      return [source, detail, params, auth ?? null] as const
    },
  },
}

export function useMediaDetails<TData = GetMediaDetails.Response>(
  params: GetMediaDetails.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<GetMediaDetails.Response, Error, TData, ReturnType<typeof keys.detail>>,
) {
  const session = useSession(auth)
  return useQuery(
    keys.detail(params, session),
    ({ signal }) => {
      return getMediaDetails(params, session, { signal })
    },
    options,
  )
}

/**
 * You probably want `getMediaUrl`.
 */
export function useMediaDownload<TData = DownloadMedia.Response>(
  params: DownloadMedia.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<DownloadMedia.Response, Error, TData, ReturnType<typeof keys.download>>,
) {
  const session = useSession(auth)
  return useQuery(
    keys.download(params, session),
    ({ signal }) => {
      return downloadMedia(params, session, { signal })
    },
    options,
  )
}

/**
 * You probably want `getMediaThumbnailUrl`.
 */
export function useMediaThumbnailDownload<TData = DownloadMediaThumbnail.Response>(
  params: DownloadMediaThumbnail.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    DownloadMediaThumbnail.Response,
    Error,
    TData,
    ReturnType<typeof keys.thumbnail>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.thumbnail(params, session),
    ({ signal }) => {
      return downloadMediaThumbnail(params, session, { signal })
    },
    options,
  )
}

export function useUploadMedia(
  auth?: AuthData | undefined,
  options?: UseMutationOptions<UploadMedia.Response, Error, { data: UploadMedia.Body }>,
) {
  const session = useSession(auth)
  return useMutation(({ data }: { data: UploadMedia.Body }) => {
    return uploadMedia(data, session)
  }, options)
}

export function useUploadMediaChunk(
  params: UploadMediaChunk.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<UploadMediaChunk.Response, Error, { data: UploadMediaChunk.Body }>,
) {
  const session = useSession(auth)
  return useMutation(({ data }: { data: UploadMediaChunk.Body }) => {
    return uploadMediaChunk(params, data, session)
  }, options)
}

export function useUploadMediaChunksComplete(
  params: UploadMediaChunksComplete.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<UploadMediaChunksComplete.Response, Error>,
) {
  const session = useSession(auth)
  return useMutation(() => {
    return uploadMediaChunksComplete(params, session)
  }, options)
}

export function useImportMedia(
  auth?: AuthData | undefined,
  options?: UseMutationOptions<ImportMedia.Response, Error, { data: ImportMedia.Body }>,
) {
  const session = useSession(auth)
  return useMutation(({ data }: { data: ImportMedia.Body }) => {
    return importMedia(data, session)
  }, options)
}

export function useMediaSources<TData = GetMediaSources.Response>(
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetMediaSources.Response,
    Error,
    TData,
    ReturnType<typeof keys.source.list>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.source.list(session),
    ({ signal }) => {
      return getMediaSources(session, { signal })
    },
    options,
  )
}

export function useMediaSource<TData = GetMediaSource.Response>(
  params: GetMediaSource.Params,
  auth?: AuthData | undefined,
  options?: UseQueryOptions<
    GetMediaSource.Response,
    Error,
    TData,
    ReturnType<typeof keys.source.detail>
  >,
) {
  const session = useSession(auth)
  return useQuery(
    keys.source.detail(params, session),
    ({ signal }) => {
      return getMediaSource(params, session, { signal })
    },
    options,
  )
}

export function useCreateMediaSource(
  auth?: AuthData | undefined,
  options?: UseMutationOptions<CreateMediaSource.Response, Error, { data: CreateMediaSource.Body }>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data }: { data: CreateMediaSource.Body }) => {
      return createMediaSource(data, session)
    },
    {
      ...options,
      onSuccess(...args) {
        queryClient.invalidateQueries(keys.source.lists())
        options?.onSuccess?.(...args)
      },
    },
  )
}

export function useUpdateMediaSource(
  params: UpdateMediaSource.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<UpdateMediaSource.Response, Error, { data: UpdateMediaSource.Body }>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    ({ data }: { data: UpdateMediaSource.Body }) => {
      return updateMediaSource(params, data, session)
    },
    {
      ...options,
      onSuccess(source, ...args) {
        queryClient.invalidateQueries(keys.source.lists())
        queryClient.invalidateQueries(keys.source.detail({ code: source.code }))
        options?.onSuccess?.(source, ...args)
      },
    },
  )
}

export function useDeleteMediaSource(
  params: DeleteMediaSource.Params,
  auth?: AuthData | undefined,
  options?: UseMutationOptions<DeleteMediaSource.Response, Error>,
) {
  const queryClient = useQueryClient()
  const session = useSession(auth)
  return useMutation(
    () => {
      return deleteMediaSource(params, session)
    },
    {
      ...options,
      onSuccess(...args) {
        queryClient.invalidateQueries(keys.source.lists())
        queryClient.invalidateQueries(keys.source.detail({ code: params.code }))
        options?.onSuccess?.(...args)
      },
    },
  )
}
