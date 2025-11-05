// Image caching utilities using localStorage and IndexedDB

const CACHE_PREFIX = "nft_image_";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_SIZE = 50; // Maximum number of images to cache

interface CachedImage {
  url: string;
  dataUrl: string;
  timestamp: number;
  tokenId: number;
}

// Simple localStorage cache for metadata
export const metadataCache = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(`metadata_${key}`);
      if (!item) return null;

      const parsed = JSON.parse(item);
      if (Date.now() - parsed.timestamp > CACHE_EXPIRY) {
        localStorage.removeItem(`metadata_${key}`);
        return null;
      }

      return parsed.data;
    } catch {
      return null;
    }
  },

  set: (key: string, data: any) => {
    try {
      localStorage.setItem(
        `metadata_${key}`,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        }),
      );
    } catch (error) {
      console.warn("Failed to cache metadata:", error);
    }
  },
};

// IndexedDB setup for image caching
let db: IDBDatabase | null = null;

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open("NFTImageCache", 1);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains("images")) {
        const store = database.createObjectStore("images", { keyPath: "tokenId" });
        store.createIndex("timestamp", "timestamp");
      }
    };
  });
};

// Image cache operations
export const imageCache = {
  async get(tokenId: number): Promise<string | null> {
    try {
      const database = await initDB();
      const transaction = database.transaction(["images"], "readonly");
      const store = transaction.objectStore("images");

      return new Promise((resolve) => {
        const request = store.get(tokenId);
        request.onsuccess = () => {
          const result = request.result as CachedImage | undefined;
          if (result && Date.now() - result.timestamp < CACHE_EXPIRY) {
            resolve(result.dataUrl);
          } else {
            if (result) {
              // Clean up expired entry
              this.delete(tokenId);
            }
            resolve(null);
          }
        };
        request.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  },

  async set(tokenId: number, imageUrl: string, dataUrl: string): Promise<void> {
    try {
      const database = await initDB();

      // Check cache size and clean up if needed
      await this.cleanup();

      const transaction = database.transaction(["images"], "readwrite");
      const store = transaction.objectStore("images");

      const cachedImage: CachedImage = {
        tokenId,
        url: imageUrl,
        dataUrl,
        timestamp: Date.now(),
      };

      store.put(cachedImage);
    } catch (error) {
      console.warn("Failed to cache image:", error);
    }
  },

  async delete(tokenId: number): Promise<void> {
    try {
      const database = await initDB();
      const transaction = database.transaction(["images"], "readwrite");
      const store = transaction.objectStore("images");
      store.delete(tokenId);
    } catch (error) {
      console.warn("Failed to delete cached image:", error);
    }
  },

  async cleanup(): Promise<void> {
    try {
      const database = await initDB();
      const transaction = database.transaction(["images"], "readwrite");
      const store = transaction.objectStore("images");
      const index = store.index("timestamp");

      // Get all entries sorted by timestamp
      const request = index.openCursor();
      const entries: CachedImage[] = [];

      await new Promise<void>((resolve) => {
        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            entries.push(cursor.value);
            cursor.continue();
          } else {
            resolve();
          }
        };
        request.onerror = () => resolve();
      });

      // Remove expired entries
      const now = Date.now();
      const validEntries = entries.filter((entry) => now - entry.timestamp < CACHE_EXPIRY);

      // If still over limit, remove oldest entries
      if (validEntries.length > MAX_CACHE_SIZE) {
        const toRemove = validEntries
          .sort((a, b) => a.timestamp - b.timestamp)
          .slice(0, validEntries.length - MAX_CACHE_SIZE);

        for (const entry of toRemove) {
          store.delete(entry.tokenId);
        }
      }

      // Remove expired entries
      const expiredEntries = entries.filter((entry) => now - entry.timestamp >= CACHE_EXPIRY);
      for (const entry of expiredEntries) {
        store.delete(entry.tokenId);
      }
    } catch (error) {
      console.warn("Failed to cleanup image cache:", error);
    }
  },
};

// Convert image URL to data URL for caching
export const imageToDataUrl = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Maximum quality settings (max 1024x1024)
      const maxSize = 1024;
      let { width, height } = img;

      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      try {
        // Use PNG for lossless compression
        const dataUrl = canvas.toDataURL("image/png");
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
  });
};
