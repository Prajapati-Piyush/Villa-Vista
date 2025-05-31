import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceGallery from "../components/PlaceGallery";
import AddressLink from "../components/AddressLink";
import BookingWidget from "../components/BookingWidget";

const PlacePage = () => {
    const { id } = useParams();
    const [place, setPlace] = useState(null);

    useEffect(() => {
        if (!id) return;
        axios.get(`/places/${id}`).then(response => setPlace(response.data));
    }, [id]);

    if (!place) return null;

    return (
        <div className="mt-4 bg-gray-100 px-4 md:px-8 py-6 md:py-8">
            {/* Title Section */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{place.title}</h1>
            <AddressLink>{place.address}</AddressLink>

            {/* Gallery Section */}
            <PlaceGallery place={place} />

            {/* Main Content Grid */}
            <div className="mt-8 mb-8 grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
                <div>
                    {/* Description Section */}
                    <div className="my-4">
                        <h2 className="font-semibold text-xl md:text-2xl text-gray-800">Description</h2>
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed mt-2">{place.description}</p>
                    </div>

                    {/* Info Section */}
                    <div className="mt-4 text-sm md:text-base text-gray-700">
                        <p>Check-in: <span className="font-bold">{place.checkIn} : 00</span></p>
                        <p>Check-out: <span className="font-bold">{place.checkOut} : 00</span></p>
                        <p>Max guests: <span className="font-bold">{place.maxGuests}</span></p>
                    </div>
                </div>

                {/* Booking Widget Section - Visible on all devices */}
                <div className="md:block flex justify-center">
                    <BookingWidget place={place} />
                </div>
            </div>

            {/* Extra Info Section */}
            <div className="bg-white border-t mt-8 px-4 md:px-8 py-6 md:py-8">
                <h2 className="font-semibold text-xl md:text-2xl text-gray-800">Extra info</h2>
                <div className="mb-4 mt-2 text-sm md:text-base text-gray-700 leading-5">
                    {place.extraInfo}
                </div>
            </div>
        </div>
    );
};

export default PlacePage;