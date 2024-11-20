"use client";

import type { FormApi, SubmissionErrors } from "final-form";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";

import type { UpdateDatasetFormValues } from "@/app/dataset/[persistentId]/edit/page";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/item-form/BackgroundImage";
import { Content } from "@/components/item-form/Content";
import { FormHelpText } from "@/components/item-form/FormHelpText";
import { ItemForm } from "@/components/item-form/ItemForm";
import { ItemFormScreenLayout } from "@/components/item-form/ItemFormScreenLayout";
import { useCreateOrUpdateDataset } from "@/components/item-form/useCreateOrUpdateDataset";
import { useDatasetFormFields } from "@/components/item-form/useDatasetFormFields";
import { useDatasetValidationSchema } from "@/components/item-form/useDatasetValidationSchema";
import { useUpdateItemMeta } from "@/components/item-form/useUpdateItemMeta";
import { FORM_ERROR } from "@/lib/core/form/Form";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { createHref } from "@/lib/core/navigation/create-href";
import { routes } from "@/lib/core/navigation/routes";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";
import { useDataset } from "@/lib/data/sshoc/hooks/dataset";

interface EditDatasetPageProps {
  persistentId: string;
}

export default function EditDatasetPage(
  props: EditDatasetPageProps
): ReactNode {
  const { persistentId } = props;

  const { t } = useI18n<"authenticated" | "common">();
  const router = useRouter();

  const _dataset = useDataset({ persistentId }, undefined, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const dataset = _dataset.data;

  const category = dataset?.category ?? "dataset";
  const label = t(["common", "item-categories", category, "one"]);
  const title = t(["authenticated", "forms", "edit-item"], {
    values: { item: label },
  });

  const formFields = useDatasetFormFields();
  const validate = useDatasetValidationSchema();
  const meta = useUpdateItemMeta({ category });
  const createOrUpdateDataset = useCreateOrUpdateDataset(undefined, { meta });

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

  function onCancel() {
    router.push(createHref(routes.AccountPage()));
  }

  if (dataset == null) {
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
          <ItemForm<UpdateDatasetFormValues>
            formFields={formFields}
            name="update-item"
            initialValues={dataset}
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
