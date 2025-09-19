import { Router } from "express";
import { authenticateLogin } from "../middlewares/authenticateLogin";
import { validate } from "../middlewares/validate";

import {
  getProfile,
  updateProfile,
  updatePassword,
  updateAvatar,
  deleteProfile,
  getAvatarUploadSignature,
} from "../controllers/user.controller";

import {
  updateProfileSchema,
  updatePasswordSchema,
  uploadAvatarSchema,
} from "../validators/userSchemas";

const router = Router();


router.get("/profile", authenticateLogin, getProfile);

router.put(
  "/profile",
  authenticateLogin,
  validate(updateProfileSchema),
  updateProfile
);

router.put(
  "/password",
  authenticateLogin,
  validate(updatePasswordSchema),
  updatePassword
);

// Avatar upload flow
router.get("/avatar-signature", authenticateLogin, getAvatarUploadSignature);
router.put(
  "/avatar",
  authenticateLogin,
  validate(uploadAvatarSchema),
  updateAvatar
);


router.delete("/profile", authenticateLogin, deleteProfile);

export default router;
