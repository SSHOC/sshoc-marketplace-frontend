"use client";

import type { FormApi, SubmissionErrors } from "final-form";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/item-form/BackgroundImage";
import { Content } from "@/components/item-form/Content";
import { ItemForm } from "@/components/item-form/ItemForm";
import { ItemFormScreenLayout } from "@/components/item-form/ItemFormScreenLayout";
import { useCreateOrUpdateTrainingMaterial } from "@/components/item-form/useCreateOrUpdateTrainingMaterial";
import { useTrainingMaterialFormFields } from "@/components/item-form/useTrainingMaterialFormFields";
import { useTrainingMaterialValidationSchema } from "@/components/item-form/useTrainingMaterialValidationSchema";
import { useUpdateItemMeta } from "@/components/item-form/useUpdateItemMeta";
import { FORM_ERROR } from "@/lib/core/form/Form";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { createHref } from "@/lib/core/navigation/create-href";
import { routes } from "@/lib/core/navigation/routes";
import { useSearchParams } from "@/lib/core/navigation/useSearchParams";
import { PageMainContent } from "@/lib/core/page/PageMainContent";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";

import type { UpdateTrainingMaterialFormValues } from "@/app/training-material/[persistentId]/version/[versionId]/edit/page";
import {
  useTrainingMaterial,
  useTrainingMaterialVersion,
} from "@/lib/data/sshoc/hooks/training-material";

interface EditTrainingMaterialVersionPageProps {
  persistentId: string;
  versionId: number;
}

export default function EditTrainingMaterialVersionPage(
  props: EditTrainingMaterialVersionPageProps
): ReactNode {
  const { persistentId, versionId } = props;

  const { t } = useI18n<"authenticated" | "common">();
  const router = useRouter();

  const searchParams = useSearchParams();
  const isDraftVersion =
    searchParams != null && searchParams.get("draft") != null;
  const _trainingMaterial = !isDraftVersion
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useTrainingMaterialVersion({ persistentId, versionId }, undefined, {
        enabled: true,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      })
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useTrainingMaterial({ persistentId, draft: true }, undefined, {
        enabled: true,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      });
  const trainingMaterial = _trainingMaterial.data;

  const category = trainingMaterial?.category ?? "training-material";
  const label = t(["common", "item-categories", category, "one"]);
  const title = t(["authenticated", "forms", "edit-item"], {
    values: { item: label },
  });

  const formFields = useTrainingMaterialFormFields();
  const validate = useTrainingMaterialValidationSchema();
  const meta = useUpdateItemMeta({ category });
  const createOrUpdateTrainingMaterial = useCreateOrUpdateTrainingMaterial(
    undefined,
    { meta }
  );

  function onSubmit(
    values: UpdateTrainingMaterialFormValues,
    form: FormApi<UpdateTrainingMaterialFormValues>,
    done?: (errors?: SubmissionErrors) => void
  ) {
    delete values["__submitting__"];

    const shouldSaveAsDraft = values["__draft__"] === true;
    delete values["__draft__"];

    createOrUpdateTrainingMaterial.mutate(
      { data: values, draft: shouldSaveAsDraft },
      {
        onSuccess(trainingMaterial) {
          if (trainingMaterial.status === "draft") {
            // FIXME: Probably better to keep this state in useCreateOrUpdateTrainingMaterial.
            form.batch(() => {
              form.change("persistentId", trainingMaterial.persistentId);
              form.change("status", trainingMaterial.status);
            });
            window.scrollTo(0, 0);
          } else if (trainingMaterial.status === "approved") {
            router.push(
              createHref(
                routes.TrainingMaterialPage({
                  persistentId: trainingMaterial.persistentId,
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

  function onCancel() {
    router.push(createHref(routes.AccountPage()));
  }

  if (trainingMaterial == null) {
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
          <ItemForm<UpdateTrainingMaterialFormValues>
            formFields={formFields}
            name="update-item-version"
            initialValues={trainingMaterial}
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
