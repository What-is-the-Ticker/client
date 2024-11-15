// app/api/mint/route.ts
import { NextResponse } from "next/server";
import { uploadMetadataToPinata } from "@/lib/uploadToPinata";

export async function POST(request: Request) {
  const { name, symbol, description } = await request.json();

  try {
    // Upload metadata to Pinata and get the IPFS hash
    const ipfsHash = await uploadMetadataToPinata(name, symbol, description);
    const metadataUri = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    return NextResponse.json({ success: true, metadataUri });
  } catch (error) {
    console.error("Metadata upload failed:", error);
    return NextResponse.json({ success: false, error: (error as any).message });
  }
}
