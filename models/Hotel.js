const { Schema, model } = require('mongoose');

const schema = new Schema({
    hotelName: { type: String, required: true, minlength: 4 },
    city: { type: String, required: true, minlength: 3 },
    imageUrl: { type: String, required: true, match: [/^https?:\/\//, 'Image must be a valid URL'] },
    freeRooms: { type: Number, required: true, min: 1, max: 100 },
    bookedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    owner: { type: String, required: true }
})

module.exports = model('Hotel', schema)