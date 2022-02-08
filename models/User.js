const { Schema, model } = require('mongoose');

const schema = new Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    bookedHotels: [{ type: Schema.Types.ObjectId, ref: 'Hotel', default: [] }],
    offeredHotels: [{ type: Schema.Types.ObjectId, ref: 'Hotel', default: [] }]
});

module.exports = model('User', schema);