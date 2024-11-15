// src/lib/solana/mint.ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { createAndMint, mplTokenMetadata, TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { WalletAdapter } from '@solana/wallet-adapter-base';
import { PublicKey } from '@solana/web3.js';

interface MintCoinParams {
  walletAdapter: WalletAdapter;
  publicKey: PublicKey;
  tokenMetadata: {
    name: string;
    symbol: string;
    uri: string;
  };
  amount: number;
}

export async function mintCoin(params: MintCoinParams): Promise<string> {
  const { walletAdapter, publicKey, tokenMetadata, amount } = params;

  // Initialize Umi with the user's wallet
  const umi = createUmi(process.env.NEXT_PUBLIC_RPC_ENDPOINT!);
  umi.use(walletAdapterIdentity(walletAdapter));
  umi.use(mplTokenMetadata());

  // Generate a new mint account
  const mint = generateSigner(umi);

  // Perform the minting operation
  await createAndMint(umi, {
    mint,
    authority: umi.identity,
    name: tokenMetadata.name,
    symbol: tokenMetadata.symbol,
    uri: tokenMetadata.uri,
    sellerFeeBasisPoints: percentAmount(0), // No seller fee
    decimals: 8,
    amount,
    tokenOwner: publicKey as any,
    tokenStandard: TokenStandard.Fungible,
  }).sendAndConfirm(umi);

  // Return the mint address as a string
  return mint.publicKey.toString();
}
