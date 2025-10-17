import { toast } from "sonner";

export function capitalize(text?: string) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "";
}

export function truncateDescription(text: string, wordLimit = 20): string {
  if (!text) return "";
  const words = text.split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
}

export function handleFormError(error: any) {
  const message = error?.response?.data?.error?.message;
  let errorMessage = "Something went wrong";
  if (Array.isArray(message) && message.length > 0) {
    errorMessage = message[0];
  } else if (typeof message === "string") {
    errorMessage = message;
  }
  toast.error(capitalize(errorMessage));
}
