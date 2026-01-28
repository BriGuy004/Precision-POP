import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-green-500 group-[.toaster]:text-white group-[.toaster]:border-green-400 group-[.toaster]:shadow-2xl group-[.toaster]:text-xl group-[.toaster]:font-bold group-[.toaster]:py-6 group-[.toaster]:px-8 group-[.toaster]:rounded-2xl",
          description: "group-[.toast]:text-white/90 group-[.toast]:text-lg group-[.toast]:font-medium",
          actionButton:
            "group-[.toast]:bg-white group-[.toast]:text-green-600 group-[.toast]:font-bold",
          cancelButton:
            "group-[.toast]:bg-white/20 group-[.toast]:text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
