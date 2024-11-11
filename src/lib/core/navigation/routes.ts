import type { AboutPage } from "../../../pages/about/[id].page.template";
import type { ActorsPage } from "../../../pages/account/actors.page";
import type { ContributedItemsPage } from "../../../pages/account/contributed-items.page";
import type { DraftItemsPage } from "../../../pages/account/draft-items.page";
import type { AccountPage } from "../../../pages/account/index.page";
import type { ModerateItemsPage } from "../../../pages/account/moderate-items.page";
import type { SourcesPage } from "../../../pages/account/sources.page";
import type { UsersPage } from "../../../pages/account/users.page";
import type { VocabulariesPage } from "../../../pages/account/vocabularies.page";
import type { AdminPage } from "../../../pages/admin.page";
import type { SignInPage } from "../../../pages/auth/sign-in.page";
import type { SignUpPage } from "../../../pages/auth/sign-up.page";
import type { BrowsePage } from "../../../pages/browse/[id].page";
import type { ContactPage } from "../../../pages/contact/index.page";
import type { ContributePage } from "../../../pages/contribute/[id].page.template";
import type { EditDatasetPage } from "../../../pages/dataset/[persistentId]/edit.page";
import type { DatasetHistoryPage } from "../../../pages/dataset/[persistentId]/history.page";
import type { DatasetPage } from "../../../pages/dataset/[persistentId]/index.page";
import type { EditDatasetVersionPage } from "../../../pages/dataset/[persistentId]/version/[versionId]/edit.page";
import type { DatasetVersionPage } from "../../../pages/dataset/[persistentId]/version/[versionId]/index.page";
import type { ReviewDatasetPage } from "../../../pages/dataset/[persistentId]/version/[versionId]/review.page";
import type { CreateDatasetPage } from "../../../pages/dataset/new.page";
import type { HomePage } from "../../../pages/index.page";
import type { PrivacyPolicyPage } from "../../../pages/privacy-policy/index.page";
import type { EditPublicationPage } from "../../../pages/publication/[persistentId]/edit.page";
import type { PublicationHistoryPage } from "../../../pages/publication/[persistentId]/history.page";
import type { PublicationPage } from "../../../pages/publication/[persistentId]/index.page";
import type { EditPublicationVersionPage } from "../../../pages/publication/[persistentId]/version/[versionId]/edit.page";
import type { PublicationVersionPage } from "../../../pages/publication/[persistentId]/version/[versionId]/index.page";
import type { ReviewPublicationPage } from "../../../pages/publication/[persistentId]/version/[versionId]/review.page";
import type { CreatePublicationPage } from "../../../pages/publication/new.page";
import type { SearchPage } from "../../../pages/search/index.page";
import type { SuccessPage } from "../../../pages/success/index.page";
import type { TermsOfUsePage } from "../../../pages/terms-of-use/index.page";
import type { EditToolOrServicePage } from "../../../pages/tool-or-service/[persistentId]/edit.page";
import type { ToolOrServiceHistoryPage } from "../../../pages/tool-or-service/[persistentId]/history.page";
import type { ToolOrServicePage } from "../../../pages/tool-or-service/[persistentId]/index.page";
import type { EditToolOrServiceVersionPage } from "../../../pages/tool-or-service/[persistentId]/version/[versionId]/edit.page";
import type { ToolOrServiceVersionPage } from "../../../pages/tool-or-service/[persistentId]/version/[versionId]/index.page";
import type { ReviewToolOrServicePage } from "../../../pages/tool-or-service/[persistentId]/version/[versionId]/review.page";
import type { CreateToolOrServicePage } from "../../../pages/tool-or-service/new.page";
import type { EditTrainingMaterialPage } from "../../../pages/training-material/[persistentId]/edit.page";
import type { TrainingMaterialHistoryPage } from "../../../pages/training-material/[persistentId]/history.page";
import type { TrainingMaterialPage } from "../../../pages/training-material/[persistentId]/index.page";
import type { EditTrainingMaterialVersionPage } from "../../../pages/training-material/[persistentId]/version/[versionId]/edit.page";
import type { TrainingMaterialVersionPage } from "../../../pages/training-material/[persistentId]/version/[versionId]/index.page";
import type { ReviewTrainingMaterialPage } from "../../../pages/training-material/[persistentId]/version/[versionId]/review.page";
import type { CreateTrainingMaterialPage } from "../../../pages/training-material/new.page";
import type { EditWorkflowPage } from "../../../pages/workflow/[persistentId]/edit.page";
import type { WorkflowHistoryPage } from "../../../pages/workflow/[persistentId]/history.page";
import type { WorkflowPage } from "../../../pages/workflow/[persistentId]/index.page";
import type { EditWorkflowVersionPage } from "../../../pages/workflow/[persistentId]/version/[versionId]/edit.page";
import type { WorkflowVersionPage } from "../../../pages/workflow/[persistentId]/version/[versionId]/index.page";
import type { ReviewWorkflowPage } from "../../../pages/workflow/[persistentId]/version/[versionId]/review.page";
import type { CreateWorkflowPage } from "../../../pages/workflow/new.page";

