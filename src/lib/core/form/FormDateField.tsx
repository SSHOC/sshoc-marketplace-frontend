import { mergeProps } from "@react-aria/utils";
import { formatISO } from "date-fns";
import { useField } from "react-final-form";

import type { IsoDateString } from "@/lib/data/sshoc/lib/types";
import { useFormFieldValidationState } from "@/lib/core/form/useFormFieldValidationState";
import type { DateFieldProps } from "@/lib/core/ui/DateField/DateField";
import { DateField } from "@/lib/core/ui/DateField/DateField";

export interface FormDateFieldProps extends Omit<DateFieldProps, "value"> {
  name: string;
}

export function FormDateField(props: FormDateFieldProps): JSX.Element {
  const { input, meta } = useField(props.name, {
    format(value: IsoDateString | undefined) {
      if (value == null) return "";
      return formatISO(new Date(value), { representation: "date" });
    },
    parse(value: string) {
      if (value === "") return undefined;
      return new Date(value).toISOString();
    },
  });
  const validation = useFormFieldValidationState(meta);

  return (
    <DateField
      color="form"
      {...mergeProps(props, {
        onBlur: input.onBlur,
        onFocus: input.onFocus,
        onChange: input.onChange,
        value: input.value,
        ...validation,
      })}
    />
  );
}
