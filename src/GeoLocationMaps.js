/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useUpdateEffect } from "react-use";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

export const GeoLocationMaps = ({
  geoLocation,
  defaultGeoLocation = { longitude: -87.6263, latitude: 41.8758 },
  onSelectGeoLocation,
  forceUpdateLocation,
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (geoLocation?.longitude && geoLocation?.latitude) {
      initializeMap(geoLocation.longitude, geoLocation.latitude);
    } else {
      initializeMap(defaultGeoLocation.longitude, defaultGeoLocation.latitude);
    }
  }, []);

  useUpdateEffect(() => {
    if (
      geoLocation?.longitude &&
      geoLocation?.latitude &&
      forceUpdateLocation
    ) {
      markerRef.current.setLngLat([
        geoLocation.longitude,
        geoLocation.latitude,
      ]);
      mapRef.current.flyTo({
        center: [geoLocation.longitude, geoLocation.latitude],
        essential: true,
      });
    }
  }, [geoLocation?.longitude, geoLocation?.latitude]);

  const initializeMap = (initialLng, initialLat) => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [initialLng, initialLat],
      zoom: 12,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    if (geoLocation?.longitude && geoLocation?.latitude) {
      markerRef.current = new mapboxgl.Marker({ color: "#1e90ff" })
        .setLngLat([initialLng, initialLat])
        .addTo(mapRef.current);
    }

    if (onSelectGeoLocation) {
      mapRef.current.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        onSelectGeoLocation({
          latitude: lat.toFixed(4),
          longitude: lng.toFixed(4),
        });
        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat]);
        } else {
          markerRef.current = new mapboxgl.Marker({ color: "#1e90ff" })
            .setLngLat([lng, lat])
            .addTo(mapRef.current);
        }
      });
    }
  };

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: 500, borderRadius: "8px" }}
    />
  );
};
