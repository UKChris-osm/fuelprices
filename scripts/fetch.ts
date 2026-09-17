export {}

console.log("Get fuel dataset!");

// Amazon AWS Temporary Access Key ID exposed by Fuel Price Dataset source.
// Temporary URL — will eventually be replaced by the official API.
const fueldataset = "https://ff-raw-data-bronze-ics-prod.s3.eu-west-2.amazonaws.com/UpdatedFuelPrice-1789657200076.csv?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUJYP2NSFNNARI77N%2F20260917%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260917T200454Z&X-Amz-Expires=43200&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCWV1LXdlc3QtMiJHMEUCIQCt%2BZFyiGs5eCqvsqa31xavKsRRiGv7YGl5p8KmJnNQvwIgaBz5eLO5aKEyqi2rZXYBDgywTa44hY46Wkv%2BHvARswwqkQUINRAAGgwyOTU4NDkwNjE1MTQiDPKyNZrF9aMufQEZpCruBGbb9QqAc%2BndqwfLFgm5KhZuTwbZ4terbDGMoa%2BN7Iv3C0b%2F5ZVI4bAq02iAzfmH9T4hcF33p1klBKRzX6UAFj9umi4XNArktHs3LD9z2cHFsplFBFUoHFUwYJIi0QbInvpsYFQlHAX9TFdSWafWFpL2tBJ8wKnneeNcXMzcYrlHa%2Bw8aWdS7X6FUQLXf0RNnESte6zOlVxouj1C392InA34SUU8Ay9Oy2DZXZLi75nF2hd%2BKobFP4vbt0ehT%2Fix%2BfX%2Fk7E3wVhG4qe1dxYI3ar6tZIC6grV1T9pH27x3gA87NMh8aXqrmRPChWxFsePUTAw%2FdkjB3GI3cs61BWi3Fw8JgRef%2Fcz25NoLP6aBpyhdJAEJ5mNpij1KESRBmjUTdpLWUO277dVmdfJ%2BnPMlVD0tfIxdOrJjGWi231D6FLydWYIdig21sheEGjzdJmTFLB3nDPd6kidjIatz7LTYwK0vNo%2B9HZNq3N09W%2BVPCpzewsFyH5caXbTJwa3EmTOj%2FWDc7hr1yNKkt9xjUIibPds2Q38%2F0RdDfz3l7ci6pfbD2TkzKxVF3Jc64e0uMR%2F5qHKrt7US924IzKdbq4uTUwlrXZ6mQ9P6114Z1gtTv6nbm4GELNCY2e2o5SVAuCIDoeFCuokt6zlhn9NCcK9A8hWAd13XD2D%2BtmljiOQdpPyhAJst9DNcwVyYIu9NgO3qrmfltcKfpkwp8GhTO5rbpysGFwaKQjj4N3pFyUfwUq5iLxVkWAcVyhpZBB74PXZG%2FIPpfChxI1zz5atYmSLUkvpyPrkVy8a0M9%2BbNCduqBNO81n8UEBnSBpVcl%2FtGAw5o%2Bx1QY6mQG5bjGn6API8A%2FZb7E8Tot%2BQvmO%2FFN%2F%2BhokDqte21vCWkuPLwgK%2Fl3w2AaFtC6CPxoH7vKFGis9gshsDKquXYAW%2FFzmGB2%2F1BQM%2BYRTWLdrzuDJy0l7tk6wzti36aemgQIZ30%2FIf9Hgc3tnPdOq%2FbglYHVwZiJQ%2B9gxD%2BvM6J7TMjdc%2FLwPrMEGgW8XTt5Zmskn0MWhoVH1auo%3D&X-Amz-Signature=492f52c58a9656c04516c383a041290b3e9717cf3e9873ff718ef513acb1ad2b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject";
const fuelPath = "docs/fueldata.csv";

try {
  const response = await fetch(fueldataset);

  if (!response.ok) {
    throw new Error(`Fuel Dataset download failed: HTTP ${response.status}: ${response.statusText}`);
  }

  const fuelData = await response.arrayBuffer();

  console.log(`⛽ Writing fuel data to ${fuelPath}`);

  await Bun.write(fuelPath, fuelData);

  console.log(`✅ Fuel data written: ${fuelData.byteLength} bytes`);

  console.log(`Downloaded: ${fuelData.byteLength}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
}
