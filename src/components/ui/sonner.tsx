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
            "group toast group-[.toaster]:bg-black/80 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:text-lg group-[.toaster]:font-semibold group-[.toaster]:py-4 group-[.toaster]:px-6 group-[.toaster]:rounded-full",
          description: "group-[.toast]:text-white/70 group-[.toast]:text-sm group-[.toast]:font-medium",
          actionButton:
            "group-[.toast]:bg-white group-[.toast]:text-black group-[.toast]:font-bold",
          cancelButton:
            "group-[.toast]:bg-white/20 group-[.toast]:text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
