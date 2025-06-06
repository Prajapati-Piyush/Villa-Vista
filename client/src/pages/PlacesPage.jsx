import { Link, useParams } from "react-router-dom";
import AccountNav from "../components/AccountNav.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../components/PlaceImg.jsx";

export default function PlacesPage() {
    const [places, setPlaces] = useState([]);
    useEffect(() => {
        axios.get('/user-places').then(({ data }) => {
            setPlaces(data);
        });
    }, []);

    const handleDelete = (placeId) => {
        axios.delete(`/user-places/${placeId}`)
            .then(() => {
                setPlaces(places.filter(place => place._id !== placeId));
    
            })
            .catch((error) => {
                console.error("Error deleting place:", error);
            });
    };

    return (
        <div>
            <AccountNav />
            <div className="text-center">
                <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>
                    Add new place
                </Link>
            </div>
            <div className="mt-4">
                {places.length > 0 && places.map(place => (
                    <Link
                        key={place._id}
                        to={'/account/places/' + place._id}
                        className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl"
                    >
                        <div className="w-32 h-32">
                            <div className="flex w-32 h-32 bg-gray-300 grow shrink-0 object-cover">
                                <PlaceImg place={place} />
                            </div>
                        </div>


                        <div className="grow-0 shrink">
                            <h2 className="text-xl">{place.title}</h2>
                            <p className="text-sm mt-2">{place.description.length > 100
                                ? place.description.slice(0, 600) + '...'
                                : place.description
                            }</p>

                        </div>
                        <button
                                className="bg-red-500 max-w-md mt-10 max-h-sm p-2 rounded-md"
                                
                                onClick={(e) => {
                                    e.preventDefault(); 
                                    handleDelete(place._id);
                                }}
                            >
                                Delete
                            </button>
                    </Link>
                    
                ))}
                
            </div>

        </div>
    );
}