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
import sendMail from './utils/sendEmail.js';
import Razorpay from 'razorpay';
import bodyParser from 'body-parser';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

const _dirname = path.resolve();

const bcryptSalt = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
const jwtSecret = process.env.JWT_SECRET;



app.use(express.json());

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
const photosMiddleware = multer({ dest: 'uploads/' });

app.use(cors({
    // origin: "http://localhost:5173", for local 
    origin: "https://frontend-6jzn.onrender.com",
    credentials: true,
}));
app.use(cookieParser());

app.use('/uploads', express.static(__dirname + '/uploads'));


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
    console.log("Token Recieved : ", token);
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
};


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

        const otp = Math.floor(100000 + Math.random() * 900000);

        await sendMail(email, 'Your OTP Code for Registration', `Your OTP code is: ${otp}`);

        userDoc.otp = otp;
        userDoc.otpExpiration = Date.now() + 60000;
        await userDoc.save();


        res.status(201).json({ message: 'Registration successful. OTP sent to your email for verification.' });

    } catch (e) {
        console.error('Error registering user:', e);
        res.status(422).json({ message: 'Registration failed. Please try again later.' });
    }
});

app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (Number(user.otp) !== Number(otp)) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpiration < Date.now()) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new OTP' })
        }
        console.log(`OTP Expiration: ${user.otpExpiration}, Current Time: ${Date.now()}`);

        user.verified = true;
        await user.save();
        res.status(200).json({
            message: 'OTP verified successfully!',
            otpExpiration: user.otpExpiration
        }
        );
    } catch (error) {
        console.error('Error verifying OTP:', e);
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
})

app.post('/resend-otp', async (req, res) => {
    const { email } = req.body;

    try {
        console.log("🔄 Resend OTP requested for:", email);

        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found:", email);
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        console.log("✅ New OTP generated:", otp);

        user.otp = otp;
        user.otpExpiration = Date.now() + 60000;
        await user.save();
        console.log("✅ OTP saved in database:", user.otp);

        // Send the OTP via email
        await sendMail(email, 'Your OTP Code for Verificatioin', `Your OTP code is: ${otp}`);

        res.status(200).json({ message: 'OTP resent successfully. Please check your email.' });

    } catch (err) {
        console.error("❌ Error in resend-otp route:", err);
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
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
        const decode=bcrypt.decodeBase64(userDoc.password);
        console.log(decode)
        if (!passOk) {
            return res.status(422).json({ message: 'Incorrect password' });
        }

        if (userDoc.verified !== true) {
            return res.status(422).json({ message: 'Please verify your email first by Registration' });
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
                // res.cookie('token', token).json(userDoc);
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                }).json(userDoc);

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
    console.log("Token Recieved : ", token);
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
    console.log("Token Recieved : ", token);
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
    console.log("Token Recieved : ", token);
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const { id } = userData;
        res.json(await Place.find({ owner: id }));
    });
});

app.delete('/user-places/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Place.findByIdAndDelete(id);
        res.json({ success: true, message: "Place deleted successfully" });
    } catch (error) {
        console.error("Error deleting place:", error);
        res.status(500).json({ success: false, message: "Error deleting place" });
    }
});

app.get('/places/:id', async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id));
});

app.put('/places', async (req, res) => {
    const { token } = req.cookies;
    console.log("Token Recieved : ", token);
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

app.get('/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id)
        const bookings = await Booking.find({ place: id });

        // Extract booked dates
        let bookedDates = [];
        bookings.forEach(booking => {
            let currentDate = new Date(booking.checkIn);
            while (currentDate <= new Date(booking.checkOut)) {
                bookedDates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });

        res.json(bookedDates);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch bookings!" });
    }
})


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


app.post("/create-order", async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, // Amount in paisa (₹1 = 100 paisa)
            currency: "INR",
            receipt: `receipt_${Math.random()}`,
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);
        console.log("Order Created:", order); // ✅ Debugging ke liye

        res.status(201).json(order); // ✅ Ensure response is sent
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Failed to create order" }); // ✅ Return error response
    }
});


