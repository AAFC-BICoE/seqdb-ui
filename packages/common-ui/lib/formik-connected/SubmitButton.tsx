import { connect, FormikContextType } from "formik";
import { LoadingSpinner } from "..";
import { CommonMessage } from "../intl/common-ui-intl";

interface SubmitButtonProps {
  children?: React.ReactNode;
  className?: string;

  /** Override internal button props using the formik context. */
  buttonProps?: (
    ctx: FormikContextType<any>
  ) => React.HTMLProps<HTMLButtonElement>;
}

/**
 * Formik-connected submit button that shows a loading indicator instead when the form is submitting.
 */
export const SubmitButton = connect<SubmitButtonProps>(
  function SubmitButtonInternal({ buttonProps, children, className, formik }) {
    return formik.isSubmitting ? (
      <LoadingSpinner loading={formik.isSubmitting} />
    ) : (
      <button
        {...buttonProps?.(formik)}
        className={className ? className : "btn btn-primary"}
        type="submit"
      >
        {children || <CommonMessage id="submitBtnText" />}
      </button>
    );
  }
);
