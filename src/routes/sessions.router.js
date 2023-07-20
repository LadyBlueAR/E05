import { Router } from 'express';
import { userModel } from '../dao/mongo/models/user.model.js';

const router = Router();

const adminCredentials = {
    email: 'adminCoder@coder.com',
    password: 'adminCod3r123',
    rol: 'admin',
};

router.post('/register', async (req, res) => {
    const user = await userModel.create(req.body);
    res.status(201).json({ status: 'success', user });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });
    if (email === adminCredentials.email && password === adminCredentials.password) {
        req.session.user = {
            name: 'admin',
            rol: 'admin',
        };
        return res.status(200).json({ status: 'success', message: 'Login Ok' });
    }
    if (!user) return res.status(404).json({ status: 'not found', message: "email or password incorrect" });
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        rol: user.rol,
    };
    res.status(200).json({ status: 'success', message: "Login Ok" });
});

router.post('/logout', async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).json({ status: 'error', message: 'Ha ocurrido un error al cerrar sesión.' });
        }
        res.json({ status: 'success', message: 'Sesión cerrada exitosamente.' });
    });
});

export default router;
