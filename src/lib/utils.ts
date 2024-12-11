import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toClientModel<T extends { _id: string }>(
  doc: T
): Omit<T, '_id'> & { id: string } {
  const { _id, ...rest } = doc;
  return {
    ...rest,
    id: _id.toString(),
  };
}
