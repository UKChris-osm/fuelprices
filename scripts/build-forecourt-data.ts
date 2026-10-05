import { readFile, writeFile } from "node:fs/promises";

const INPUT = "datasets/fueldata.csv";
const FORECOURTS_OUTPUT = "docs/forecourts.json";
const PRICES_OUTPUT = "docs/fuelprices-csv.json";

const FUEL_TYPES = ["E5", "E10", "B7S", "B7P", "B10", "HVO"] as const;

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (ch === "," && !quoted) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }

  result.push(current);
  return result;
}

function numberOrNull(value: string): number | null {
  const n = Number(value.trim());
  return Number.isFinite(n) ? n : null;
}

function text(value: string): string {
  return value.trim();
}

const csv = await readFile(INPUT, "utf8");
const lines = csv.split(/\r?\n/).filter(Boolean);

if (lines.length < 2) {
  throw new Error(`No data rows found in ${INPUT}`);
}

const headers = parseCsvLine(lines[0]);
const index = new Map(headers.map((header, i) => [header, i]));

function field(row: string[], name: string): string {
  const i = index.get(name);
  return i === undefined ? "" : row[i] ?? "";
}

const forecourts: Array<{
  node_id: string;
  trading_name: string;
  brand_name: string;
  postcode: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  county: string;
  latitude: number;
  longitude: number;
}> = [];

const prices: Record<string, Record<string, number | null>> = {};

for (const line of lines.slice(1)) {
  const row = parseCsvLine(line);

  const nodeId = text(field(row, "forecourts.node_id"));

  if (!nodeId) continue;

  // Build the forecourt location record.
  const latitude = numberOrNull(
    field(row, "forecourts.location.latitude"),
  );

  const longitude = numberOrNull(
    field(row, "forecourts.location.longitude"),
  );

  // A map marker is impossible without valid coordinates.
  if (latitude !== null && longitude !== null) {
    forecourts.push({
      node_id: nodeId,
      trading_name: text(field(row, "forecourts.trading_name")),
      brand_name: text(field(row, "forecourts.brand_name")),
      postcode: text(field(row, "forecourts.location.postcode")),
      address_line_1: text(
        field(row, "forecourts.location.address_line_1"),
      ),
      address_line_2: text(
        field(row, "forecourts.location.address_line_2"),
      ),
      city: text(field(row, "forecourts.location.city")),
      county: text(field(row, "forecourts.location.county")),
      latitude,
      longitude,
    });
  }

  // Build the fuel price record.
  const nodePrices: Record<string, number | null> = {};

  for (const fuelType of FUEL_TYPES) {
    nodePrices[fuelType] = numberOrNull(
      field(row, `forecourts.fuel_price.${fuelType}`),
    );
  }

  prices[nodeId] = nodePrices;
}

const generatedAt = new Date().toISOString();

const forecourtOutput = {
  generated_at: generatedAt,
  source: INPUT,
  count: forecourts.length,
  forecourts,
};

const priceOutput = {
  generated_at: generatedAt,
  source: INPUT,
  count: Object.keys(prices).length,
  fuel_types: [...FUEL_TYPES],
  prices,
};

await writeFile(
  FORECOURTS_OUTPUT,
  JSON.stringify(forecourtOutput),
  "utf8",
);

await writeFile(
  PRICES_OUTPUT,
  JSON.stringify(priceOutput),
  "utf8",
);

console.log(`Generated ${FORECOURTS_OUTPUT}`);
console.log(`Forecourts: ${forecourts.length}`);

console.log(`Generated ${PRICES_OUTPUT}`);
console.log(`Price records: ${Object.keys(prices).length}`);
