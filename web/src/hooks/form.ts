import { createFormHook } from '@tanstack/react-form'
import { fieldContext, formContext } from './form-context'
import TextField from '@/components/form/fields/text-field'
import SubmitButton from '@/components/form/fields/submit-button'

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField },
  formComponents: { SubmitButton },
})
