import { useFieldContext } from '@/hooks/form-context.ts'
import { Input } from '../../ui/input.tsx'
import { Label } from '../../ui/label.tsx'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils.ts'

export default function TextField({
  label,
  className,
  ...props
}: { label: string } & ComponentProps<typeof Input>) {
  // The `Field` infers that it should have a `value` type of `string`
  const field = useFieldContext<string>()

  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={label}>{label}</Label>
      <Input
        id={label}
        value={field.state.value}
        aria-invalid={!field.state.meta.isValid}
        onChange={(e) => field.handleChange(e.target.value)}
        className={cn('peer', className)}
        {...props}
      />
      {!field.state.meta.isValid &&
        field.state.meta.errors.map((error, i) => (
          <span
            key={i}
            className="peer-aria-invalid:text-destructive mt-2 text-xs"
          >
            {error.message}
          </span>
        ))}
    </div>
  )
}
