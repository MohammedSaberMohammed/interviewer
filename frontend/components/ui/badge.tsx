import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium tracking-wide whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        /* Solid primary (cyan in dark mode) */
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20",
        outline:
          "border-border text-foreground",
        ghost:
          "border-transparent hover:bg-muted hover:text-muted-foreground",
        link:
          "border-transparent text-primary underline-offset-4 hover:underline",
        /* Cyan — quest / current focus */
        cyan:
          "border-[oklch(0.72_0.18_195/0.3)] bg-[oklch(0.72_0.18_195/0.1)] text-[oklch(0.82_0.18_195)]",
        /* Magenta — senior / advanced */
        magenta:
          "border-[oklch(0.68_0.25_320/0.3)] bg-[oklch(0.68_0.25_320/0.1)] text-[oklch(0.85_0.20_320)]",
        /* Amber — streak / achievement / warning */
        amber:
          "border-[oklch(0.78_0.18_85/0.3)] bg-[oklch(0.78_0.18_85/0.1)] text-[oklch(0.88_0.18_85)]",
        /* Success — completed / correct */
        success:
          "border-[oklch(0.72_0.20_145/0.3)] bg-[oklch(0.72_0.20_145/0.1)] text-[oklch(0.8_0.20_145)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
