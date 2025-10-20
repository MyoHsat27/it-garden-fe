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

export function getDayOfWeek(day: number) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day] ?? day;
}

export function formatTimeAMPM(time: string): string {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return time;

  const date = new Date();
  date.setHours(hours, minutes);

  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function getSpotsLeftMessage(spotsLeft: number): string {
  if (spotsLeft <= 0) return "Full";
  if (spotsLeft === 1) return "1 spot left";
  return `${spotsLeft} spots left`;
}

export function isToday(dateStr: string) {
  const today = new Date().toISOString().split("T")[0];
  return dateStr === today;
}

export function isOnTime(dateStr?: string): boolean {
  if (!dateStr) return false;

  const now = new Date();
  const expiry = new Date(dateStr);

  if (isNaN(expiry.getTime())) return false;

  return expiry >= now;
}
