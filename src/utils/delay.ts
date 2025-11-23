export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function delayImmediate(): Promise<void> {
  return new Promise((resolve) => queueMicrotask(resolve));
}
