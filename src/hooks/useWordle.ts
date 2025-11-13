import { wordService } from "@/services";
import { useCallback, useEffect, useState } from "react";

export const useWordle = (date: Date) => {
  const [wotd, setWotd] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchWotd = async () => {
      try {
        const word = await wordService.getWordOfTheDay(date);

        setWotd(word);
      } catch (error) {
        const errorMessage =
          "Error occured while retreiving the word of the day";
        setError(errorMessage);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWotd();
  }, [date]);
  const validateWord = useCallback(async (word: string): Promise<boolean> => {
    try {
      return await wordService.validateWord(word);
    } catch (error) {
      const errorMessage = "Error occured while validating this word";
      setError(errorMessage);
      console.error(error);
    }
    return false;
  }, []);
  return { wotd, error, isLoading, validateWord };
};
