import type { FormApi, SubmissionErrors } from "final-form";
import { useRouter } from "next/navigation";

import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/item-form/BackgroundImage";
import { Content } from "@/components/item-form/Content";
import { ItemFormScreenLayout } from "@/components/item-form/ItemFormScreenLayout";
import { ItemReviewForm } from "@/components/item-form/ItemReviewForm";
import { useCreateOrUpdateTool } from "@/components/item-form/useCreateOrUpdateTool";
import { useReviewItemMeta } from "@/components/item-form/useReviewItemMeta";
import { useToolFormFields } from "@/components/item-form/useToolFormFields";
import { useToolValidationSchema } from "@/components/item-form/useToolValidationSchema";
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
  useRejectToolVersion,
  useToolDiff,
  useToolVersion,
} from "@/lib/data/sshoc/hooks/tool-or-service";
import { isNotFoundError } from "@/lib/data/sshoc/utils/isNotFoundError";
import type { ReactNode } from "react";
import type { UpdateToolOrServiceFormValues } from "@/app/tool-or-service/[persistentId]/version/[versionId]/review/page";

interface ReviewToolOrServicePageProps {
  persistentId: string;
  versionId: number;
}

export default function ReviewToolOrServicePage(
  props: ReviewToolOrServicePageProps
): ReactNode {
  const { persistentId, versionId } = props;

  const { t } = useI18n<"authenticated" | "common">();
  const router = useRouter();

  const _tool = useToolVersion({ persistentId, versionId }, undefined, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const tool = _tool.data;
  /** For newly suggested items there will be no diff available. */
  const ignoreMissingDiff: QueryMetadata = {
    messages: {
      error(error) {
        if (isNotFoundError(error)) return false;
        return undefined;
      },
    },
  };
  const _diff = useToolDiff(
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

  const category = tool?.category ?? "tool-or-service";
  const label = t(["common", "item-categories", category, "one"]);
  const title = t(["authenticated", "forms", "edit-item"], {
    values: { item: label },
  });

  const formFields = useToolFormFields();
  const validate = useToolValidationSchema();
  const meta = useReviewItemMeta({ category });
  const createOrUpdateToolOrService = useCreateOrUpdateTool(undefined, {
    meta: meta.approve,
  });
  const rejectToolOrServiceVersion = useRejectToolVersion(
    { persistentId, versionId },
    undefined,
    {
      meta: meta.reject,
    }
  );

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

  function onReject() {
    rejectToolOrServiceVersion.mutate();
  }

  function onCancel() {
    router.push(createHref(routes.AccountPage()));
  }

  if (tool == null || (diff == null && !diffNotFound)) {
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
          <ItemReviewForm<UpdateToolOrServiceFormValues>
            formFields={formFields}
            name="review-item"
            initialValues={tool}
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
