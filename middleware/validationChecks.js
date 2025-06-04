function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const validRegistrationRequest = (req, res, next) => {
    const { email, name, password } = req.body;

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid Email' });
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'Invalid Name' });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    next();
};

const validLoginRequest = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid Email' });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    next();
};

module.exports = {
    validRegistrationRequest,
    validLoginRequest,
};