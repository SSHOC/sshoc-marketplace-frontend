"use client";

import type { FormApi, SubmissionErrors } from "final-form";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";

import type { UpdateWorkflowFormValues } from "@/app/workflow/[persistentId]/edit/page";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/item-form/BackgroundImage";
import { Content } from "@/components/item-form/Content";
import { FormHelpText } from "@/components/item-form/FormHelpText";
import { ItemFormScreenLayout } from "@/components/item-form/ItemFormScreenLayout";
import { useCreateOrUpdateWorkflow } from "@/components/item-form/useCreateOrUpdateWorkflow";
import { useUpdateItemMeta } from "@/components/item-form/useUpdateItemMeta";
import { useWorkflowFormFields } from "@/components/item-form/useWorkflowFormFields";
import { useWorkflowFormPage } from "@/components/item-form/useWorkflowFormPage";
import { useWorkflowWithStepsValidationSchema } from "@/components/item-form/useWorkflowValidationSchema";
import { WorkflowForm } from "@/components/item-form/WorkflowForm";
import { FORM_ERROR } from "@/lib/core/form/Form";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { createHref } from "@/lib/core/navigation/create-href";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";
import { useWorkflow } from "@/lib/data/sshoc/hooks/workflow";

interface EditWorkflowPageProps {
  persistentId: string;
}

export default function EditWorkflowPage(
  props: EditWorkflowPageProps
): ReactNode {
  const { persistentId } = props;

  const { t } = useI18n<"authenticated" | "common">();
  const router = useRouter();

  const _workflow = useWorkflow({ persistentId }, undefined, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const workflow = _workflow.data;

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
  const meta = useUpdateItemMeta({ category });
  const createOrUpdateWorkflow = useCreateOrUpdateWorkflow(undefined, { meta });

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

  function onCancel() {
    router.push(createHref(routes.AccountPage()));
  }

  if (workflow == null) {
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
          <FormHelpText />
          <WorkflowForm<UpdateWorkflowFormValues>
            formFields={formFields}
            initialValues={workflow}
            name="update-workflow"
            onCancel={onCancel}
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
  return ["administrator", "moderator", "contributor"].includes(user.role);
}
