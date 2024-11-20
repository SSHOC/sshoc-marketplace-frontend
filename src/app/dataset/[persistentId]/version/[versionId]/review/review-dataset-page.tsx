"use client";

import type { FormApi, SubmissionErrors } from "final-form";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/item-form/BackgroundImage";
import { Content } from "@/components/item-form/Content";
import { ItemFormScreenLayout } from "@/components/item-form/ItemFormScreenLayout";
import { ItemReviewForm } from "@/components/item-form/ItemReviewForm";
import { useCreateOrUpdateDataset } from "@/components/item-form/useCreateOrUpdateDataset";
import { useDatasetFormFields } from "@/components/item-form/useDatasetFormFields";
import { useDatasetValidationSchema } from "@/components/item-form/useDatasetValidationSchema";
import { useReviewItemMeta } from "@/components/item-form/useReviewItemMeta";
import { FORM_ERROR } from "@/lib/core/form/Form";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { createHref } from "@/lib/core/navigation/create-href";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import type { QueryMetadata } from "@/lib/core/query/types";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";
import {
  useDatasetDiff,
  useDatasetVersion,
  useRejectDatasetVersion,
} from "@/lib/data/sshoc/hooks/dataset";
import { isNotFoundError } from "@/lib/data/sshoc/utils/isNotFoundError";
import type { UpdateDatasetFormValues } from "@/app/dataset/[persistentId]/version/[versionId]/review/page";

interface ReviewDatasetPageProps {
  persistentId: string;
  versionId: number;
}

export default function ReviewDatasetPage(
  props: ReviewDatasetPageProps
): ReactNode {
  const { persistentId, versionId } = props;

  const { t } = useI18n<"authenticated" | "common">();
  const router = useRouter();

  const _dataset = useDatasetVersion({ persistentId, versionId }, undefined, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const dataset = _dataset.data;
  /** For newly suggested items there will be no diff available. */
  const ignoreMissingDiff: QueryMetadata = {
    messages: {
      error(error) {
        if (isNotFoundError(error)) return false;
        return undefined;
      },
    },
  };
  const _diff = useDatasetDiff(
    { persistentId, with: persistentId, otherVersionId: versionId },
    undefined,
    {
      meta: ignoreMissingDiff,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  const diff = _diff.data;
  const diffNotFound = isNotFoundError(_diff.error);

  const category = dataset?.category ?? "dataset";
  const label = t(["common", "item-categories", category, "one"]);
  const title = t(["authenticated", "forms", "edit-item"], {
    values: { item: label },
  });

  const formFields = useDatasetFormFields();
  const validate = useDatasetValidationSchema();
  const meta = useReviewItemMeta({ category });
  const createOrUpdateDataset = useCreateOrUpdateDataset(undefined, {
    meta: meta.approve,
  });
  const rejectDatasetVersion = useRejectDatasetVersion(
    { persistentId, versionId },
    undefined,
    {
      meta: meta.reject,
    }
  );

  function onSubmit(
    values: UpdateDatasetFormValues,
    form: FormApi<UpdateDatasetFormValues>,
    done?: (errors?: SubmissionErrors) => void
  ) {
    delete values["__submitting__"];

    const shouldSaveAsDraft = values["__draft__"] === true;
    delete values["__draft__"];

    createOrUpdateDataset.mutate(
      { data: values, draft: shouldSaveAsDraft },
      {
        onSuccess(dataset) {
          if (dataset.status === "draft") {
            // FIXME: Probably better to keep this state in useCreateOrUpdateDataset.
            form.batch(() => {
              form.change("persistentId", dataset.persistentId);
              form.change("status", dataset.status);
            });
            window.scrollTo(0, 0);
          } else if (dataset.status === "approved") {
            router.push(
              createHref(
                routes.DatasetPage({ persistentId: dataset.persistentId })
              )
            );
          } else {
            router.push(createHref(routes.SuccessPage()));
          }
          done?.();
        },
        onError(error) {
          done?.({ [FORM_ERROR]: String(error) });
        },
      }
    );
  }

  function onReject() {
    rejectDatasetVersion.mutate();
  }

  function onCancel() {
    router.push(createHref(routes.AccountPage()));
  }

  if (dataset == null || (diff == null && !diffNotFound)) {
    return (
      <PageMainContent>
        <FullPage>
          <Centered>
            <ProgressSpinner />
          </Centered>
        </FullPage>
      </PageMainContent>
    );
  }

  return (
    <PageMainContent>
      <ItemFormScreenLayout>
        <BackgroundImage />
        <ScreenHeader>
          <ScreenTitle>{title}</ScreenTitle>
        </ScreenHeader>
        <Content>
          <ItemReviewForm<UpdateDatasetFormValues>
            formFields={formFields}
            name="review-item"
            initialValues={dataset}
            diff={diff}
            onCancel={onCancel}
            onReject={onReject}
            onSubmit={onSubmit}
            validate={validate}
          />
        </Content>
        <FundingNotice />
      </ItemFormScreenLayout>
    </PageMainContent>
  );
}

function isPageAccessible(user) {
  return ["administrator", "moderator"].includes(user.role);
}
