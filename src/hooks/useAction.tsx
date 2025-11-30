import { safeResult } from "@/utils";
import { AlertCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const useAction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async <T,>(
      fn: () => Promise<T>,
      showToast: boolean = true
    ): Promise<T | null> => {
      setIsLoading(true);
      const result = await safeResult(fn);
      setIsLoading(false);

      if (result.isErr()) {
        setError(result.error.userMessage);
        if (showToast)
          toast(result.error.userMessage, {
            style: { color: "var(--color-destructive-400)" },
            icon: <AlertCircle color="var(--color-destructive-400)" />,
          });
        return null;
      }
      return result.value;
    },
    []
  );

  return { run, isLoading, error };
};
