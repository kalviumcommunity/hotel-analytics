import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  open: boolean;
  title: string;
  description?: string;
  variant?: "default" | "success" | "destructive";
  onOpenChange: (open: boolean) => void;
}

export function Toast({ open, title, description, variant = "default", onOpenChange }: ToastProps) {
  return (
    <ToastPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      className={cn(
        "grid grid-cols-[auto_1fr] items-start gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-lg",
        variant === "success" && "border-emerald-500/20 bg-emerald-500/10",
        variant === "destructive" && "border-destructive/20 bg-destructive/10"
      )}
    >
      <div className="pt-0.5">
        {variant === "success" ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        ) : variant === "destructive" ? (
          <AlertCircle className="h-5 w-5 text-destructive" />
        ) : null}
      </div>
      <div>
        <ToastPrimitive.Title className="font-medium">{title}</ToastPrimitive.Title>
        {description ? <ToastPrimitive.Description className="mt-1 text-sm text-muted-foreground">{description}</ToastPrimitive.Description> : null}
      </div>
    </ToastPrimitive.Root>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {children}
      <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[60] flex w-[min(92vw,360px)] flex-col gap-2" />
    </ToastPrimitive.Provider>
  );
}
