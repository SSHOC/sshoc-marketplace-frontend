"use client";

import type { FormApi, SubmissionErrors } from "final-form";
import { useRouter } from "next/navigation";

import type { UpdatePublicationFormValues } from "@/app/publication/[persistentId]/version/[versionId]/edit/page";
import { FundingNotice } from "@/components/common/FundingNotice";
import { ScreenHeader } from "@/components/common/ScreenHeader";
import { ScreenTitle } from "@/components/common/ScreenTitle";
import { BackgroundImage } from "@/components/item-form/BackgroundImage";
import { Content } from "@/components/item-form/Content";
import { ItemForm } from "@/components/item-form/ItemForm";
import { ItemFormScreenLayout } from "@/components/item-form/ItemFormScreenLayout";
import { useCreateOrUpdatePublication } from "@/components/item-form/useCreateOrUpdatePublication";
import { usePublicationFormFields } from "@/components/item-form/usePublicationFormFields";
import { usePublicationValidationSchema } from "@/components/item-form/usePublicationValidationSchema";
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
import {
  usePublication,
  usePublicationVersion,
} from "@/lib/data/sshoc/hooks/publication";

interface EditPublicationVersionPageProps {
  persistentId: string;
  versionId: number;
}

export default function EditPublicationVersionPage(
  props: EditPublicationVersionPageProps
): JSX.Element {
  const { persistentId, versionId } = props;

  const { t } = useI18n<"authenticated" | "common">();
  const router = useRouter();

  const searchParams = useSearchParams();
  const isDraftVersion =
    searchParams != null && searchParams.get("draft") != null;
  const _publication = !isDraftVersion
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      usePublicationVersion({ persistentId, versionId }, undefined, {
        enabled: true,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      })
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      usePublication({ persistentId, draft: true }, undefined, {
        enabled: true,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      });
  const publication = _publication.data;

  const category = publication?.category ?? "publication";
  const label = t(["common", "item-categories", category, "one"]);
  const title = t(["authenticated", "forms", "edit-item"], {
    values: { item: label },
  });

  const formFields = usePublicationFormFields();
  const validate = usePublicationValidationSchema();
  const meta = useUpdateItemMeta({ category });
  const createOrUpdatePublication = useCreateOrUpdatePublication(undefined, {
    meta,
  });

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

  function onCancel() {
    router.push(createHref(routes.AccountPage()));
  }

  if (publication == null) {
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
          <ItemForm<UpdatePublicationFormValues>
            formFields={formFields}
            name="update-item-version"
            initialValues={publication}
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
