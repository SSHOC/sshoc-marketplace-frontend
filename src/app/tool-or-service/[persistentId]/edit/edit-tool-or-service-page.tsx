"use client";

import type { FormApi, SubmissionErrors } from "final-form";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";

import type { UpdateToolOrServiceFormValues } from "@/app/tool-or-service/[persistentId]/edit/page";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/item-form/BackgroundImage";
import { Content } from "@/components/item-form/Content";
import { FormHelpText } from "@/components/item-form/FormHelpText";
import { ItemForm } from "@/components/item-form/ItemForm";
import { ItemFormScreenLayout } from "@/components/item-form/ItemFormScreenLayout";
import { useCreateOrUpdateTool } from "@/components/item-form/useCreateOrUpdateTool";
import { useToolFormFields } from "@/components/item-form/useToolFormFields";
import { useToolValidationSchema } from "@/components/item-form/useToolValidationSchema";
import { useUpdateItemMeta } from "@/components/item-form/useUpdateItemMeta";
import { FORM_ERROR } from "@/lib/core/form/Form";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { createHref } from "@/lib/core/navigation/create-href";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";
import { useTool } from "@/lib/data/sshoc/hooks/tool-or-service";

interface EditToolOrServicePageProps {
  persistentId: string;
}

export default function EditToolOrServicePage(
  props: EditToolOrServicePageProps
): ReactNode {
  const { persistentId } = props;

  const { t } = useI18n<"authenticated" | "common">();
  const router = useRouter();

  const _tool = useTool({ persistentId }, undefined, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const tool = _tool.data;

  const category = tool?.category ?? "tool-or-service";
  const label = t(["common", "item-categories", category, "one"]);
  const title = t(["authenticated", "forms", "edit-item"], {
    values: { item: label },
  });

  const formFields = useToolFormFields();
  const validate = useToolValidationSchema();
  const meta = useUpdateItemMeta({ category });
  const createOrUpdateToolOrService = useCreateOrUpdateTool(undefined, {
    meta,
  });

  function onSubmit(
    values: UpdateToolOrServiceFormValues,
    form: FormApi<UpdateToolOrServiceFormValues>,
    done?: (errors?: SubmissionErrors) => void
  ) {
    delete values["__submitting__"];

    const shouldSaveAsDraft = values["__draft__"] === true;
    delete values["__draft__"];

    createOrUpdateToolOrService.mutate(
      { data: values, draft: shouldSaveAsDraft },
      {
        onSuccess(tool) {
          if (tool.status === "draft") {
            // FIXME: Probably better to keep this state in useCreateOrUpdateToolOrService.
            form.batch(() => {
              form.change("persistentId", tool.persistentId);
              form.change("status", tool.status);
            });
            window.scrollTo(0, 0);
          } else if (tool.status === "approved") {
            router.push(
              createHref(
                routes.ToolOrServicePage({ persistentId: tool.persistentId })
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

  if (tool == null) {
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
          <ItemForm<UpdateToolOrServiceFormValues>
            formFields={formFields}
            name="update-item"
            initialValues={tool}
            onCancel={onCancel}
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
  return ["administrator", "moderator", "contributor"].includes(user.role);
}
