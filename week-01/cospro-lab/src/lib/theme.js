// 라이트 / 다크 모드
// <html> 에 dark 클래스를 붙였다 뗐다 하고, 고른 값은 브라우저에 기억한다.
// 처음 방문이면 컴퓨터(운영체제) 설정을 따른다.

import { useSyncExternalStore } from "react";
import { readLS, writeLS } from "./storage";

const LS_KEY = "cospro.theme";
const listeners = new Set();

function initial() {
  const saved = readLS(LS_KEY, "");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

let theme = initial();
document.documentElement.classList.toggle("dark", theme === "dark");

export function setTheme(next) {
  theme = next;
  document.documentElement.classList.toggle("dark", theme === "dark");
  writeLS(LS_KEY, theme);
  listeners.forEach((fn) => fn());
}

export const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

export function useTheme() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => theme
  );
}
