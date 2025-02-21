import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import User from './models/user.model.js';
import Place from './models/places.model.js';
import Booking from './models/booking.model.js';
import imageDownloader from 'image-downloader';
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';
import multer from 'multer';
import fs from 'fs';
import Feedback from './models/feedback.model.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const bcryptSalt = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
const jwtSecret = process.env.JWT_SECRET;

app.use(express.json());
app.use(cookieParser());
const photosMiddleware = multer({ dest: 'uploads/' });

app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("✅ MongoDB connected");
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err);
    });

function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            resolve(userData);
        });
    });
}

function adminOnly(req, res, next) {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const user = await User.findById(userData.id);
            if (user && user.role === 'admin') {
                return next();
            } else {
                return res.status(403).json({ message: 'Forbidden: Admins only' });
            }
        });
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}


app.get('/test', (req, res) => {
    res.json("Test ok!");
});

app.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        const userDoc = await User.create({ name, email, password: hashedPassword, role });

        res.status(201).json(userDoc);
    } catch (e) {
        console.error('Error registering user:', e);
        res.status(422).json({ message: 'Registration failed. Please try again later.' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password, loginType } = req.body;
    try {
        const userDoc = await User.findOne({ email });

        if (!userDoc) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (!passOk) {
            return res.status(422).json({ message: 'Incorrect password' });
        }

        if (userDoc.role !== loginType) {
            return res.status(403).json({ message: `You are not authorized to log in as a ${loginType}` });
        }

        jwt.sign(
            {
                email: userDoc.email,
                id: userDoc._id,
                role: userDoc.role
            },
            jwtSecret,
            {},
            (err, token) => {
                if (err) {
                    return res.status(500).json({ message: 'Error generating token' });
                }
                res.cookie('token', token).json(userDoc);
            }
        );
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const { name, email, _id, role } = await User.findById(userData.id);
            res.json({ name, email, _id, role });
        });
    } else {
        res.json(null);
    }
});

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';

    try {
        const destPath = path.join(__dirname, 'uploads', newName);

        await imageDownloader.image({
            url: link,
            dest: destPath,
        });

        res.json(newName);
    } catch (error) {
        console.error('Error downloading image:', error);
        res.status(500).json({ message: 'Error uploading image' });
    }
});

app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];

    for (let i = 0; i < req.files.length; i++) {
        const { path: filePath, originalname } = req.files[i];
        console.log({ filePath });

        const ext = originalname.split('.').pop();
        const newPath = filePath + '.' + ext;

        fs.renameSync(filePath, newPath);
        const fileName = path.basename(newPath);

        console.log(fileName);
        uploadedFiles.push(fileName);
    }

    res.json(uploadedFiles);
});

app.post('/places', (req, res) => {
    const { token } = req.cookies;
    const {
        title, address, addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests, price
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await Place.create({
            owner: userData.id,
            title, address, photos: addedPhotos, description,
            perks, extraInfo, checkIn, checkOut, maxGuests, price
        });
        res.json(placeDoc);
    });
});

app.get('/user-places', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const { id } = userData;
        res.json(await Place.find({ owner: id }));
    });
});

app.get('/places/:id', async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id));
});

app.put('/places', async (req, res) => {
    const { token } = req.cookies;
    const {
        id, title, address, addedPhotos, description, price,
        perks, extraInfo, checkIn, checkOut, maxGuests,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await Place.findById(id);
        if (userData.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title, address, photos: addedPhotos, description, price,
                perks, extraInfo, checkIn, checkOut, maxGuests,
            });
            await placeDoc.save();
            res.json('ok');
        }
    });
});

app.get('/places', async (req, res) => {
    res.json(await Place.find());
});

app.post('/bookings', async (req, res) => {
    const userData = await getUserDataFromReq(req);
    const {
        place, checkIn, checkOut, numberOfGuests, name, phone, price,
    } = req.body;
    Booking.create({
        place, checkIn, checkOut, numberOfGuests, name, phone, price,
        user: userData.id,
    }).then((doc) => {
        res.json(doc);
    }).catch((err) => {
        throw err;
    });
});

app.get('/bookings', async (req, res) => {
    const userData = await getUserDataFromReq(req);
    res.json(await Booking.find({ user: userData.id }).populate('place'));
});

app.post('/feedback', async (req, res) => {
    const userData = await getUserDataFromReq(req);
    const { feedback, rating, category } = req.body;

    try {
        await Feedback.create({
            feedback,
            rating,
            category,
            userId: userData.id,
        });

        res.status(201).send({ message: 'Feedback submitted successfully!' });
    } catch (err) {
        console.error('Error saving feedback:', err);
        res.status(500).send({ message: 'Something went wrong. Please try again.' });
    }
});

