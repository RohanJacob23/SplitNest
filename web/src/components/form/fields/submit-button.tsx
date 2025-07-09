import { useFormContext } from '@/hooks/form-context'
import { Button } from '../../ui/button'
import { Loader } from 'lucide-react'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { swift } from '@/lib/easing'

export default function SubmitButton({ label }: { label: string }) {
  const form = useFormContext()

  return (
    <MotionConfig transition={swift}>
      <form.Subscribe
        selector={(state) => state.isSubmitting}
        children={(isSubmitting) => (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="overflow-y-clip"
          >
            <AnimatePresence initial={false} mode="popLayout">
              {isSubmitting ? (
                <motion.span
                  key="loader"
                  initial={{ opacity: 0, y: -25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 25 }}
                >
                  <Loader className="animate-spin" />
                </motion.span>
              ) : (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, y: -25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 25 }}
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
