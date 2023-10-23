import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isImageBase64 = (imageData: string) => {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
};

export const formatDateString = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${time} - ${formattedDate}`;
};

// created by chatgpt
export const formatPostCount = (count: number): string => {
  if (count === 0) {
    return "No Posts";
  } else {
    const postCount = count.toString().padStart(2, "0");
    const postWord = count === 1 ? "Post" : "Posts";
    return `${postCount} ${postWord}`;
  }
};

export function formatTimeAgo(time: string) {
  const timestamp = parseInt(time);
  const currentTime = new Date().getTime();
  const timeDifference = currentTime - timestamp;

  // Define time intervals in milliseconds
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;

  if (timeDifference < minute) {
    const seconds = Math.floor(timeDifference / 1000);
    return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
  } else if (timeDifference < hour) {
    const minutes = Math.floor(timeDifference / minute);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else if (timeDifference < day) {
    const hours = Math.floor(timeDifference / hour);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else if (timeDifference < month) {
    const days = Math.floor(timeDifference / day);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  } else if (timeDifference < year) {
    const months = Math.floor(timeDifference / month);
    return `${months} month${months === 1 ? "" : "s"} ago`;
  } else {
    const years = Math.floor(timeDifference / year);
    return `${years} year${years === 1 ? "" : "s"} ago`;
  }
}
