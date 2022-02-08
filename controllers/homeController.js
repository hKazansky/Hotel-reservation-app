const { getAllHotels } = require('../services/hotelService.js');

const router = require('express').Router();

router.get('/', async (req, res) => {
    const hotels = await getAllHotels();
    const user = req.user;
    const ctx = {
        hotels,
        user
    }
    res.render('hotel/hotels', ctx)
});

module.exports = router;
