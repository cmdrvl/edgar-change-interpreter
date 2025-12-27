import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const normalizeCik = (input: string) => {
  const digits = input.replace(/\D/g, "");
  if (!digits) {
    throw new Error("CIK must contain digits");
  }
  return digits.padStart(10, "0").slice(-10);
};

export const stripLeadingZeros = (cik: string) => cik.replace(/^0+/, "") || "0";

export const sha256 = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

export const ensureDir = async (dir: string) => {
  await fs.mkdir(dir, { recursive: true });
};

export const readJsonFile = async <T>(filePath: string): Promise<T> => {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
};

export const writeJsonFile = async (filePath: string, payload: unknown) => {
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
};

export const resolvePathFromHere = (baseDir: string, ...segments: string[]) =>
  path.resolve(baseDir, ...segments);
