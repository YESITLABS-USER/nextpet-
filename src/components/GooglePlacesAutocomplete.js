import { useEffect, useRef } from 'react';
import Script from 'next/script';

const GooglePlacesAutocomplete = ({ onLocationSelect, edit, getAddress }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const initializeAutocomplete = () => {
      if (!window.google) return;
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address;
          onLocationSelect(lat, lng, address); // Pass the lat and lng to the parent component
        }
      });
    };

    if (window.google) {
      initializeAutocomplete();
    }
  }, [onLocationSelect]);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&key=AIzaSyC9NuN_f-wESHh3kihTvpbvdrmKlTQurxw&libraries=places`}
        strategy="lazyOnload"
        onLoad={() => console.log('Google Maps API loaded')}
      />
      <div>
        <input ref={inputRef} id="address" type="text" placeholder={getAddress? getAddress : "Enter address"} disabled={!edit}  />
      </div>
    </>
  );
};

export default GooglePlacesAutocomplete;
