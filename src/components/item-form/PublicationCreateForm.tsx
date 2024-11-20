import type { FormApi, SubmissionErrors } from "final-form";
import { FORM_ERROR } from "final-form";
import { useRouter } from "next/navigation";

import type { ItemFormValues } from "@/components/item-form/ItemForm";
import { ItemForm } from "@/components/item-form/ItemForm";
import { removeEmptyItemFieldsOnSubmit } from "@/components/item-form/removeEmptyItemFieldsOnSubmit";
import { useCreateItemMeta } from "@/components/item-form/useCreateItemMeta";
import { useCreateOrUpdatePublication } from "@/components/item-form/useCreateOrUpdatePublication";
import { usePublicationFormFields } from "@/components/item-form/usePublicationFormFields";
import { usePublicationFormRecommendedFields } from "@/components/item-form/usePublicationFormRecommendedFields";
import { usePublicationValidationSchema } from "@/components/item-form/usePublicationValidationSchema";
import type { PublicationInput } from "@/lib/data/sshoc/api/publication";
import { getApiErrorMessage } from "@/lib/data/sshoc/utils/get-api-error-message";
import { routes } from "@/lib/core/navigation/routes";
import { createHref } from "@/lib/core/navigation/create-href";

export type CreatePublicationFormValues = ItemFormValues<PublicationInput>;

export function PublicationCreateForm(): JSX.Element {
  const category = "publication";

  const router = useRouter();
  const formFields = usePublicationFormFields();
  const recommendedFields = usePublicationFormRecommendedFields();
  const validate = usePublicationValidationSchema(
    removeEmptyItemFieldsOnSubmit
  );
  const meta = useCreateItemMeta({ category });
  const createOrUpdatePublication = useCreateOrUpdatePublication(undefined, {
    meta,
  });

  function onSubmit(
    values: CreatePublicationFormValues,
    form: FormApi<CreatePublicationFormValues>,
    done?: (errors?: SubmissionErrors) => void
  ) {
    const shouldSaveAsDraft = values["__draft__"] === true;
    delete values["__draft__"];

    const data = removeEmptyItemFieldsOnSubmit(values);
    delete values["__submitting__"];

    form.pauseValidation();
    createOrUpdatePublication.mutate(
      { data, draft: shouldSaveAsDraft },
      {
        onSuccess(publication) {
          if (publication.status === "draft") {
            form.batch(() => {
              form.change("persistentId", publication.persistentId);
              form.change("status", publication.status);
            });
            window.scrollTo(0, 0);
            form.resumeValidation();
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
          form.resumeValidation();
          getApiErrorMessage(error).then((message) => {
            done?.({ [FORM_ERROR]: message });
          });
        },
      }
    );
  }

  function onCancel() {
    router.push(createHref(routes.AccountPage()));
  }

  return (
    <ItemForm<CreatePublicationFormValues>
      formFields={formFields}
      name="create-item"
      initialValues={recommendedFields}
      onCancel={onCancel}
      onSubmit={onSubmit}
      validate={validate}
    />
  );
}
