import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import PlacesPage from '../../pages/PlacesPage';
import { Link } from 'react-router-dom';
import PlaceImg from '../PlaceImg';
import { UserContext } from '../../contexts/UserContext';

const VillasPage = () => {
  const [places, setPlaces] = useState([]);

  const { user } = useContext(UserContext)

  useEffect(() => {
    if (user.role === 'admin') {
      axios.get('/all-villas').then(({ data }) => {
        setPlaces(data);
      });
    }
  }, []);


  return (
    <div className="mt-4">
      {places.length > 0 && places.map(place => (
        <Link
          key={place._id}
          to={`/admin/places/${place._id}`}
          className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl"
        >
          <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
            <PlaceImg place={place} />
          </div>
          <div className="grow-0 shrink">
            <h2 className="text-xl">{place.title}</h2>
            {place.owner && (
              <p className="text-sm mt-2 text-gray-500">Owner: {place.owner.name.toUpperCase()}</p>
            )}
            <p className="text-sm mt-2">
              {place.description.length > 100
                ? place.description.slice(0, 400) + '...'
                : place.description
              }
            </p>

          </div>
        </Link>
      ))}
    </div>

  );
};

export default VillasPage;
