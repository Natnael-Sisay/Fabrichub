"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the content. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {title}
          </h3>
          <p className="text-muted-foreground mb-4">{message}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              Try Again
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

