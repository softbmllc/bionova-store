// /api/imagekit-signature.ts

import { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    return res.status(500).json({ error: "Faltan variables de entorno." });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto
    .createHmac('sha1', privateKey)
    .update(timestamp.toString())
    .digest('hex');

  return res.status(200).json({
    signature,
    expire: timestamp,
    token: crypto.randomBytes(16).toString('hex'),
  });
}