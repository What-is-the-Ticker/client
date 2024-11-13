// lib/uploadToPinata.ts
import axios from "axios";

const PINATA_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

export async function uploadMetadataToPinata(
  name: string,
  symbol: string,
  description: string,
) {
  const metadata = {
    name,
    symbol,
    description,
    image:
      "https://teal-magic-alligator-248.mypinata.cloud/ipfs/QmQi7kbVW2pBYwo8BMM6BkRqknhuWJTmwjbcgL7baXYo3r", // Fixed image URL
  };

  try {
    const response = await axios.post(PINATA_URL, metadata, {
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    });
    return response.data.IpfsHash; // This is the IPFS hash for the uploaded JSON
  } catch (error) {
    console.error("Error uploading metadata to Pinata:", error);
    throw new Error("Failed to upload metadata to Pinata");
  }
}
