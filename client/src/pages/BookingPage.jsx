import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddressLink from "../components/AddressLink.jsx";
import PlaceGallery from "../components/PlaceGallery.jsx";
import BookingDates from "../components/BookingDates.jsx";

export default function BookingPage() {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    
    useEffect(() => {
        if (id) {
            axios.get('/bookings').then(response => {
                const foundBooking = response.data.find(({ _id }) => _id === id);
                if (foundBooking) {
                    setBooking(foundBooking);
                }
            });
        }
    }, [id]);

    if (!booking) {
        return '';
    }

    return (
        <div className="my-8 px-4 md:px-8 lg:px-16">
            <h1 className="text-3xl font-semibold text-gray-800">{booking.place.title}</h1>
            <AddressLink className="my-2 block text-blue-600">{booking.place.address}</AddressLink>

            <div className="bg-gray-100 p-6 my-6 rounded-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-0 shadow-lg">
                <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your booking information:</h2>
                    <BookingDates booking={booking} />
                </div>
                <div className="bg-primary p-6 text-white rounded-2xl shadow-md flex-none">
                    <div className="text-xl">Total price</div>
                    <div className="text-3xl font-bold">${booking.price}</div>
                </div>
            </div>

            <PlaceGallery place={booking.place} />
        </div>
    );
}
