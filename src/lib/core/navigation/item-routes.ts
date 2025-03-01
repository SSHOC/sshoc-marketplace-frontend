import type { ItemCategory } from '@/data/sshoc/api/item'

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export const itemRoutes = {
  ItemPage(category: ItemCategory) {
    switch (category) {
      case 'dataset':
        return ({ persistentId }: { persistentId: string }, searchParams?: object) => {
          return { pathname: `/dataset/${persistentId}`, query: searchParams }
        }
      case 'publication':
        return ({ persistentId }: { persistentId: string }, searchParams?: object) => {
          return { pathname: `/publication/${persistentId}`, query: searchParams }
        }
      case 'tool-or-service':
        return ({ persistentId }: { persistentId: string }, searchParams?: object) => {
          return { pathname: `/tool-or-service/${persistentId}`, query: searchParams }
        }
      case 'training-material':
        return ({ persistentId }: { persistentId: string }, searchParams?: object) => {
          return { pathname: `/training-material/${persistentId}`, query: searchParams }
        }
      case 'workflow':
        return ({ persistentId }: { persistentId: string }, searchParams?: object) => {
          return { pathname: `/workflow/${persistentId}`, query: searchParams }
        }
    }
  },
  ItemVersionPage(category: ItemCategory) {
    switch (category) {
      case 'dataset':
        return (
          { persistentId, versionId }: { persistentId: string; versionId: number },
          searchParams?: object,
        ) => {
          return { pathname: `/dataset/${persistentId}/version/${versionId}`, query: searchParams }
        }
      case 'publication':
        return (
          { persistentId, versionId }: { persistentId: string; versionId: number },
          searchParams?: object,
        ) => {
          return {
            pathname: `/publication/${persistentId}/version/${versionId}`,
            query: searchParams,
          }
        }
      case 'tool-or-service':
        return (
          { persistentId, versionId }: { persistentId: string; versionId: number },
          searchParams?: object,
        ) => {
          return {
            pathname: `/tool-or-service/${persistentId}/version/${versionId}`,
            query: searchParams,
          }
        }
      case 'training-material':
        return (
          { persistentId, versionId }: { persistentId: string; versionId: number },
          searchParams?: object,
        ) => {
          return {
            pathname: `/training-material/${persistentId}/version/${versionId}`,
            query: searchParams,
          }
        }
      case 'workflow':
        return (
          { persistentId, versionId }: { persistentId: string; versionId: number },
          searchParams?: object,
        ) => {
          return { pathname: `/workflow/${persistentId}/version/${versionId}`, query: searchParams }
        }
    }
  },
  ItemHistoryPage(category: ItemCategory) {
    switch (category) {
      case 'dataset':
        return ({ persistentId }: { persistentId: string }, searchParams?: object) => {
          return { pathname: `/dataset/${persistentId}/history`, query: searchParams }
        }
      case 'publication':
        return ({ persistentId }: { persistentId: string }, searchParams?: object) => {
          return { pathname: `/publication/${persistentId}/history`, query: searchParams }
        }
      case 'tool-or-service':
        return ({ persistentId }: { persistentId: string }, searchParams?: object) => {
          return { pathname: `/tool-or-service/${persistentId}/history`, query: searchParams }
        }
      case 'training-material':
        return ({ persistentId }: { persistentId: string }, searchParams?: object) => {
          return { pathname: `/training-material/${persistentId}/history`, query: searchParams }
        }
      case 'workflow':
        return ({ persistentId }: { persistentId: string }, searchParams?: object) => {
          return { pathname: `/workflow/${persistentId}/history`, query: searchParams }
        }
    }
  },
  ItemCreatePage(category: ItemCategory) {
    switch (category) {
      case 'dataset':
        return (searchParams?: object) => {
          return { pathname: `/dataset/new`, query: searchParams }
        }
      case 'publication':
        return (searchParams?: object) => {
          return { pathname: `/publication/new`, query: searchParams }
        }
      case 'tool-or-service':
        return (searchParams?: object) => {
          return { pathname: `/tool-or-service/new`, query: searchParams }
        }
      case 'training-material':
        return (searchParams?: object) => {
          return { pathname: `/training-material/new`, query: searchParams }
        }
      case 'workflow':
        return (searchParams?: object) => {
          return { pathname: `/workflow/new`, query: searchParams }
        }
    }
  },
  ItemEditPage(category: ItemCategory) {
    switch (category) {
      case 'dataset':
        return ({ persistentId }: { persistentId: string }, searchParams?: object) => {
          return { pathname: `/dataset/${persistentId}/edit`, query: searchParams }
        }
      case 'publication':
        return ({ persistentId }: { persistentId: string }, searchParams?: object) => {
          return { pathname: `/publication/${persistentId}/edit`, query: searchParams }
        }
      case 'tool-or-service':
        return ({ persistentId }: { persistentId: string }, searchParams?: object) => {
          return { pathname: `/tool-or-service/${persistentId}/edit`, query: searchParams }
        }
      case 'training-material':
        return ({ persistentId }: { persistentId: string }, searchParams?: object) => {
          return { pathname: `/training-material/${persistentId}/edit`, query: searchParams }
        }
      case 'workflow':
        return ({ persistentId }: { persistentId: string }, searchParams?: object) => {
          return { pathname: `/workflow/${persistentId}/edit`, query: searchParams }
        }
    }
  },
  ItemEditVersionPage(category: ItemCategory) {
    switch (category) {
      case 'dataset':
        return (
          { persistentId, versionId }: { persistentId: string; versionId: number },
          searchParams?: object,
        ) => {
          return {
            pathname: `/dataset/${persistentId}/version/${versionId}/edit`,
            query: searchParams,
          }
        }
      case 'publication':
        return (
          { persistentId, versionId }: { persistentId: string; versionId: number },
          searchParams?: object,
        ) => {
          return {
            pathname: `/publication/${persistentId}/version/${versionId}/edit`,
            query: searchParams,
          }
        }
      case 'tool-or-service':
        return (
          { persistentId, versionId }: { persistentId: string; versionId: number },
          searchParams?: object,
        ) => {
          return {
            pathname: `/tool-or-service/${persistentId}/version/${versionId}/edit`,
            query: searchParams,
          }
        }
      case 'training-material':
        return (
          { persistentId, versionId }: { persistentId: string; versionId: number },
          searchParams?: object,
        ) => {
          return {
            pathname: `/training-material/${persistentId}/version/${versionId}/edit`,
            query: searchParams,
          }
        }
      case 'workflow':
        return (
          { persistentId, versionId }: { persistentId: string; versionId: number },
          searchParams?: object,
        ) => {
          return {
            pathname: `/workflow/${persistentId}/version/${versionId}/edit`,
            query: searchParams,
          }
        }
    }
  },
  ItemReviewPage(category: ItemCategory) {
    switch (category) {
      case 'dataset':
        return (
          { persistentId, versionId }: { persistentId: string; versionId: number },
          searchParams?: object,
        ) => {
          return {
            pathname: `/dataset/${persistentId}/version/${versionId}/review`,
            query: searchParams,
          }
        }
      case 'publication':
        return (
          { persistentId, versionId }: { persistentId: string; versionId: number },
          searchParams?: object,
        ) => {
          return {
            pathname: `/publication/${persistentId}/version/${versionId}/review`,
            query: searchParams,
          }
        }
      case 'tool-or-service':
        return (
          { persistentId, versionId }: { persistentId: string; versionId: number },
          searchParams?: object,
        ) => {
          return {
            pathname: `/tool-or-service/${persistentId}/version/${versionId}/review`,
            query: searchParams,
          }
        }
      case 'training-material':
        return (
          { persistentId, versionId }: { persistentId: string; versionId: number },
          searchParams?: object,
        ) => {
          return {
            pathname: `/training-material/${persistentId}/version/${versionId}/review`,
            query: searchParams,
          }
        }
      case 'workflow':
        return (
          { persistentId, versionId }: { persistentId: string; versionId: number },
          searchParams?: object,
        ) => {
          return {
            pathname: `/workflow/${persistentId}/version/${versionId}/review`,
            query: searchParams,
          }
        }
    }
  },
}
