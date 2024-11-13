// pages/api/create-token.js
import { NextApiRequest, NextApiResponse } from 'next';
import { createAndMintTokens } from '@/lib/solana/tokenUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const signature: string = await createAndMintTokens();
        res.status(200).json({ signature });
    } catch (error) {
        console.error('Error creating token:', error);
        res.status(500).json({ error: 'Token creation failed' });
    }
}
