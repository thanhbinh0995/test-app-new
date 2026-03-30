/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
import { GeoLocationMaps } from "./GeoLocationMaps";
import { useState, useEffect } from "react";
import { useGetGeolocation } from "./useGetGeolocation";

function App() {
  const [geoLocation, setGeoLocation] = useState(null);

  const { getGeolocation, isLoading } = useGetGeolocation({
    onSuccess: (position) => {
      setGeoLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    getGeolocation();
  }, []);

  return (
    <div className="App">
      {!isLoading && (
        <GeoLocationMaps
          geoLocation={geoLocation}
          onSelectGeoLocation={setGeoLocation}
        />
      )}
    </div>
  );
}

export default App;