app.get('/admin/stats', adminOnly, async (req, res) => {
    try {
        const totalVillas = await Place.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalEarningsData = await Booking.aggregate([
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: '$price' }
                }
            }
        ]);
        const totalEarnings = totalEarningsData.length ? totalEarningsData[0].totalEarnings : 0;

        res.json({
            totalVillas,
            totalBookings,
            totalUsers,
            totalEarnings,
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/bookings/recent', async (req, res) => {
    try {
        const recentBookings = await Booking.find()
            .sort({ checkIn: -1 })
            .limit(5)
            .populate('place')

        const formattedBookings = recentBookings.map(booking => ({
            id: booking._id,
            villa: booking.place.title,
            user: booking.name,
            phone: booking.phone,
            checkIn: booking.checkIn.toISOString().split('T')[0],
            checkOut: booking.checkOut.toISOString().split('T')[0],
            price: booking.price,
        }));

        res.json(formattedBookings);
    } catch (error) {
        console.error('Error fetching recent bookings:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/all-bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().populate('place').sort({ checkIn: -1 });

        const formattedBookings = bookings.map(booking => ({
            id: booking._id,
            villa: booking.place?.title || "N/A",
            user: booking.name,
            phone: booking.phone,
            checkIn: booking.checkIn?.toISOString().split('T')[0] || "N/A",
            checkOut: booking.checkOut?.toISOString().split('T')[0] || "N/A",
            price: booking.price,
        }));

        res.json(formattedBookings);
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});

app.get('/all-users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Users' });
    }
});

app.get('/all-villas', async (req, res) => {
    try {
        const places = await Place.find()
            .populate('owner', 'name')
            .exec()
        res.json(places)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Users' });
    }
});

app.get('/feedbacks', async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedbacks' });
    }
});

app.delete('/bookings/:bookingId', async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userData = await getUserDataFromReq(req);

        const booking = await Booking.findOneAndDelete({
            _id: bookingId,
            user: userData.id
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found or you are not authorized to cancel this booking' });
        }

        res.status(200).json({ message: 'Booking canceled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while canceling the booking' });
    }
});

app.get('/owner-bookings', async (req, res) => {
    const { token } = req.cookies;
    const { type } = req.query; // 'recent' or 'all'

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) return res.status(403).json({ message: 'Unauthorized' });

        const { id } = userData;

        try {
            let query = Booking.find().populate({
                path: 'place',
                match: { owner: id }
            }).sort({ checkIn: -1 });

            if (type === 'recent') {
                query = query.limit(3);
            }

            const bookings = await query;
            const ownerBookings = bookings.filter(booking => booking.place !== null);

            const formattedBookings = ownerBookings.map(booking => ({
                id: booking._id,
                villa: booking.place?.title || "N/A",
                user: booking.name,
                phone: booking.phone,
                checkIn: booking.checkIn?.toISOString().split('T')[0] || "N/A",
                checkOut: booking.checkOut?.toISOString().split('T')[0] || "N/A",
                price: booking.price,
            }));

            res.json(formattedBookings);
        } catch (error) {
            console.error('Error fetching bookings for owner:', error);
            res.status(500).send('Server Error');
        }
    });
});

app.get('/owner-customers', async (req, res) => {
    const { token } = req.cookies;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) return res.status(403).json({ message: 'Unauthorized' });

        const { id } = userData;

        try {
            const bookings = await Booking.find()
                .populate({
                    path: 'place',
                    match: { owner: id }
                });

            const ownerBookings = bookings.filter(booking => booking.place !== null);
            const uniqueCustomers = Array.from(
                new Map(
                    ownerBookings
                        .filter(booking => booking.user) 
                        .map(booking => [booking.user.toString(), {
                            _id: booking.user.toString(),
                            name: booking.name,
                            phone: booking.phone
                        }])
                ).values()
            );

            res.json({ customers: uniqueCustomers });
        } catch (error) {
            console.error('Error fetching owner customers:', error);
            res.status(500).send('Server Error');
        }
    });
});


app.get('/villa-owner/stats', async (req, res) => {
    const { token } = req.cookies;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) return res.status(403).json({ message: 'Unauthorized' });

        const { id } = userData;
        try {
            const ownerPlaces = await Place.find({ owner: id }).select('_id');
            const placeIds = ownerPlaces.map(place => place._id); 

            const totalBookings = await Booking.countDocuments({ place: { $in: placeIds } });

            const totalUsers = await Booking.distinct('user', { place: { $in: placeIds } }).then(users => users.length);

            const totalEarningsData = await Booking.aggregate([
                { $match: { place: { $in: placeIds } } },
                { $group: { _id: null, totalEarnings: { $sum: '$price' } } }
            ]);
            const totalEarnings = totalEarningsData.length ? totalEarningsData[0].totalEarnings : 0;
            res.json({
                totalVillas: ownerPlaces.length,
                totalBookings,
                totalUsers,
                totalEarnings
            });

        } catch (error) {
            console.error('Error fetching stats:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
});

app.get('/owner/feedbacks', async (req, res) => {
    try {
        // if (req.user.role !== 'owner') {
        //     return res.status(403).json({ message: 'Access denied' });
        // }

        const ownerId = userData.id;
        const feedbacks = await Feedback.find({ ownerId });

        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedbacks' });
    }
});





app.listen(PORT, () => {
    console.log(`✅ Server running on Port ${PORT}`);
});
