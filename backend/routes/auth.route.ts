import { Router } from 'express';
import { register, login, logout } from '../controllers/auth.controller';
import { authenticateLogin } from '../middlewares/authenticateLogin';
import { validate } from '../middlewares/validate';
import { registerSchema } from '../validators/authSchemas';
import {
    checkEmailAndUsernameReuse,
    checkPasswordStrength,
} from '../middlewares/userChecks';

const router: Router = Router();

router.post(
    '/register',
    validate(registerSchema),
    checkEmailAndUsernameReuse,
    checkPasswordStrength,
    register
);

router.post('/login', login);
router.post('/logout', logout);

export default router;
