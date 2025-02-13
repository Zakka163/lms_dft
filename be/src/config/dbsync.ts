import {sq} from "./connection.js"
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  try {
    const normalizedPath = path.join(__dirname, "../modul");
    const folder1 = await fs.readdir(normalizedPath);

    for (const folder of folder1) {
      const folderPath = path.join(normalizedPath, folder);
      const files = await fs.readdir(folderPath);

      for (const file of files) {
        if (file === "model.js" || file === "model.ts") {
          await import(`../modul/${folder}/model.js`);
        }
      }
    }

    await sq.sync({ alter: true });
    console.log("Database Berhasil di Sinkronisasi");
    console.log("disconnecting...");
    process.exit(0);
  } catch (error) {
    console.error("Error during sync:", error);
    process.exit(1);
  }
})();
