import { Fragment } from "react";

import { SuggestConceptButton } from "@/components/common/SuggestConceptButton";
import type { ItemFormFields } from "@/components/item-form/useItemFormFields";
import type { PropertyType } from "@/lib/data/sshoc/api/property";
import { useFieldState } from "@/lib/core/form/useFieldState";

export interface CreateConceptButtonProps {
  fieldGroup: ItemFormFields["fields"]["properties"]["fields"];
  propertyTypesMap: Map<PropertyType["code"], PropertyType>;
}

export function CreateConceptButton(
  props: CreateConceptButtonProps
): JSX.Element {
  const { fieldGroup, propertyTypesMap } = props;

  const selectedPropertyTypeId = useFieldState<
    PropertyType["code"] | undefined
  >(fieldGroup.type.name).input.value;
  const selectedPropertyType =
    selectedPropertyTypeId != null
      ? propertyTypesMap.get(selectedPropertyTypeId)
      : null;

  if (
    selectedPropertyType == null ||
    selectedPropertyType.allowedVocabularies.every((vocabulary) => {
      return vocabulary.closed;
    })
  ) {
    return <Fragment />;
  }

  return (
    <SuggestConceptButton
      propertyType={selectedPropertyType}
      variant="button-link"
    />
  );
}
