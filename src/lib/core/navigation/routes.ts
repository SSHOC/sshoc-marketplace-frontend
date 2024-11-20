import type { AboutPage } from "../../../pages/about/[id]";
import type { ActorsPage } from "../../../pages/account/actors";
import type { ContributedItemsPage } from "../../../pages/account/contributed-items";
import type { DraftItemsPage } from "../../../pages/account/draft-items";
import type { AccountPage } from "../../../pages/account/index";
import type { ModerateItemsPage } from "../../../pages/account/moderate-items";
import type { SourcesPage } from "../../../pages/account/sources";
import type { UsersPage } from "../../../pages/account/users";
import type { VocabulariesPage } from "../../../pages/account/vocabularies";
import type { AdminPage } from "../../../pages/admin";
import type { SignInPage } from "../../../pages/auth/sign-in";
import type { SignUpPage } from "../../../pages/auth/sign-up";
import type { BrowsePage } from "../../../pages/browse/[id]";
import type { ContactPage } from "../../../pages/contact/index";
import type { ContributePage } from "../../../pages/contribute/[id]";
import type { EditDatasetPage } from "../../../pages/dataset/[persistentId]/edit";
import type { DatasetHistoryPage } from "../../../pages/dataset/[persistentId]/history";
import type { DatasetPage } from "../../../pages/dataset/[persistentId]/index";
import type { EditDatasetVersionPage } from "../../../pages/dataset/[persistentId]/version/[versionId]/edit";
import type { DatasetVersionPage } from "../../../pages/dataset/[persistentId]/version/[versionId]/index";
import type { ReviewDatasetPage } from "../../../pages/dataset/[persistentId]/version/[versionId]/review";
import type { CreateDatasetPage } from "../../../pages/dataset/new";
import type { HomePage } from "../../../pages/index";
import type { PrivacyPolicyPage } from "../../../pages/privacy-policy/index";
import type { EditPublicationPage } from "../../../pages/publication/[persistentId]/edit";
import type { PublicationHistoryPage } from "../../../pages/publication/[persistentId]/history";
import type { PublicationPage } from "../../../pages/publication/[persistentId]/index";
import type { EditPublicationVersionPage } from "../../../pages/publication/[persistentId]/version/[versionId]/edit";
import type { PublicationVersionPage } from "../../../pages/publication/[persistentId]/version/[versionId]/index";
import type { ReviewPublicationPage } from "../../../pages/publication/[persistentId]/version/[versionId]/review";
import type { CreatePublicationPage } from "../../../pages/publication/new";
import type { SearchPage } from "../../../pages/search/index";
import type { SuccessPage } from "../../../pages/success/index";
import type { TermsOfUsePage } from "../../../pages/terms-of-use/index";
import type { EditToolOrServicePage } from "../../../pages/tool-or-service/[persistentId]/edit";
import type { ToolOrServiceHistoryPage } from "../../../pages/tool-or-service/[persistentId]/history";
import type { ToolOrServicePage } from "../../../pages/tool-or-service/[persistentId]/index";
import type { EditToolOrServiceVersionPage } from "../../../pages/tool-or-service/[persistentId]/version/[versionId]/edit";
import type { ToolOrServiceVersionPage } from "../../../pages/tool-or-service/[persistentId]/version/[versionId]/index";
import type { ReviewToolOrServicePage } from "../../../pages/tool-or-service/[persistentId]/version/[versionId]/review";
import type { CreateToolOrServicePage } from "../../../pages/tool-or-service/new";
import type { EditTrainingMaterialPage } from "../../../pages/training-material/[persistentId]/edit";
import type { TrainingMaterialHistoryPage } from "../../../pages/training-material/[persistentId]/history";
import type { TrainingMaterialPage } from "../../../pages/training-material/[persistentId]/index";
import type { EditTrainingMaterialVersionPage } from "../../../pages/training-material/[persistentId]/version/[versionId]/edit";
import type { TrainingMaterialVersionPage } from "../../../pages/training-material/[persistentId]/version/[versionId]/index";
import type { ReviewTrainingMaterialPage } from "../../../pages/training-material/[persistentId]/version/[versionId]/review";
import type { CreateTrainingMaterialPage } from "../../../pages/training-material/new";
import type { EditWorkflowPage } from "../../../pages/workflow/[persistentId]/edit";
import type { WorkflowHistoryPage } from "../../../pages/workflow/[persistentId]/history";
import type { WorkflowPage } from "../../../pages/workflow/[persistentId]/index";
import type { EditWorkflowVersionPage } from "../../../pages/workflow/[persistentId]/version/[versionId]/edit";
import type { WorkflowVersionPage } from "../../../pages/workflow/[persistentId]/version/[versionId]/index";
import type { ReviewWorkflowPage } from "../../../pages/workflow/[persistentId]/version/[versionId]/review";
import type { CreateWorkflowPage } from "../../../pages/workflow/new";