app.post('/bookings', async (req, res) => {
    try {
        const userData = await getUserDataFromReq(req);
        const { place, checkIn, checkOut, numberOfGuests, name, phone, price, paymentId } = req.body;

        if (!paymentId) {
            return res.status(400).json({ error: "Payment ID is required." });
        }

        // Create the booking
        const doc = await Booking.create({
            place, checkIn, checkOut, numberOfGuests, name, phone, price,
            user: userData.id,
            paymentId
        });

        const emailSubject = 'Booking Confirmation';
        const textContent = 'Your booking has been confirmed.\nCheck your email for more details.';
        const emailText = `
            <h2>Booking Confirmation</h2>
            <p>Hi <strong>${name}</strong>,</p>
            <p>Thank you for booking with us! Your booking details are as follows:</p>
            <table border="1" cellpadding="8" style="border-collapse: collapse;">
                <tr>
                    <th style="text-align: left;">Place</th>
                    <td>${place}</td>
                </tr>
                <tr>
                    <th style="text-align: left;">Check-In Date</th>
                    <td>${checkIn}</td>
                </tr>
                <tr>
                    <th style="text-align: left;">Check-Out Date</th>
                    <td>${checkOut}</td>
                </tr>
                <tr>
                    <th style="text-align: left;">Number of Guests</th>
                    <td>${numberOfGuests}</td>
                </tr>
                <tr>
                    <th style="text-align: left;">Contact Number</th>
                    <td>${phone}</td>
                </tr>
                <tr>
                    <th style="text-align: left;">Total Price</th>
                    <td>${price}</td>
                </tr>
            </table>
            <p>If you have any questions or need to make changes to your booking, please don’t hesitate to contact us.</p>
            <p>We look forward to welcoming you!</p>
            <p>Best Regards,<br/>Your Booking Team</p>
        `;

        await sendMail(userData.email, emailSubject, textContent, emailText);

        console.log('Booking email sent successfully!');
        res.json(doc);

    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error while booking');
    }
});

app.get('/bookings', async (req, res) => {
    const userData = await getUserDataFromReq(req);
    res.json(await Booking.find({ user: userData.id }).populate('place').populate('user', 'email'));
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
            villa: booking.place?.title || 'Unknown',

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

app.post('/request-cancel-booking', async (req, res) => {
    const { bookingId } = req.body;

    try {
        const userData = await getUserDataFromReq(req);
        const email = userData.email;

        if (!email) {
            return res.status(400).json({ message: 'User email not found' });
        }
        console.log('email : ', email);

        const booking = await Booking.findOne({ _id: bookingId, user: userData.id });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        booking.otp = otp;
        booking.otpExpiration = Date.now() + 30000;
        booking.otpVerified = false;
        await booking.save();

        await sendMail(email, 'Your OTP for Booking Cancellation', `Your OTP code is: ${otp}`);

        res.status(200).json({ message: 'OTP sent to your email. Please verify it to cancel the booking.' });

    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
});

app.post('/verify-cancel-booking', async (req, res) => {
    const { bookingId, otp } = req.body;

    const userData = await getUserDataFromReq(req);

    try {
        const userData = await getUserDataFromReq(req);
        const email = userData.email;
        const booking = await Booking.findOne({ _id: bookingId, user: userData.id });

        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (Number(booking.otp) !== Number(otp)) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (booking.otpExpiration < Date.now()) {
            return res.status(400).json({ message: 'OTP expired, please request a new one' });
        }

        const response = await Booking.deleteOne({ _id: bookingId });
        if (response.deletedCount > 0) {
            await sendMail(email, 'Your Booking Cancellation', 'Your Booking has been cancelled successfully.', 'Your money will be refunded in 3-5 working days.');
        }
        res.status(200).json({ message: 'Booking cancelled successfully' });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});
;

app.post('/resend-cancel-otp', async (req, res) => {
    console.log("Request received:", req.body);
    const { bookingId } = req.body;
    try {
        const userData = await getUserDataFromReq(req);
        const email = userData.email;

        if (!email) {
            return res.status(400).json({ message: 'User email not found' });
        }

        const booking = await Booking.findOne({ _id: bookingId, user: userData.id });
        console.log(bookingId, email)

        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const otp = Math.floor(100000 + Math.random() * 900000);
        booking.otp = otp;
        booking.otpExpiration = Date.now() + 30000; // 1 min expiry
        await booking.save();

        await sendMail(email, 'Your New OTP for Booking Cancellation', `Your new OTP is: ${otp}`);

        res.status(200).json({ message: 'New OTP sent to your email' });

    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});


app.get('/owner-bookings', async (req, res) => {
    const { token } = req.cookies;
    console.log("Token Recieved : ", token);
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
    console.log("Token Recieved : ", token);

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

        const ownerId = userData.id;
        const feedbacks = await Feedback.find({ ownerId });

        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedbacks' });
    }
});



// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(_dirname, "../client/dist")));

//     app.get("*", (req, res) => {
//         res.sendFile(path.join(_dirname, "../client", "dist", "index.html"));
//     })
// }

app.listen(PORT, () => {
    console.log(`✅ Server running on Port ${PORT}`);
});
