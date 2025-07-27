import { createFormHook } from "@tanstack/react-form";
import SubmitButton from "@/components/form/fields/submit-button";
import TextField from "@/components/form/fields/text-field";
import { fieldContext, formContext } from "./form-context";

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: { TextField },
	formComponents: { SubmitButton },
});
