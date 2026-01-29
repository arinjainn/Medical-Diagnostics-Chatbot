import React, { useEffect, useState } from "react";

const NearbyHospitals = () => {
  const [location, setLocation] = useState<{ lat: number; long: number } | null>(null);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        },
        (err) => {
          setError("Unable to retrieve your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (location) {
      const fetchHospitals = async () => {
        const apiKey = 'rruWPj059PWEoTLa5YI89kvg4ON1NjL2h8oLnLqalhw';
        const endpoint = `https://discover.search.hereapi.com/v1/discover?at=${location.lat},${location.long}&q=hospital&limit=5&apiKey=${apiKey}`;
        
        try {
          const response = await fetch(endpoint);
          if (response.ok) {
            const data = await response.json();
            setHospitals(data.items);
          } else {
            setError("Unable to fetch hospitals.");
          }
        } catch (error) {
          console.error('Error fetching hospitals:', error);
          setError("Error fetching hospitals.");
        }
      };
      fetchHospitals();
    }
  }, [location]);

  return (
    <div>
      <h1>Nearby Hospitals</h1>
      {error && <p>{error}</p>}
      {!error && !location && <p>Loading location...</p>}
      {location && hospitals.length === 0 && <p>No hospitals found nearby.</p>}
      {hospitals.length > 0 && (
        <ul>
          {hospitals.map((hospital, index) => (
            <li key={index}>
              {hospital.title} - {hospital.address.label} (Distance: {hospital.distance} meters)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NearbyHospitals;
