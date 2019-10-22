import { connect } from "formik";
import { LoadingSpinner } from "..";

/**
 * Formik-connected submit button that shows a loading indicator instead when the form is submitting.
 */
export const SubmitButton = connect(function SubmitButtonInternal({
  children,
  formik: { isSubmitting }
}) {
  return isSubmitting ? (
    <LoadingSpinner loading={isSubmitting} />
  ) : (
    <button className="btn btn-primary" type="submit">
      {children || "Save"}
    </button>
  );
});