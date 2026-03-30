/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from "react";

export const useGetGeolocation = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = (position) => {
    onSuccess(position);
    setIsLoading(false);
  };

  const handleError = (error) => {
    onError(error);
    setIsLoading(false);
  };

  const getGeolocation = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await navigator.permissions.query({ name: "geolocation" });

      if (["prompt", "granted"].includes(result.state)) {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
          enableHighAccuracy: true,
          maximumAge: 0,
        });
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      handleError(error);
    }
  }, [handleSuccess, handleError]);

  return { getGeolocation, isLoading };
};
