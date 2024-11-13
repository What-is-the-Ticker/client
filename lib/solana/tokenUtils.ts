// lib/tokenUtils.js
import {
  createFungible,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata';
import {
  createTokenIfMissing,
  findAssociatedTokenPda,
  getSplAssociatedTokenProgramId,
  mintTokensTo,
} from '@metaplex-foundation/mpl-toolbox';
import {
  generateSigner,
  percentAmount,
  createGenericFile,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { base58 } from '@metaplex-foundation/umi/serializers';
import fs from 'fs';

export async function createAndMintTokens() {
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplTokenMetadata())
    .use(irysUploader());

  const mintSigner = generateSigner(umi);
  umi.use(signerIdentity(mintSigner));

  // Airdrop SOL to mintSigner
  await umi.rpc.airdrop(mintSigner.publicKey, sol(1));

  // Read image file
  const imageFile = fs.readFileSync('./public/image.png');
  const umiImageFile = createGenericFile(imageFile, 'image.png', {
    tags: [{ name: 'Content-Type', value: 'image/png' }],
  });

  // Upload image to Arweave
  const [imageUri] = await umi.uploader.upload([umiImageFile]);

  // Prepare metadata
  const metadata = {
    name: 'The Kitten Coin',
    symbol: 'KITTEN',
    description: 'The Kitten Coin is a token created on the Solana blockchain',
    image: imageUri,
  };

  // Upload metadata to Arweave
  const metadataUri = await umi.uploader.uploadJson(metadata);

  // Create fungible token
  const createFungibleIx = createFungible(umi, {
    mint: mintSigner,
    name: metadata.name,
    uri: metadataUri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 0,
  });

  const createTokenIx = createTokenIfMissing(umi, {
    mint: mintSigner.publicKey,
    owner: umi.identity.publicKey,
    ataProgram: getSplAssociatedTokenProgramId(umi),
  });

  const mintTokensIx = mintTokensTo(umi, {
    mint: mintSigner.publicKey,
    token: findAssociatedTokenPda(umi, {
      mint: mintSigner.publicKey,
      owner: umi.identity.publicKey,
    }),
    amount: BigInt(1000),
  });

  // Send transaction
  const tx = await createFungibleIx
    .add(createTokenIx)
    .add(mintTokensIx)
    .sendAndConfirm(umi);

  const signature = base58.deserialize(tx.signature)[0];
  return signature;
}
