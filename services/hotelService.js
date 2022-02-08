const Hotel = require('../models/Hotel.js');
const User = require('../models/User.js');

async function getAllHotels() {
    return Hotel.find({}).lean();
}

async function createHotel(hotelData) {
    const hotel = new Hotel(hotelData);

    await hotel.save();

    return hotel;
}

async function getHotelById(id) {
    return await Hotel.findById(id).lean();
}

async function editHotel(id, hotelData) {
    const existingHotel = await Hotel.findById(id);

    if (!existingHotel) {
        throw new Error('There is no such hotel in the database.');
    }

    Object.assign(existingHotel, hotelData);

    return existingHotel.save();
}

async function deleteHotel(id) {
    const existing = await Hotel.findById(id);
    if (!existing) {
        throw new Error('The hotel is not in the database.');
    }

    return Hotel.findByIdAndDelete(id);
}

async function bookHotel(hotelId, userId) {
    const user = await User.findById(userId);
    const hotel = await Hotel.findById(hotelId);


    if (user._id === hotel.owner) {
        throw new Error('You cannot book a hotel that you\'re owner of!');
    }

    if (hotel.freeRooms === 0) {
        throw new Error('The hotel is full of reservations, please try on an another date.');
    } else {
        user.bookedHotels.push(hotelId);
        hotel.bookedBy.push(userId);

        hotel.freeRooms--;
    }

    return Promise.all([user.save(), hotel.save()]);
}


module.exports = {
    getAllHotels,
    createHotel,
    editHotel,
    deleteHotel,
    getHotelById,
    bookHotel,
}