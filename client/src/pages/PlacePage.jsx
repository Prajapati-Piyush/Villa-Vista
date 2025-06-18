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
        if (!id) {
            return;
        }
        axios.get(`/places/${id}`).then(response => {
            setPlace(response.data);
        });
    }, [id]);

    if (!place) return null;

    const PERK_DETAILS = {
        wifi: {
            label: "Wifi",
            icon: (
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                </svg>
            ),
        },
        parking: {
            label: "Free parking spot",
            icon: (
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
            ),
        },
        tv: {
            label: "TV",
            icon: (
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
                </svg>
            ),
        },
        radio: {
            label: "Radio",
            icon: (
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5l16.5-4.125M12 6.75c-2.708 0-5.363.224-7.948.655C2.999 7.58 2.25 8.507 2.25 9.574v9.176A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169A48.329 48.329 0 0012 6.75zM17.25 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zm0 4.5a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                </svg>
            ),
        },
        pets: {
            label: "Pets",
            icon: (
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904" />
                </svg>
            ),
        },
        entrance: {
            label: "Private entrance",
            icon: (
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
            ),
        },
    };


    return (
        <div className="mt-4 bg-gray-100 px-8 py-8">
            {/* Title Section */}
            <h1 className="text-3xl font-bold text-gray-800">{place.title}</h1>
            <AddressLink>{place.address}</AddressLink>

            {/* Gallery Section */}
            <PlaceGallery place={place} />

            {/* Main Content Grid */}
            <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
                <div>
                    {/* Description Section */}
                    <div className="my-4">
                        <h2 className="font-semibold text-2xl text-gray-800">Description</h2>
                        <p className="text-sm text-gray-700 leading-relaxed mt-2">{place.description}</p>
                    </div>

                    {/* Info Section */}
                    <div className="mt-4 text-sm text-gray-700">
                        <p>Check-in: <span className="font-semibold">{place.checkIn}</span></p>
                        <p>Check-out: <span className="font-semibold">{place.checkOut}</span></p>
                        <p>Max number of guests: <span className="font-semibold">{place.maxGuests}</span></p>
                    </div>
                </div>

                {/* Widget Section (For future use like Booking Widget) */}
                <div className="hidden md:block">
                    <BookingWidget place={place} />

                </div>

            </div>

            {place.perks?.length > 0 && (
                <div className="mt-6">
                    <h2 className="font-semibold text-xl md:text-2xl text-gray-800">Perks</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                        {place.perks.map((perk, index) => (
                            <div key={index} className="flex items-center gap-2 border rounded-xl p-3">
                                {PERK_DETAILS[perk]?.icon}
                                <span className="text-gray-700 text-sm md:text-base">
                                    {PERK_DETAILS[perk]?.label || perk}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}



            {/* Extra Info Section */}
            <div className="bg-white border-t mt-8 px-8 py-8">
                <h2 className="font-semibold text-2xl text-gray-800">Extra info</h2>
                <div className="mb-4 mt-2 text-sm md:text-base text-gray-700 leading-6 whitespace-pre-line">
                   {place.extraInfo}
                </div>

            </div>
        </div>
    );
};

export default PlacePage;
