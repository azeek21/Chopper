import { createContext } from "react";

export type urlContextType = {
  from_url: string;
  to_url: string;
  created_at: number;
  clicks: number;
  limit?: number;
  timeout?: number;
};

export const userContext = createContext<urlContextType | null>(null);
