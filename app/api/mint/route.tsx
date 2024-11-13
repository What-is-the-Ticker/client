// app/api/mint/route.ts
import { NextResponse } from "next/server";
import { mintCoin } from "@/lib/solana/mint";

export async function POST() {
  const result = await mintCoin();

  if (result.success) {
    return NextResponse.json({ success: true, mintAddress: result.mintAddress });
  } else {
    return NextResponse.json({ success: false, error: result.error });
  }
}
