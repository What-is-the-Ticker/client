// lib/umi.js
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { signerIdentity } from "@metaplex-foundation/umi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export function useUmi() {
  const { connection } = useConnection();
  const { wallet } = useWallet();

  if (!wallet || !connection) {
    console.error("Wallet or connection is not available");
    return null;
  }

  const umi = createUmi(connection.rpcEndpoint)
    .use(mplTokenMetadata())
    .use(walletAdapterIdentity(wallet.adapter))
    .use(irysUploader())

  return umi;
}
