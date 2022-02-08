const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { COOKIE_NAME, TOKEN_SECRET } = require('./../config/index.js');

const { findUserByUsername, createUser, findUserByEmail } = require('./userService.js');

module.exports = () => (req, res, next) => {
    if (parseToken(req, res)) {
        req.auth = {
            async register(email, username, password) {
                const token = await register(email, username, password);
                res.cookie(COOKIE_NAME, token);
            },

            async login(username, password) {
                const token = await login(username, password);
                res.cookie(COOKIE_NAME, token);
            },

            logout() {
                logout(res, COOKIE_NAME);
            }
        }
        next();
    }
}

async function register(email, username, password) {

    const existingUser = await findUserByUsername(username);
    const existingEmail = await findUserByEmail(email);

    if (existingEmail) {
        throw new Error('Email is taken.');
    }

    if (existingUser) {
        throw new Error('Username is taken.');
    }
    let hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(email, username, hashedPassword);

    return generateToken(user)

}

async function login(username, password) {

    const user = await findUserByUsername(username);
    if (!user) {
        throw new Error('User is not found in the database.');
    }

    const hasMatched = await bcrypt.compare(password, user.hashedPassword);

    if (!hasMatched) {
        throw new Error('Wrong password!');

    }
    return generateToken(user);
}

function logout(res, cookieName) {
    res.clearCookie(cookieName);
}

function generateToken(userData) {
    return jwt.sign({
        _id: userData._id,
        email: userData.email,
        username: userData.username,
    }, TOKEN_SECRET);
}

function parseToken(req, res) {
    const token = req.cookies[COOKIE_NAME];
    if (!token) {
        return true;
    }

    try {
        const userData = jwt.verify(token, TOKEN_SECRET);
        req.user = userData;
        res.locals.user = userData;
        return true;

    } catch (error) {
        console.log(error.message);
        res.clearCookie(COOKIE_NAME);
        res.redirect('/login');

        return false;
    }
}
