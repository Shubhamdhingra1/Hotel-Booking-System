import Hotel from "../models/hotel.js";
import Room from "../models/room.js";
import User from "../models/user.js";

export const createRoom = async (req, res, next) => {
    const hotelId = req.params.hotelId;
    const newRoom = new Room(req.body);

    try {
        const savedRoom = await newRoom.save();
        try {
            await Hotel.findByIdAndUpdate(hotelId, {
                $push: { rooms: savedRoom._id },
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json(savedRoom);
    } catch (err) {
        next(err);
    }
};

export const updateRoom = async (req, res, next) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedRoom);
    } catch (err) {
        next(err);
    }
};

export const updateRoomAvailability = async (req, res, next) => {
    try {
        await Room.updateOne(
            { "roomNumbers._id": req.params.roomId },
            {
                $push: {
                    "roomNumbers.$.unavailableDates": req.body.dates
                },
            }
        );
        res.status(200).json("Room status has been updated.");
    } catch (err) {
        next(err);
    }
};

export const deleteRoom = async (req, res, next) => {
    const hotelId = req.params.hotelId;
    try {
        await Room.findByIdAndDelete(req.params.id);
        try {
            await Hotel.findByIdAndUpdate(hotelId, {
                $pull: { rooms: req.params.id },
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json("Room has been deleted.");
    } catch (err) {
        next(err);
    }
};

export const getRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json("Room not found");
        }

        res.status(200).json(room);
    } catch (err) {
        next(err);
    }
};

export const getAllRooms = async (req, res, next) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (err) {
        next(err);
    }
};


export const getBookingCount = async (req, res, next) => {
    const currentDate = new Date();

    try {
        // Perform aggregation pipeline to count unavailable dates in the future for all rooms
        const count = await Room.aggregate([
            {
                $unwind: '$roomNumbers', // Deconstruct the roomNumbers array
            },
            {
                $unwind: '$roomNumbers.unavailableDates', // Deconstruct the unavailableDates array
            },
            {
                $match: {
                    'roomNumbers.unavailableDates': { $gte: currentDate }, // Filter for future unavailable dates
                },
            },
            {
                $count: 'unavailableDatesCount', //  counts the matching documents and assigns the count to the field unavailableDatesCount
            },
        ]);

        const unavailableDatesCount = count[0]?.unavailableDatesCount || 0;

        res.json({ count: unavailableDatesCount });
    } catch (error) {
        next(error);
    }
}