import fs from "node:fs/promises";
import path from "node:path";
import { ensureDir, sha256 } from "./utils.js";

export type CachedResponse = {
  url: string;
  contentType: string | null;
  body: string;
};

export class ResponseCache {
  private memory = new Map<string, CachedResponse>();

  constructor(private cacheDir: string | null) {}

  async get(url: string): Promise<CachedResponse | null> {
    const cached = this.memory.get(url);
    if (cached) {
      return cached;
    }
    if (!this.cacheDir) {
      return null;
    }
    const filePath = this.filePath(url);
    try {
      const raw = await fs.readFile(filePath, "utf8");
      const parsed = JSON.parse(raw) as CachedResponse;
      this.memory.set(url, parsed);
      return parsed;
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;
      if (nodeError.code === "ENOENT") {
        return null;
      }
      throw error;
    }
  }

  async set(payload: CachedResponse): Promise<void> {
    this.memory.set(payload.url, payload);
    if (!this.cacheDir) {
      return;
    }
    await ensureDir(this.cacheDir);
    const filePath = this.filePath(payload.url);
    await fs.writeFile(filePath, JSON.stringify(payload), "utf8");
  }

  private filePath(url: string) {
    return path.join(this.cacheDir ?? "", `${sha256(url)}.json`);
  }
}
