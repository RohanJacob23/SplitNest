import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { Button } from '../../ui/button'
import { useFormContext } from '@/hooks/form-context'
import { swift } from '@/lib/easing'
import { CustomLoaderIcon } from '@/icons/loader'
import { cn } from '@/lib/utils'

export default function SubmitButton({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  const form = useFormContext()

  return (
    <MotionConfig transition={swift}>
      <form.Subscribe
        selector={(state) => [state.isSubmitting, state.isValid]}
        children={([isSubmitting, isValid]) => (
          <Button
            type="submit"
            animate={{ x: !isValid ? [null, -5, 0, 5, 0] : undefined }}
            transition={{ x: { duration: 0.2 } }}
            disabled={isSubmitting}
            className={cn('overflow-y-clip', className)}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {isSubmitting ? (
                <motion.span
                  key="loader"
                  initial={{ opacity: 0, y: -25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 25 }}
                  className="block"
                >
                  <CustomLoaderIcon className="animate-spin duration-700" />
                </motion.span>
              ) : (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, y: -25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 25 }}
                  className="block"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        )}
      />
    </MotionConfig>
  )
}
