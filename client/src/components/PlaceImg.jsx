import Image from "./Image.jsx";

export default function PlaceImg({ place, index = 0, className = null }) {
  if (!place.photos?.length) {
    return '';
  }
  if (!className) {
    className = 'object-cover'; // Default to object-cover to maintain aspect ratio while filling the container
  }

  return (
    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>  {/* 16:9 aspect ratio */}
      <Image 
        className={`absolute top-0 left-0 w-full h-full ${className}`} 
        src={place.photos[index]} 
        alt="" 
      />
    </div>
  );
}
