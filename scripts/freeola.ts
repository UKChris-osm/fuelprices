
const BROKER_URL = "https://haignet.co.uk/fuel-csv.php";
const EXPECTED_S3_HOST = "ff-raw-data-bronze-ics-prod.s3.eu-west-2.amazonaws.com";

export interface FreshCsvDownload {
  redirectUrl: string;
  generatedAt?: string;
  fileName?: string;
}

interface BrokerResponse {
  success?: boolean;
  redirectUrl?: string;
  generated_at?: string;
  fileName?: string;
  error?: string;
  message?: string;
  data?: {
    redirectUrl?: string;
    generated_at?: string;
    fileName?: string;
  };
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : undefined;
}

/**
 * Requests a fresh CSV download URL from the Freeola broker.
 * Never logs the credential or the signed download URL.
 */
export async function getFreshCsvDownload(): Promise<FreshCsvDownload> {
  const token = process.env.FREEOLA_TOKEN;

  if (!token) {
    throw new Error("FREEOLA_TOKEN environment variable is missing.");
  }

  let response: Response;

  try {
    response = await fetch(BROKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(60_000),
    });
  } catch (error) {
    throw new Error(
      `Could not contact Freeola: ${
        error instanceof Error ? error.message : "network error"
      }`,
    );
  }

  const body = await response.text();

  let payload: BrokerResponse | undefined;

  try {
    payload = JSON.parse(body) as BrokerResponse;
  } catch {
    // Do not print the raw response; it could contain sensitive information.
  }

  if (!response.ok) {
    const reason = getString(payload?.error) ?? "request_failed";
    const message = getString(payload?.message);

    throw new Error(
      `Freeola returned HTTP ${response.status}: ${reason}` +
        (message ? ` — ${message}` : ""),
    );
  }

  if (!payload) {
    throw new Error(
      "Freeola returned a successful HTTP status but invalid JSON.",
    );
  }

  const redirectUrl =
    getString(payload.redirectUrl) ??
    getString(payload.data?.redirectUrl);

  if (!redirectUrl) {
    throw new Error(
      `Freeola returned no download URL: ${
        getString(payload.error) ?? "missing_download_url"
      }`,
    );
  }

  let url: URL;

  try {
    url = new URL(redirectUrl);
  } catch {
    throw new Error("Freeola returned an invalid download URL.");
  }

  if (
    url.protocol !== "https:" ||
    url.hostname !== EXPECTED_S3_HOST
  ) {
    throw new Error(
      "Freeola returned a URL outside the expected HTTPS S3 host.",
    );
  }

  const generatedAt =
    getString(payload.generated_at) ??
    getString(payload.data?.generated_at);

  if (generatedAt && Number.isNaN(Date.parse(generatedAt))) {
    throw new Error("Freeola returned an invalid generation timestamp.");
  }

  return {
    redirectUrl,
    ...(generatedAt ? { generatedAt } : {}),
    ...(getString(payload.fileName)
      ? { fileName: getString(payload.fileName) }
      : {}),
  };
}

// Built-in test: runs only when this file is executed directly.
if (import.meta.main) {
  try {
    const result = await getFreshCsvDownload();

    console.log("Freeola authentication successful.");
    console.log("Broker returned a valid S3 download URL.");

    if (result.generatedAt) {
      console.log(`Dataset generated at: ${result.generatedAt}`);
    }

    if (result.fileName) {
      console.log(`Source filename: ${result.fileName}`);
    }

    // Deliberately do not print result.redirectUrl.
  } catch (error) {
    console.error(
      `Freeola test failed: ${
        error instanceof Error ? error.message : "unknown error"
      }`,
    );

    process.exitCode = 1;
  }
}
