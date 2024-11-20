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
import { useCreateOrUpdatePublication } from "@/components/item-form/useCreateOrUpdatePublication";
import { usePublicationFormFields } from "@/components/item-form/usePublicationFormFields";
import { usePublicationValidationSchema } from "@/components/item-form/usePublicationValidationSchema";
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
  usePublicationDiff,
  usePublicationVersion,
  useRejectPublicationVersion,
} from "@/lib/data/sshoc/hooks/publication";
import { isNotFoundError } from "@/lib/data/sshoc/utils/isNotFoundError";

interface ReviewPublicationPageProps {
  persistentId: string;
  versionId: number;
}

export default function ReviewPublicationPage(
  props: ReviewPublicationPageProps
): ReactNode {
  const { persistentId, versionId } = props;

  const { t } = useI18n<"authenticated" | "common">();
  const router = useRouter();

  const _publication = usePublicationVersion(
    { persistentId, versionId },
    undefined,
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  const publication = _publication.data;
  /** For newly suggested items there will be no diff available. */
  const ignoreMissingDiff: QueryMetadata = {
    messages: {
      error(error) {
        if (isNotFoundError(error)) return false;
        return undefined;
      },
    },
  };
  const _diff = usePublicationDiff(
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

  const category = publication?.category ?? "publication";
  const label = t(["common", "item-categories", category, "one"]);
  const title = t(["authenticated", "forms", "edit-item"], {
    values: { item: label },
  });

  const formFields = usePublicationFormFields();
  const validate = usePublicationValidationSchema();
  const meta = useReviewItemMeta({ category });
  const createOrUpdatePublication = useCreateOrUpdatePublication(undefined, {
    meta: meta.approve,
  });
  const rejectPublicationVersion = useRejectPublicationVersion(
    { persistentId, versionId },
    undefined,
    { meta: meta.reject }
  );

  function onSubmit(
    values: UpdatePublicationFormValues,
    form: FormApi<UpdatePublicationFormValues>,
    done?: (errors?: SubmissionErrors) => void
  ) {
    delete values["__submitting__"];

    const shouldSaveAsDraft = values["__draft__"] === true;
    delete values["__draft__"];

    createOrUpdatePublication.mutate(
      { data: values, draft: shouldSaveAsDraft },
      {
        onSuccess(publication) {
          if (publication.status === "draft") {
            // FIXME: Probably better to keep this state in useCreateOrUpdatePublication.
            form.batch(() => {
              form.change("persistentId", publication.persistentId);
              form.change("status", publication.status);
            });
            window.scrollTo(0, 0);
          } else if (publication.status === "approved") {
            router.push(
              createHref(
                routes.PublicationPage({
                  persistentId: publication.persistentId,
                })
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
    rejectPublicationVersion.mutate();
  }

  function onCancel() {
    router.push(createHref(routes.AccountPage()));
  }

  if (publication == null || (diff == null && !diffNotFound)) {
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
          <ItemReviewForm<UpdatePublicationFormValues>
            formFields={formFields}
            name="review-item"
            initialValues={publication}
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
