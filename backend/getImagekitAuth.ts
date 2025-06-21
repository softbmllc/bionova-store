// backend/getImagekitAuth.ts
import express from "express";
import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

router.get("/imagekitAuth", (req, res) => {
  try {
    const auth = imagekit.getAuthenticationParameters();
    return res.status(200).json(auth);
  } catch (err) {
    console.error("❌ Error al generar autenticación ImageKit:", err);
    return res.status(500).json({ error: "Error al generar autenticación" });
  }
});

export default router;