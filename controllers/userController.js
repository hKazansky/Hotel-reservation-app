const router = require('express').Router();
const { getHotelById } = require('../services/hotelService.js');
const { isGuest, isUser } = require('./../services/guardsService.js');
const { findUserByUsername } = require('./../services/userService.js')

router.get('/register', isGuest, (req, res) => {
    res.render('user/register', { title: 'Register' });
});

router.post('/register', isGuest, async (req, res) => {

    if (req.body.username.length < 4) {
        throw new Error('Username must be more than 3 symbols')
    }

    if (req.body.password !== req.body.rePass) {
        throw new Error('Passwords don\'t match!');
    }

    if (req.body.password.length < 5) {
        throw new Error('Password must be atleast 5 characters long')
    }

    const user = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    }
    try {
        await req.auth.register(user.email, user.username, user.password);
        res.redirect('/')
    } catch (error) {
        // throw new Error(error.message);
        console.log(error.message);
        const ctx = {
            title: "Register",
            errors: error.message,
            user: {
                username: req.body.username,
                email: req.body.email
            }
        }

        res.render('user/register', ctx)
    }
});

router.get('/login', isGuest, (req, res) => {
    res.render('user/login', { title: 'Login' });
});

router.post('/login', async (req, res) => {

    const user = {
        username: req.body.username,
        password: req.body.password
    }
    try {
        await req.auth.login(user.username, user.password);
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }

});

router.get('/logout', isUser, (req, res) => {
    req.auth.logout(res, 'SESSION_TOKEN');
    res.redirect('/')
})

router.get('/profile', isUser, async (req, res) => {
    const currentUser = await findUserByUsername(req.user.username);
    const nameOfEachHotel = [];
    let promiseHotels = currentUser.bookedHotels.map(el => el.valueOf()).map(x => getHotelById(x));
    (await Promise.all(promiseHotels)).forEach(x => nameOfEachHotel.push(x.hotelName));
    // console.log(nameOfEachHotel);

    const ctx = {
        title: 'Profile',
        userData: {
            username: currentUser.username,
            email: currentUser.email,
            bookedHotels: nameOfEachHotel,
            offeredHotels: currentUser.offeredHotels,
        }
    }
    res.render('user/profile', ctx);

});

module.exports = router;