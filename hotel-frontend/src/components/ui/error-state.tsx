import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ title = "Something went wrong", description = "We could not load this view. Please try again.", onRetry }: ErrorStateProps) {
  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-3">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="mb-4 max-w-md text-sm text-muted-foreground">{description}</p>
        {onRetry ? (
          <Button onClick={onRetry} variant="outline">
            Try again
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
