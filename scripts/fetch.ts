export {}

console.log("Get fuel dataset!");

// Amazon AWS Temporary Access Key ID exposed by Fuel Price Dataset source.
// Replace with API later.
const fueldataset = "https://ff-raw-data-bronze-ics-prod.s3.eu-west-2.amazonaws.com/UpdatedFuelPrice-1789657200076.csv?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUJYP2NSFG4Q6FUAT%2F20260917%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260917T185638Z&X-Amz-Expires=43200&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCWV1LXdlc3QtMiJIMEYCIQCWm1W1k4XtU%2FzuHmzC476A7eqRfhLq1Ppc6fhET419pQIhAJwZiWiu2g6NjaDlwVFFBjrioQYwt1dy0zpwC8VVxpo3KpEFCDQQABoMMjk1ODQ5MDYxNTE0IgwiE6f92MTrdCMlpKAq7gQraYj1Ej4HkflcGCRQjGjJcEcnJJILVirGfHxS3GKoCRrWRIsnnNfAoP%2FIDHxivRoQJye4Dqg4v%2Bg%2BMVa6D8ailZAcsDksaTERs5p3%2Bd8nvi9LCPT6Nsjg%2Bz1Pk9rooTeNJDBLwKKaj8jIV2DrQgK9W4OrYEB64z3cvW%2B%2F30sSMqpENdi4dDTXxJqxef8XzzBzuhRRyH8cmOTgf7AS%2Fk%2BMRg04jA312LOv2TtUZSIP8PRD8Y9BTgjXl%2BthYjaOI50%2FVUciAq8ZBOSO%2FuQNHSRolNdIyBT7drRyTPGF4AeAHzgHGaEkNwsrDsYha20dVklw%2BERxtkrnvO05Q9VNjlMoa8n4FNk%2BLF4tyClvbqA7dB0M8EwQOKEdEGhgLFcjRV93ouzjAsTqxZDRBT2J0UsVUS%2BXKHuRcfnohbSww89CkecOnMnL3U23uINt3%2Bb1ZWx4YGWsYocWPKERoRL39dAvcmY2Qra67I8ohsd96mP2WGDEWa%2FJvPWLnY8%2FTwJ5ySZjejCVW54Fi6dffHTv2%2F1yuC%2FMoj8sTCzXv8vrohsDJ3YbCsw%2BcBG5zDHy5Iy1UnCkjHTssGSVEABYiVNAdMn%2BnpSIht8kX%2FvLkVkG7oxGtMRAThQSuBQnc034aBSBNCys79i%2Fypl4tNrUQBkCshvjIUb3uuMRkksbXFbtvPo8myD%2BDNHbSq%2FDFCFfhD4XXbrO44ofprybHCrwJDKp81iAG6HOLqyF5LBxdT94GPrvq4EEWkwFgq7CGxYKbUKtcmOw3r41ymWRNL5DkNDJY6y2cdGRbNTTTpe7kb02lM9dJ9J8%2FjYyNdXFrxbiVfeYMObvsNUGOpgB5P%2FbhZM1Sqb8KzbI44bCC4fvoH8S77HylKxGCiLPrG%2Fth3XGCM9o1fJj1O9zEjC%2Bdrt2XjTkrPDy%2B7xIPO8OEB0nixqGmBxuQ6%2F1c8YALAZLKGMfA7Nwyf92RFx%2FUNpNZ3RhQA58AI61ol8zhYh4NhHusvHjIJdLqjzaaLl7MeHLCqSsduJ3vOLDhTrqcpBnRGORL4AmBBI%3D&X-Amz-Signature=c5cbc901fc9522a0f7d132681cd564047b3f3d638b1827fe9ec4161605bf5e0b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject";
const fuelPath = "/docs/fueldata.csv";

(function () {
try {
  const response = await fetch(fueldataset);
  if (!response.ok) {
    throw new Error(`Fuel Dataset download failed: HTTP ${response.status}: ${response.statusText}`);
  }
  const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
}
})();

const fuelData = await response.arrayBuffer();
await Bun.write(fuelPath, fuelData);
console.log(`Compressed size: ${formatSize(fuelData.byteLength)}`);
