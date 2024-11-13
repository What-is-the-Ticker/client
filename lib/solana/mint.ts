// mint.ts
import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair } from "@metaplex-foundation/umi";
import { TokenStandard, createAndMint, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import secret from "@/lib/solana/guideSecret.json";
import dotenv from "dotenv";

dotenv.config();

const endpoint = process.env.RPC_ENDPOINT;

if (!endpoint) {
  console.log(`RPC_ENDPOINT is missing from .env file`);
  process.exit(1);
}

const umi = createUmi(endpoint);
const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));
const userWalletSigner = createSignerFromKeypair(umi, userWallet);

umi.use(signerIdentity(userWalletSigner));
umi.use(mplTokenMetadata());

export async function mintCoin(name: string, symbol: string, uri: string) {
  const mint = generateSigner(umi);

  try {
    await createAndMint(umi, {
      mint,
      authority: umi.identity,
      name,
      symbol,
      uri,
      sellerFeeBasisPoints: percentAmount(0),
      decimals: 8,
      amount: 1000000_00000000,
      tokenOwner: userWallet.publicKey,
      tokenStandard: TokenStandard.Fungible,
    }).sendAndConfirm(umi);

    console.log("Successfully minted 1 million tokens (", mint.publicKey, ")");
    return { success: true, mintAddress: mint.publicKey.toString() };
  } catch (error) {
    console.error("Error minting tokens:", error);
    return { success: false, error: (error as any).message };
  }
}
