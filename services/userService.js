const User = require('./../models/User.js');

async function findUserById(id) {
    const user = User.findById(id);
    return user;
}

async function findUserByUsername(username) {
    const pattern = new RegExp(`^${username}$`, 'i');

    const user = await User.findOne({ username: { $regex: pattern } });

    return user;
}

async function findUserByEmail(email) {
    const pattern = new RegExp(`^${email}$`, 'i');

    const user = await User.findOne({ email: { $regex: pattern } });

    return user;
}

async function createUser(email, username, hashedPassword) {
    const user = new User({
        email,
        username,
        hashedPassword
    })

    user.save();

    return user;
}

module.exports = {
    findUserById,
    findUserByUsername,
    findUserByEmail,
    createUser,
}
