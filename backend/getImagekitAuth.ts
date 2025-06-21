// backend/getImagekitAuth.ts
import crypto from "crypto";
import { Request, Response, Router } from "express";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.get("/imagekitAuth", (req: Request, res: Response) => {
  try {
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY!;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY!;

    const timestamp = Math.floor(Date.now() / 1000); // current Unix time in seconds
    const expire = timestamp + 600; // 10 minutes from now

    const signature = crypto
      .createHmac("sha1", privateKey)
      .update(String(expire))
      .digest("hex");

    return res.status(200).json({
      token: signature,
      expire,
      publicKey,
    });
  } catch (err) {
    console.error("❌ Error al generar autenticación ImageKit:", err);
    return res.status(500).json({ error: "Error al generar autenticación" });
  }
});

export default router;