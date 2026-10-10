import { Toaster as Sonner, type ToasterProps } from 'sonner'

/** Тосты оформлены под тему приложения (светлая/тёмная через .dark на <html>). */
const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme="system"
    className="toaster group"
    position="top-right"
    richColors
    toastOptions={{
      classNames: {
        toast: 'group toast group-[.toaster]:rounded-xl group-[.toaster]:shadow-lg',
      },
    }}
    {...props}
  />
)

export { Toaster }
