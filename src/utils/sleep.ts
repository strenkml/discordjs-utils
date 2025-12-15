import { Time } from "./Time";

export async function sleepMs(milliseconds: number): Promise<void> {
  return await new Promise((r) => setTimeout(r, milliseconds));
}

export async function sleepSec(seconds: number): Promise<void> {
  return await sleepMs(seconds * 1000);
}

export async function withTimeout(promise: Promise<unknown>, ms: number): Promise<unknown> {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Request timed out after ${Time.getFormattedTimeFromMilliseconds(ms)}`)), ms)
  );
  return Promise.race([promise, timeout]);
}
