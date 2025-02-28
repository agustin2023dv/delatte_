
import cloudinary from "../../configs/cloudinary.config"; 
import express from "express";

const router = express.Router();

router.get("/generate-signature/restaurantes", (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const folder = "delatte/restaurantes";

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  );

  res.json({ timestamp, signature });
});



router.get("/generate-signature/perfil-restaurantes", (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = "delatte/perfil_restaurantes";

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  );

  res.json({ timestamp, signature, folder });
});

router.get("/generate-signature/perfil-usuarios", (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = "delatte/perfil_usuarios";

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  );

  res.json({ timestamp, signature, folder });
});


export default router;
