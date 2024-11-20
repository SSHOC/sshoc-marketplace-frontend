"use client";

import type { FormApi, SubmissionErrors } from "final-form";
import { useRouter } from "next/navigation";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/item-form/BackgroundImage";
import { Content } from "@/components/item-form/Content";
import { ItemFormScreenLayout } from "@/components/item-form/ItemFormScreenLayout";
import { useCreateOrUpdateWorkflow } from "@/components/item-form/useCreateOrUpdateWorkflow";
import { useReviewItemMeta } from "@/components/item-form/useReviewItemMeta";
import { useWorkflowFormFields } from "@/components/item-form/useWorkflowFormFields";
import { useWorkflowFormPage } from "@/components/item-form/useWorkflowFormPage";
import { useWorkflowWithStepsValidationSchema } from "@/components/item-form/useWorkflowValidationSchema";
import { WorkflowReviewForm } from "@/components/item-form/WorkflowReviewForm";
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
  useRejectWorkflowVersion,
  useWorkflowDiff,
  useWorkflowVersion,
} from "@/lib/data/sshoc/hooks/workflow";
import { isNotFoundError } from "@/lib/data/sshoc/utils/isNotFoundError";
import type { ReactNode } from "react";
import type { UpdateWorkflowFormValues } from "@/app/workflow/[persistentId]/version/[versionId]/review/page";

interface ReviewWorkflowPageProps {
  persistentId: string;
  versionId: number;
}

export default function ReviewWorkflowPage(
  props: ReviewWorkflowPageProps
): ReactNode {
  const { persistentId, versionId } = props;

  const { t } = useI18n<"authenticated" | "common">();
  const router = useRouter();

  const _workflow = useWorkflowVersion({ persistentId, versionId }, undefined, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const workflow = _workflow.data;
  /** For newly suggested items there will be no diff available. */
  const ignoreMissingDiff: QueryMetadata = {
    messages: {
      error(error) {
        if (isNotFoundError(error)) return false;
        return undefined;
      },
    },
  };
  const _diff = useWorkflowDiff(
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

  const { page, setPage } = useWorkflowFormPage();

  const category = workflow?.category ?? "workflow";
  const label = t(["common", "item-categories", category, "one"]);
  const title = t(["authenticated", "forms", "edit-item"], {
    values: {
      item:
        page.type === "workflow"
          ? label
          : page.type === "steps"
          ? t(["common", "item-categories", "step", "other"])
          : t(["common", "item-categories", "step", "one"]),
    },
  });

  const formFields = useWorkflowFormFields();
  const validate = useWorkflowWithStepsValidationSchema();
  const meta = useReviewItemMeta({ category });
  const createOrUpdateWorkflow = useCreateOrUpdateWorkflow(undefined, {
    meta: meta.approve,
  });
  const rejectWorkflowVersion = useRejectWorkflowVersion(
    { persistentId, versionId },
    undefined,
    {
      meta: meta.reject,
    }
  );

  function onSubmit(
    values: UpdateWorkflowFormValues,
    form: FormApi<UpdateWorkflowFormValues>,
    done?: (errors?: SubmissionErrors) => void
  ) {
    delete values["__submitting__"];

    const shouldSaveAsDraft = values["__draft__"] === true;
    delete values["__draft__"];

    createOrUpdateWorkflow.mutate(
      { data: values, draft: shouldSaveAsDraft },
      {
        onSuccess(workflow) {
          if (workflow.status === "draft") {
            // FIXME: Probably better to keep this state in useCreateOrUpdateWorkflow.
            form.batch(() => {
              form.change("persistentId", workflow.persistentId);
              form.change("status", workflow.status);
            });
            window.scrollTo(0, 0);
          } else if (workflow.status === "approved") {
            router.push(
              createHref(
                routes.WorkflowPage({ persistentId: workflow.persistentId })
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
    rejectWorkflowVersion.mutate();
  }

  function onCancel() {
    router.push(createHref(routes.AccountPage()));
  }

  if (workflow == null || (diff == null && !diffNotFound)) {
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
          <WorkflowReviewForm<UpdateWorkflowFormValues>
            formFields={formFields}
            name="review-item"
            initialValues={workflow}
            diff={diff}
            onCancel={onCancel}
            onReject={onReject}
            onSubmit={onSubmit}
            validate={validate}
            page={page}
            setPage={setPage}
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
