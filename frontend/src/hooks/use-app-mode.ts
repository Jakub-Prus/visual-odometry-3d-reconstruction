"use client";

export function useAppMode(): "demo" | "api" {
  const mode = process.env.NEXT_PUBLIC_APP_MODE;
  return mode === "api" ? "api" : "demo";
}
