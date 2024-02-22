import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { auth } from "./auth"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const getUserId = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("You must be logged in to do that");
  }

  return userId;
}