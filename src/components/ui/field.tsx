import * as React from "react";
import { cn } from "@/lib";

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("space-y-4", className)}
      {...props}
    />
  );
}

function Field({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field"
      className={cn("space-y-2", className)}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="field-label"
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
}

function FieldError({
  errors,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message: string }> | undefined;
}) {
  if (!errors || errors.length === 0) return null;

  return (
    <div
      data-slot="field-error"
      className={cn("text-sm text-destructive", className)}
      {...props}
    >
      {errors.map((error, index) => (
        <p key={index}>{error.message}</p>
      ))}
    </div>
  );
}

export { Field, FieldGroup, FieldLabel, FieldError };

