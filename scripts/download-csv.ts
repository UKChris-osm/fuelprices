import { getFreshCsvDownload } from "./freeola.ts";

// Basic test: request and validate a fresh download URL.
try {
  const result = await getFreshCsvDownload();

  console.log("Freeola connection successful.");
  console.log("Download URL received and validated.");

  if (result.generatedAt) {
    console.log(`Dataset generated at: ${result.generatedAt}`);
  }

  if (result.fileName) {
    console.log(`Source filename: ${result.fileName}`);
  }
} catch (error) {
  console.error(
    `Download test failed: ${
      error instanceof Error ? error.message : "Unknown error"
    }`,
  );

  process.exitCode = 1;
}
