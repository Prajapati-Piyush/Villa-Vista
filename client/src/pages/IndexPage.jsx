import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useOutletContext } from "react-router-dom";
import Image from "../components/Image";

export default function IndexPage() {
  const { searchInput } = useOutletContext(); // Get search input from Layout
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/places')
      .then(response => {
        setPlaces(response.data);
        setFilteredPlaces(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the places:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const result = places.filter(place =>
      place.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      place.address.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredPlaces(result);
  }, [searchInput, places]);

  return (
    <div>
      {loading ? (
        <div className="grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-300 rounded-2xl h-48"></div>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map(place => (
              <Link 
                to={'/place/' + place._id} 
                key={place._id}
                className="block transform transition duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="bg-gray-500 mb-2 rounded-2xl flex overflow-hidden relative group">
                  {place.photos?.[0] && (
                    <Image
                      className="rounded-2xl object-cover aspect-square w-full transition-transform duration-300 group-hover:scale-110"
                      src={place.photos?.[0]}
                      alt=""
                    />
                  )}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
                <h2 className="font-bold text-lg">{place.address}</h2>
                <h3 className="text-sm text-gray-500">{place.title}</h3>
                <div className="mt-1 text-gray-700">
                  <span className="font-bold text-lg">₹{place.price}</span> per night
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
