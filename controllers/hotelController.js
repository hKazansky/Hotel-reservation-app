const router = require('express').Router();

const { createHotel, getHotelById, editHotel, deleteHotel, bookHotel } = require('../services/hotelService.js');
const { isUser, isGuest } = require('../services/guardsService.js');

router.get('/create', isUser, (req, res) => {
    res.render('booking/create')
});

router.post('/create', isUser, async (req, res) => {

    const hotel = {
        hotelName: req.body.hotelName,
        city: req.body.city,
        imageUrl: req.body.imageUrl,
        freeRooms: req.body.freeRooms,
        bookedBy: [],
        owner: req.user._id
    }

    try {
        await createHotel(hotel);
        res.redirect('/');
    } catch (err) {
        console.log(error.message);

        let errors;
        if (err.errors) {
            errors = Object.values(err.errors).map(er => er.properties.message);
        } else {
            errors = [err.message]
        }

        const ctx = {
            errors,
            hotelData: {
                hotelName: req.body.hotelName,
                city: req.body.city,
                imageUrl: req.body.imageUrl,
                freeRooms: req.body.freeRooms,
            },
        }
        res.render('booking/create', ctx);
    }
});

router.get('/details/:id', async (req, res) => {

    const hotelId = req.params.id;
    try {
        const hotel = await getHotelById(hotelId);
        hotel.hasUser = Boolean(req.user);
        hotel.isOwner = req.user && req.user._id === hotel.owner;
        hotel.isBooked = req.user && hotel.bookedBy.find(x => x.valueOf() === req.user._id);

        const ctx = {
            title: 'Details',
            hotel
        }
        res.render('booking/details', ctx);
    } catch (error) {
        console.log(error.message);
    }
});

router.get('/edit/:id', async (req, res) => {
    const hotelId = req.params.id;
    const hotel = await getHotelById(hotelId);
    if (req.user._id !== hotel.owner) {
        throw new Error('You can\'t edit hotel which you haven\'t created!');
    }
    const ctx = {
        title: 'Edit',
        hotel
    }

    res.render('booking/edit', ctx);
});

router.post('/edit/:id', async (req, res) => {
    const hotelId = req.params.id;
    const currentHotel = await getHotelById(hotelId);

    if (req.user._id !== currentHotel.owner) {
        throw new Error('You can\'t edit hotel which you haven\'t created!');
    }

    const hotel = {
        _id: req.params.id,
        hotelName: req.body.hotelName,
        city: req.body.city,
        imageUrl: req.body.imageUrl,
        freeRooms: req.body.freeRooms,
    };

    try {
        await editHotel(hotelId, hotel);
        res.redirect(`/details/${hotelId}`);
    } catch (error) {
        console.log(error.message);
    }
});


router.get('/delete/:id', async (req, res) => {
    await deleteHotel(req.params.id);
    res.redirect('/');

});

router.get('/book/:id', isUser, async (req, res) => {
    const userId = req.user._id;
    const hotelId = req.params.id;
    try {

        await bookHotel(hotelId, userId);
        res.redirect(`/details/${hotelId}`);

    } catch (error) {
        console.log(error.message);
        res.redirect('/');
    }
})

module.exports = router;