export const routes = {
  AboutPage(
    { id }: AboutPage.PathParamsInput,
    searchParams?: AboutPage.SearchParamsInput
  ) {
    return { pathname: `/about/${id}`, query: searchParams };
  },
  ActorsPage(searchParams?: ActorsPage.SearchParamsInput) {
    return { pathname: `/account/actors`, query: searchParams };
  },
  ContributedItemsPage(searchParams?: ContributedItemsPage.SearchParamsInput) {
    return { pathname: `/account/contributed-items`, query: searchParams };
  },
  DraftItemsPage(searchParams?: DraftItemsPage.SearchParamsInput) {
    return { pathname: `/account/draft-items`, query: searchParams };
  },
  AccountPage(searchParams?: AccountPage.SearchParamsInput) {
    return { pathname: `/account`, query: searchParams };
  },
  ModerateItemsPage(searchParams?: ModerateItemsPage.SearchParamsInput) {
    return { pathname: `/account/moderate-items`, query: searchParams };
  },
  SourcesPage(searchParams?: SourcesPage.SearchParamsInput) {
    return { pathname: `/account/sources`, query: searchParams };
  },
  UsersPage(searchParams?: UsersPage.SearchParamsInput) {
    return { pathname: `/account/users`, query: searchParams };
  },
  VocabulariesPage(searchParams?: VocabulariesPage.SearchParamsInput) {
    return { pathname: `/account/vocabularies`, query: searchParams };
  },
  AdminPage(searchParams?: AdminPage.SearchParamsInput) {
    return { pathname: `/admin`, query: searchParams };
  },
  SignInPage(searchParams?: SignInPage.SearchParamsInput) {
    return { pathname: `/auth/sign-in`, query: searchParams };
  },
  SignUpPage(searchParams?: SignUpPage.SearchParamsInput) {
    return { pathname: `/auth/sign-up`, query: searchParams };
  },
  BrowsePage(
    { id }: BrowsePage.PathParamsInput,
    searchParams?: BrowsePage.SearchParamsInput
  ) {
    return { pathname: `/browse/${id}`, query: searchParams };
  },
  ContactPage(searchParams?: ContactPage.SearchParamsInput) {
    return { pathname: `/contact`, query: searchParams };
  },
  ContributePage(
    { id }: ContributePage.PathParamsInput,
    searchParams?: ContributePage.SearchParamsInput
  ) {
    return { pathname: `/contribute/${id}`, query: searchParams };
  },
  EditDatasetPage(
    { persistentId }: EditDatasetPage.PathParamsInput,
    searchParams?: EditDatasetPage.SearchParamsInput
  ) {
    return { pathname: `/dataset/${persistentId}/edit`, query: searchParams };
  },
  DatasetHistoryPage(
    { persistentId }: DatasetHistoryPage.PathParamsInput,
    searchParams?: DatasetHistoryPage.SearchParamsInput
  ) {
    return {
      pathname: `/dataset/${persistentId}/history`,
      query: searchParams,
    };
  },
  DatasetPage(
    { persistentId }: DatasetPage.PathParamsInput,
    searchParams?: DatasetPage.SearchParamsInput
  ) {
    return { pathname: `/dataset/${persistentId}`, query: searchParams };
  },
  EditDatasetVersionPage(
    { persistentId, versionId }: EditDatasetVersionPage.PathParamsInput,
    searchParams?: EditDatasetVersionPage.SearchParamsInput
  ) {
    return {
      pathname: `/dataset/${persistentId}/version/${versionId}/edit`,
      query: searchParams,
    };
  },
  DatasetVersionPage(
    { persistentId, versionId }: DatasetVersionPage.PathParamsInput,
    searchParams?: DatasetVersionPage.SearchParamsInput
  ) {
    return {
      pathname: `/dataset/${persistentId}/version/${versionId}`,
      query: searchParams,
    };
  },
  ReviewDatasetPage(
    { persistentId, versionId }: ReviewDatasetPage.PathParamsInput,
    searchParams?: ReviewDatasetPage.SearchParamsInput
  ) {
    return {
      pathname: `/dataset/${persistentId}/version/${versionId}/review`,
      query: searchParams,
    };
  },
  CreateDatasetPage(searchParams?: CreateDatasetPage.SearchParamsInput) {
    return { pathname: `/dataset/new`, query: searchParams };
  },
  HomePage(searchParams?: HomePage.SearchParamsInput) {
    return { pathname: `/`, query: searchParams };
  },
  PrivacyPolicyPage(searchParams?: PrivacyPolicyPage.SearchParamsInput) {
    return { pathname: `/privacy-policy`, query: searchParams };
  },
  EditPublicationPage(
    { persistentId }: EditPublicationPage.PathParamsInput,
    searchParams?: EditPublicationPage.SearchParamsInput
  ) {
    return {
      pathname: `/publication/${persistentId}/edit`,
      query: searchParams,
    };
  },
  PublicationHistoryPage(
    { persistentId }: PublicationHistoryPage.PathParamsInput,
    searchParams?: PublicationHistoryPage.SearchParamsInput
  ) {
    return {
      pathname: `/publication/${persistentId}/history`,
      query: searchParams,
    };
  },
  PublicationPage(
    { persistentId }: PublicationPage.PathParamsInput,
    searchParams?: PublicationPage.SearchParamsInput
  ) {
    return { pathname: `/publication/${persistentId}`, query: searchParams };
  },
  EditPublicationVersionPage(
    { persistentId, versionId }: EditPublicationVersionPage.PathParamsInput,
    searchParams?: EditPublicationVersionPage.SearchParamsInput
  ) {
    return {
      pathname: `/publication/${persistentId}/version/${versionId}/edit`,
      query: searchParams,
    };
  },
  PublicationVersionPage(
    { persistentId, versionId }: PublicationVersionPage.PathParamsInput,
    searchParams?: PublicationVersionPage.SearchParamsInput
  ) {
    return {
      pathname: `/publication/${persistentId}/version/${versionId}`,
      query: searchParams,
    };
  },
  ReviewPublicationPage(
    { persistentId, versionId }: ReviewPublicationPage.PathParamsInput,
    searchParams?: ReviewPublicationPage.SearchParamsInput
  ) {
    return {
      pathname: `/publication/${persistentId}/version/${versionId}/review`,
      query: searchParams,
    };
  },
  CreatePublicationPage(
    searchParams?: CreatePublicationPage.SearchParamsInput
  ) {
    return { pathname: `/publication/new`, query: searchParams };
  },
  SearchPage(searchParams?: SearchPage.SearchParamsInput) {
    return { pathname: `/search`, query: searchParams };
  },
  SuccessPage(searchParams?: SuccessPage.SearchParamsInput) {
    return { pathname: `/success`, query: searchParams };
  },
  TermsOfUsePage(searchParams?: TermsOfUsePage.SearchParamsInput) {
    return { pathname: `/terms-of-use`, query: searchParams };
  },
  EditToolOrServicePage(
    { persistentId }: EditToolOrServicePage.PathParamsInput,
    searchParams?: EditToolOrServicePage.SearchParamsInput
  ) {
    return {
      pathname: `/tool-or-service/${persistentId}/edit`,
      query: searchParams,
    };
  },
  ToolOrServiceHistoryPage(
    { persistentId }: ToolOrServiceHistoryPage.PathParamsInput,
    searchParams?: ToolOrServiceHistoryPage.SearchParamsInput
  ) {
    return {
      pathname: `/tool-or-service/${persistentId}/history`,
      query: searchParams,
    };
  },
  ToolOrServicePage(
    { persistentId }: ToolOrServicePage.PathParamsInput,
    searchParams?: ToolOrServicePage.SearchParamsInput
  ) {
    return {
      pathname: `/tool-or-service/${persistentId}`,
      query: searchParams,
    };
  },
  EditToolOrServiceVersionPage(
    { persistentId, versionId }: EditToolOrServiceVersionPage.PathParamsInput,
    searchParams?: EditToolOrServiceVersionPage.SearchParamsInput
  ) {
    return {
      pathname: `/tool-or-service/${persistentId}/version/${versionId}/edit`,
      query: searchParams,
    };
  },
  ToolOrServiceVersionPage(
    { persistentId, versionId }: ToolOrServiceVersionPage.PathParamsInput,
    searchParams?: ToolOrServiceVersionPage.SearchParamsInput
  ) {
    return {
      pathname: `/tool-or-service/${persistentId}/version/${versionId}`,
      query: searchParams,
    };
  },
  ReviewToolOrServicePage(
    { persistentId, versionId }: ReviewToolOrServicePage.PathParamsInput,
    searchParams?: ReviewToolOrServicePage.SearchParamsInput
  ) {
    return {
      pathname: `/tool-or-service/${persistentId}/version/${versionId}/review`,
      query: searchParams,
    };
  },
  CreateToolOrServicePage(
    searchParams?: CreateToolOrServicePage.SearchParamsInput
  ) {
    return { pathname: `/tool-or-service/new`, query: searchParams };
  },
  EditTrainingMaterialPage(
    { persistentId }: EditTrainingMaterialPage.PathParamsInput,
    searchParams?: EditTrainingMaterialPage.SearchParamsInput
  ) {
    return {
      pathname: `/training-material/${persistentId}/edit`,
      query: searchParams,
    };
  },
  TrainingMaterialHistoryPage(
    { persistentId }: TrainingMaterialHistoryPage.PathParamsInput,
    searchParams?: TrainingMaterialHistoryPage.SearchParamsInput
  ) {
    return {
      pathname: `/training-material/${persistentId}/history`,
      query: searchParams,
    };
  },
  TrainingMaterialPage(
    { persistentId }: TrainingMaterialPage.PathParamsInput,
    searchParams?: TrainingMaterialPage.SearchParamsInput
  ) {
    return {
      pathname: `/training-material/${persistentId}`,
      query: searchParams,
    };
  },
  EditTrainingMaterialVersionPage(
    {
      persistentId,
      versionId,
    }: EditTrainingMaterialVersionPage.PathParamsInput,
    searchParams?: EditTrainingMaterialVersionPage.SearchParamsInput
  ) {
    return {
      pathname: `/training-material/${persistentId}/version/${versionId}/edit`,
      query: searchParams,
    };
  },
  TrainingMaterialVersionPage(
    { persistentId, versionId }: TrainingMaterialVersionPage.PathParamsInput,
    searchParams?: TrainingMaterialVersionPage.SearchParamsInput
  ) {
    return {
      pathname: `/training-material/${persistentId}/version/${versionId}`,
      query: searchParams,
    };
  },
  ReviewTrainingMaterialPage(
    { persistentId, versionId }: ReviewTrainingMaterialPage.PathParamsInput,
    searchParams?: ReviewTrainingMaterialPage.SearchParamsInput
  ) {
    return {
      pathname: `/training-material/${persistentId}/version/${versionId}/review`,
      query: searchParams,
    };
  },
  CreateTrainingMaterialPage(
    searchParams?: CreateTrainingMaterialPage.SearchParamsInput
  ) {
    return { pathname: `/training-material/new`, query: searchParams };
  },
  EditWorkflowPage(
    { persistentId }: EditWorkflowPage.PathParamsInput,
    searchParams?: EditWorkflowPage.SearchParamsInput
  ) {
    return { pathname: `/workflow/${persistentId}/edit`, query: searchParams };
  },
  WorkflowHistoryPage(
    { persistentId }: WorkflowHistoryPage.PathParamsInput,
    searchParams?: WorkflowHistoryPage.SearchParamsInput
  ) {
    return {
      pathname: `/workflow/${persistentId}/history`,
      query: searchParams,
    };
  },
  WorkflowPage(
    { persistentId }: WorkflowPage.PathParamsInput,
    searchParams?: WorkflowPage.SearchParamsInput
  ) {
    return { pathname: `/workflow/${persistentId}`, query: searchParams };
  },
  EditWorkflowVersionPage(
    { persistentId, versionId }: EditWorkflowVersionPage.PathParamsInput,
    searchParams?: EditWorkflowVersionPage.SearchParamsInput
  ) {
    return {
      pathname: `/workflow/${persistentId}/version/${versionId}/edit`,
      query: searchParams,
    };
  },
  WorkflowVersionPage(
    { persistentId, versionId }: WorkflowVersionPage.PathParamsInput,
    searchParams?: WorkflowVersionPage.SearchParamsInput
  ) {
    return {
      pathname: `/workflow/${persistentId}/version/${versionId}`,
      query: searchParams,
    };
  },
  ReviewWorkflowPage(
    { persistentId, versionId }: ReviewWorkflowPage.PathParamsInput,
    searchParams?: ReviewWorkflowPage.SearchParamsInput
  ) {
    return {
      pathname: `/workflow/${persistentId}/version/${versionId}/review`,
      query: searchParams,
    };
  },
  CreateWorkflowPage(searchParams?: CreateWorkflowPage.SearchParamsInput) {
    return { pathname: `/workflow/new`, query: searchParams };
  },
};
