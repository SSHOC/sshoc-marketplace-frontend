import type { FormApi, SubmissionErrors } from "final-form";
import { useRouter } from "next/navigation";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/item-form/BackgroundImage";
import { Content } from "@/components/item-form/Content";
import { ItemFormScreenLayout } from "@/components/item-form/ItemFormScreenLayout";
import { ItemReviewForm } from "@/components/item-form/ItemReviewForm";
import { useCreateOrUpdateTrainingMaterial } from "@/components/item-form/useCreateOrUpdateTrainingMaterial";
import { useReviewItemMeta } from "@/components/item-form/useReviewItemMeta";
import { useTrainingMaterialFormFields } from "@/components/item-form/useTrainingMaterialFormFields";
import { useTrainingMaterialValidationSchema } from "@/components/item-form/useTrainingMaterialValidationSchema";
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
  useRejectTrainingMaterialVersion,
  useTrainingMaterialDiff,
  useTrainingMaterialVersion,
} from "@/lib/data/sshoc/hooks/training-material";
import { isNotFoundError } from "@/lib/data/sshoc/utils/isNotFoundError";
import type { ReactNode } from "react";
import type { UpdateTrainingMaterialFormValues } from "@/app/training-material/[persistentId]/version/[versionId]/review/page";

interface ReviewTrainingMaterialPageProps {
  persistentId: string;
  versionId: number;
}

export default function ReviewTrainingMaterialPage(
  props: ReviewTrainingMaterialPageProps
): ReactNode {
  const { persistentId, versionId } = props;

  const { t } = useI18n<"authenticated" | "common">();
  const router = useRouter();

  const _trainingMaterial = useTrainingMaterialVersion(
    { persistentId, versionId },
    undefined,
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  const trainingMaterial = _trainingMaterial.data;
  /** For newly suggested items there will be no diff available. */
  const ignoreMissingDiff: QueryMetadata = {
    messages: {
      error(error) {
        if (isNotFoundError(error)) return false;
        return undefined;
      },
    },
  };
  const _diff = useTrainingMaterialDiff(
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

  const category = trainingMaterial?.category ?? "training-material";
  const label = t(["common", "item-categories", category, "one"]);
  const title = t(["authenticated", "forms", "edit-item"], {
    values: { item: label },
  });

  const formFields = useTrainingMaterialFormFields();
  const validate = useTrainingMaterialValidationSchema();
  const meta = useReviewItemMeta({ category });
  const createOrUpdateTrainingMaterial = useCreateOrUpdateTrainingMaterial(
    undefined,
    {
      meta: meta.approve,
    }
  );
  const rejectTrainingMaterialVersion = useRejectTrainingMaterialVersion(
    { persistentId, versionId },
    undefined,
    { meta: meta.reject }
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

  function onReject() {
    rejectTrainingMaterialVersion.mutate();
  }

  function onCancel() {
    router.push(createHref(routes.AccountPage()));
  }

  if (trainingMaterial == null || (diff == null && !diffNotFound)) {
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
          <ItemReviewForm<UpdateTrainingMaterialFormValues>
            formFields={formFields}
            name="review-item"
            initialValues={trainingMaterial}
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
