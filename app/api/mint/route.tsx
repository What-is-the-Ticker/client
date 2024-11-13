// app/api/mint/route.ts
import { NextResponse } from "next/server";
import { mintCoin } from "@/lib/solana/mint";
import { uploadMetadataToPinata } from "@/lib/uploadToPinata";

export async function POST(request: Request) {
  const { name, symbol, description } = await request.json();

  try {
    // Upload metadata to Pinata and get the IPFS hash
    const ipfsHash = await uploadMetadataToPinata(name, symbol, description);
    const metadataUri = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    // Mint the coin with the dynamically generated metadata URI
    const result = await mintCoin(name, symbol, metadataUri);

    return NextResponse.json({ success: true, mintAddress: result.mintAddress });
  } catch (error) {
    console.error("Minting process failed:", error);
    return NextResponse.json({ success: false, error: (error as any).message });
  }
}