export const routes = {
  AboutPage(
    { id }: AboutPage.PathParamsInput,
    searchParams?: AboutPage.SearchParamsInput
  ) {
    return { pathname: `/about/${id}`, searchParams };
  },
  ActorsPage(searchParams?: ActorsPage.SearchParamsInput) {
    return { pathname: `/account/actors`, searchParams };
  },
  ContributedItemsPage(searchParams?: ContributedItemsPage.SearchParamsInput) {
    return { pathname: `/account/contributed-items`, searchParams };
  },
  DraftItemsPage(searchParams?: DraftItemsPage.SearchParamsInput) {
    return { pathname: `/account/draft-items`, searchParams };
  },
  AccountPage(searchParams?: AccountPage.SearchParamsInput) {
    return { pathname: `/account`, searchParams };
  },
  ModerateItemsPage(searchParams?: ModerateItemsPage.SearchParamsInput) {
    return { pathname: `/account/moderate-items`, searchParams };
  },
  SourcesPage(searchParams?: SourcesPage.SearchParamsInput) {
    return { pathname: `/account/sources`, searchParams };
  },
  UsersPage(searchParams?: UsersPage.SearchParamsInput) {
    return { pathname: `/account/users`, searchParams };
  },
  VocabulariesPage(searchParams?: VocabulariesPage.SearchParamsInput) {
    return { pathname: `/account/vocabularies`, searchParams };
  },
  AdminPage(searchParams?: AdminPage.SearchParamsInput) {
    return { pathname: `/admin`, searchParams };
  },
  SignInPage(searchParams?: SignInPage.SearchParamsInput) {
    return { pathname: `/auth/sign-in`, searchParams };
  },
  SignUpPage(searchParams?: SignUpPage.SearchParamsInput) {
    return { pathname: `/auth/sign-up`, searchParams };
  },
  BrowsePage(
    { id }: BrowsePage.PathParamsInput,
    searchParams?: BrowsePage.SearchParamsInput
  ) {
    return { pathname: `/browse/${id}`, searchParams };
  },
  ContactPage(searchParams?: ContactPage.SearchParamsInput) {
    return { pathname: `/contact`, searchParams };
  },
  ContributePage(
    { id }: ContributePage.PathParamsInput,
    searchParams?: ContributePage.SearchParamsInput
  ) {
    return { pathname: `/contribute/${id}`, searchParams };
  },
  EditDatasetPage(
    { persistentId }: EditDatasetPage.PathParamsInput,
    searchParams?: EditDatasetPage.SearchParamsInput
  ) {
    return { pathname: `/dataset/${persistentId}/edit`, searchParams };
  },
  DatasetHistoryPage(
    { persistentId }: DatasetHistoryPage.PathParamsInput,
    searchParams?: DatasetHistoryPage.SearchParamsInput
  ) {
    return {
      pathname: `/dataset/${persistentId}/history`,
      searchParams,
    };
  },
  DatasetPage(
    { persistentId }: DatasetPage.PathParamsInput,
    searchParams?: DatasetPage.SearchParamsInput
  ) {
    return { pathname: `/dataset/${persistentId}`, searchParams };
  },
  EditDatasetVersionPage(
    { persistentId, versionId }: EditDatasetVersionPage.PathParamsInput,
    searchParams?: EditDatasetVersionPage.SearchParamsInput
  ) {
    return {
      pathname: `/dataset/${persistentId}/version/${versionId}/edit`,
      searchParams,
    };
  },
  DatasetVersionPage(
    { persistentId, versionId }: DatasetVersionPage.PathParamsInput,
    searchParams?: DatasetVersionPage.SearchParamsInput
  ) {
    return {
      pathname: `/dataset/${persistentId}/version/${versionId}`,
      searchParams,
    };
  },
  ReviewDatasetPage(
    { persistentId, versionId }: ReviewDatasetPage.PathParamsInput,
    searchParams?: ReviewDatasetPage.SearchParamsInput
  ) {
    return {
      pathname: `/dataset/${persistentId}/version/${versionId}/review`,
      searchParams,
    };
  },
  CreateDatasetPage(searchParams?: CreateDatasetPage.SearchParamsInput) {
    return { pathname: `/dataset/new`, searchParams };
  },
  HomePage(searchParams?: HomePage.SearchParamsInput) {
    return { pathname: `/`, searchParams };
  },
  PrivacyPolicyPage(searchParams?: PrivacyPolicyPage.SearchParamsInput) {
    return { pathname: `/privacy-policy`, searchParams };
  },
  EditPublicationPage(
    { persistentId }: EditPublicationPage.PathParamsInput,
    searchParams?: EditPublicationPage.SearchParamsInput
  ) {
    return {
      pathname: `/publication/${persistentId}/edit`,
      searchParams,
    };
  },
  PublicationHistoryPage(
    { persistentId }: PublicationHistoryPage.PathParamsInput,
    searchParams?: PublicationHistoryPage.SearchParamsInput
  ) {
    return {
      pathname: `/publication/${persistentId}/history`,
      searchParams,
    };
  },
  PublicationPage(
    { persistentId }: PublicationPage.PathParamsInput,
    searchParams?: PublicationPage.SearchParamsInput
  ) {
    return { pathname: `/publication/${persistentId}`, searchParams };
  },
  EditPublicationVersionPage(
    { persistentId, versionId }: EditPublicationVersionPage.PathParamsInput,
    searchParams?: EditPublicationVersionPage.SearchParamsInput
  ) {
    return {
      pathname: `/publication/${persistentId}/version/${versionId}/edit`,
      searchParams,
    };
  },
  PublicationVersionPage(
    { persistentId, versionId }: PublicationVersionPage.PathParamsInput,
    searchParams?: PublicationVersionPage.SearchParamsInput
  ) {
    return {
      pathname: `/publication/${persistentId}/version/${versionId}`,
      searchParams,
    };
  },
  ReviewPublicationPage(
    { persistentId, versionId }: ReviewPublicationPage.PathParamsInput,
    searchParams?: ReviewPublicationPage.SearchParamsInput
  ) {
    return {
      pathname: `/publication/${persistentId}/version/${versionId}/review`,
      searchParams,
    };
  },
  CreatePublicationPage(
    searchParams?: CreatePublicationPage.SearchParamsInput
  ) {
    return { pathname: `/publication/new`, searchParams };
  },
  SearchPage(searchParams?: SearchPage.SearchParamsInput) {
    return { pathname: `/search`, searchParams };
  },
  SuccessPage(searchParams?: SuccessPage.SearchParamsInput) {
    return { pathname: `/success`, searchParams };
  },
  TermsOfUsePage(searchParams?: TermsOfUsePage.SearchParamsInput) {
    return { pathname: `/terms-of-use`, searchParams };
  },
  EditToolOrServicePage(
    { persistentId }: EditToolOrServicePage.PathParamsInput,
    searchParams?: EditToolOrServicePage.SearchParamsInput
  ) {
    return {
      pathname: `/tool-or-service/${persistentId}/edit`,
      searchParams,
    };
  },
  ToolOrServiceHistoryPage(
    { persistentId }: ToolOrServiceHistoryPage.PathParamsInput,
    searchParams?: ToolOrServiceHistoryPage.SearchParamsInput
  ) {
    return {
      pathname: `/tool-or-service/${persistentId}/history`,
      searchParams,
    };
  },
  ToolOrServicePage(
    { persistentId }: ToolOrServicePage.PathParamsInput,
    searchParams?: ToolOrServicePage.SearchParamsInput
  ) {
    return {
      pathname: `/tool-or-service/${persistentId}`,
      searchParams,
    };
  },
  EditToolOrServiceVersionPage(
    { persistentId, versionId }: EditToolOrServiceVersionPage.PathParamsInput,
    searchParams?: EditToolOrServiceVersionPage.SearchParamsInput
  ) {
    return {
      pathname: `/tool-or-service/${persistentId}/version/${versionId}/edit`,
      searchParams,
    };
  },
  ToolOrServiceVersionPage(
    { persistentId, versionId }: ToolOrServiceVersionPage.PathParamsInput,
    searchParams?: ToolOrServiceVersionPage.SearchParamsInput
  ) {
    return {
      pathname: `/tool-or-service/${persistentId}/version/${versionId}`,
      searchParams,
    };
  },
  ReviewToolOrServicePage(
    { persistentId, versionId }: ReviewToolOrServicePage.PathParamsInput,
    searchParams?: ReviewToolOrServicePage.SearchParamsInput
  ) {
    return {
      pathname: `/tool-or-service/${persistentId}/version/${versionId}/review`,
      searchParams,
    };
  },
  CreateToolOrServicePage(
    searchParams?: CreateToolOrServicePage.SearchParamsInput
  ) {
    return { pathname: `/tool-or-service/new`, searchParams };
  },
  EditTrainingMaterialPage(
    { persistentId }: EditTrainingMaterialPage.PathParamsInput,
    searchParams?: EditTrainingMaterialPage.SearchParamsInput
  ) {
    return {
      pathname: `/training-material/${persistentId}/edit`,
      searchParams,
    };
  },
  TrainingMaterialHistoryPage(
    { persistentId }: TrainingMaterialHistoryPage.PathParamsInput,
    searchParams?: TrainingMaterialHistoryPage.SearchParamsInput
  ) {
    return {
      pathname: `/training-material/${persistentId}/history`,
      searchParams,
    };
  },
  TrainingMaterialPage(
    { persistentId }: TrainingMaterialPage.PathParamsInput,
    searchParams?: TrainingMaterialPage.SearchParamsInput
  ) {
    return {
      pathname: `/training-material/${persistentId}`,
      searchParams,
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
      searchParams,
    };
  },
  TrainingMaterialVersionPage(
    { persistentId, versionId }: TrainingMaterialVersionPage.PathParamsInput,
    searchParams?: TrainingMaterialVersionPage.SearchParamsInput
  ) {
    return {
      pathname: `/training-material/${persistentId}/version/${versionId}`,
      searchParams,
    };
  },
  ReviewTrainingMaterialPage(
    { persistentId, versionId }: ReviewTrainingMaterialPage.PathParamsInput,
    searchParams?: ReviewTrainingMaterialPage.SearchParamsInput
  ) {
    return {
      pathname: `/training-material/${persistentId}/version/${versionId}/review`,
      searchParams,
    };
  },
  CreateTrainingMaterialPage(
    searchParams?: CreateTrainingMaterialPage.SearchParamsInput
  ) {
    return { pathname: `/training-material/new`, searchParams };
  },
  EditWorkflowPage(
    { persistentId }: EditWorkflowPage.PathParamsInput,
    searchParams?: EditWorkflowPage.SearchParamsInput
  ) {
    return { pathname: `/workflow/${persistentId}/edit`, searchParams };
  },
  WorkflowHistoryPage(
    { persistentId }: WorkflowHistoryPage.PathParamsInput,
    searchParams?: WorkflowHistoryPage.SearchParamsInput
  ) {
    return {
      pathname: `/workflow/${persistentId}/history`,
      searchParams,
    };
  },
  WorkflowPage(
    { persistentId }: WorkflowPage.PathParamsInput,
    searchParams?: WorkflowPage.SearchParamsInput
  ) {
    return { pathname: `/workflow/${persistentId}`, searchParams };
  },
  EditWorkflowVersionPage(
    { persistentId, versionId }: EditWorkflowVersionPage.PathParamsInput,
    searchParams?: EditWorkflowVersionPage.SearchParamsInput
  ) {
    return {
      pathname: `/workflow/${persistentId}/version/${versionId}/edit`,
      searchParams,
    };
  },
  WorkflowVersionPage(
    { persistentId, versionId }: WorkflowVersionPage.PathParamsInput,
    searchParams?: WorkflowVersionPage.SearchParamsInput
  ) {
    return {
      pathname: `/workflow/${persistentId}/version/${versionId}`,
      searchParams,
    };
  },
  ReviewWorkflowPage(
    { persistentId, versionId }: ReviewWorkflowPage.PathParamsInput,
    searchParams?: ReviewWorkflowPage.SearchParamsInput
  ) {
    return {
      pathname: `/workflow/${persistentId}/version/${versionId}/review`,
      searchParams,
    };
  },
  CreateWorkflowPage(searchParams?: CreateWorkflowPage.SearchParamsInput) {
    return { pathname: `/workflow/new`, searchParams };
  },
};
