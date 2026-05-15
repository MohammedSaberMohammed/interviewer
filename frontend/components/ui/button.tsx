import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /* Cyan gradient glow — primary CTA */
        default:
          "bg-gradient-to-br from-[oklch(0.72_0.18_195)] to-[oklch(0.65_0.20_200)] text-[oklch(0.095_0.025_270)] shadow-[0_0_40px_rgba(34,211,238,.4),0_0_16px_rgba(34,211,238,.2)] hover:shadow-[0_0_70px_rgba(34,211,238,.6),0_0_28px_rgba(34,211,238,.35)] hover:-translate-y-0.5 active:translate-y-0",
        /* Subtle border + glass — secondary actions */
        outline:
          "border-border bg-background/60 backdrop-blur-sm hover:bg-muted/60 hover:border-primary/40 hover:text-foreground dark:bg-card/40 dark:hover:bg-muted/40 dark:hover:border-brand-cyan/30",
        /* Filled muted surface */
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        /* Truly invisible — for nav / icon-only */
        ghost:
          "hover:bg-muted hover:text-foreground dark:hover:bg-muted/40",
        /* Magenta glow — quest / gamification actions */
        magenta:
          "bg-gradient-to-br from-[oklch(0.68_0.25_320)] to-[oklch(0.60_0.22_320)] text-[oklch(0.97_0.01_270)] shadow-[0_0_40px_rgba(217,70,239,.4),0_0_16px_rgba(217,70,239,.2)] hover:shadow-[0_0_70px_rgba(217,70,239,.6),0_0_28px_rgba(217,70,239,.35)] hover:-translate-y-0.5 active:translate-y-0",
        /* Ghost with visible border + hover glow */
        "ghost-glow":
          "border border-border/80 bg-card/40 backdrop-blur-sm text-foreground hover:border-brand-cyan/40 hover:text-primary dark:bg-card/30",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 gap-2 px-4",
        xs: "h-6 gap-1 rounded-lg px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1.5 rounded-lg px-3 text-[0.8rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2.5 px-6 text-base rounded-xl",
        xl: "h-13 gap-3 px-8 text-base rounded-xl",
        icon: "size-9",
        "icon-xs": "size-6 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-lg",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
