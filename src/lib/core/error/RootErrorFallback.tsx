import { useError } from "@stefanprobst/next-error-boundary";
import { HttpError } from "@stefanprobst/request";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { SignInForm } from "@/components/auth/SignInForm";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { AuthorizationError } from "@/lib/core/error/AuthorizationError";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";

export function RootErrorFallback(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const { error, onReset } = useError();
  const { t } = useI18n<"common">();

  useEffect(() => {
    onReset();
  }, [pathname]);

  if (error instanceof HttpError && error.response.status === 401) {
    return <SignInForm />;
  }

  if (
    error instanceof AuthorizationError ||
    (error instanceof HttpError && error.response.status === 403)
  ) {
    return (
      <FullPage>
        <ErrorMessage
          statusCode={
            error instanceof HttpError ? error.response.status : undefined
          }
          message={t(["common", "default-authorization-error-message"])}
        />
      </FullPage>
    );
  }

  return (
    <FullPage>
      <ErrorMessage
        statusCode={
          error instanceof HttpError ? error.response.status : undefined
        }
        message={error.message}
        onReset={onReset}
      />
    </FullPage>
  );
}
