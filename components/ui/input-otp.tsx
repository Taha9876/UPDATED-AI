"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import Dot from "lucide-react"

import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, React.ComponentPropsWithoutRef<typeof OTPInput>>(
  ({ className, containerClassName, ...props }, ref) => (
    <OTPInput
      ref={ref}
      containerClassName={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  ),
)
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center", className)} {...props} />,
)
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPCell = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => {
    const inputOTPContext = React.useContext(OTPInputContext)
    const { char, hasFocused } = inputOTPContext.slots[props.index]

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center border border-input text-sm shadow-sm transition-all",
          inputOTPContext.is ? "rounded-md" : "rounded-md first:rounded-l-md last:rounded-r-md",
          hasFocused && "z-10 ring-1 ring-ring",
          className,
        )}
        {...props}
      >
        {char}
        {hasFocused && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
          </span>
        )}
      </div>
    )
  },
)
InputOTPCell.displayName = "InputOTPCell"

const InputOTPSeparator = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-center", className)} {...props}>
      <Dot />
    </div>
  ),
)
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPCell, InputOTPSeparator }
