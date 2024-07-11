import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, DistanceMatrixService } from '@react-google-maps/api';
import "../App.css";

const MyGoogleMap = ({ currentLocation, destination, setLocationName, setDistances }) => {
  const mapStyles = {
    height: '500px',
    width: '100%',
  };

  const [directions, setDirections] = useState(null);
  const [center, setCenter] = useState({ lat: -29.311667, lng: 27.481389 });

  useEffect(() => {
    if (currentLocation && destination) {
      calculateDirections();
    }
  }, [currentLocation, destination]);

  const calculateDirections = () => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: currentLocation,
        destination: destination,
        travelMode: 'DRIVING',
        provideRouteAlternatives: true, // Request multiple routes
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections(result);
          setLocationName(`${currentLocation} to ${destination}`);
          calculateDistances(result.routes);
        } else {
          console.error('Directions request failed due to ' + status);
          setLocationName('Route Not Found');
        }
      }
    );
  };

  const calculateDistances = (routes) => {
    const service = new window.google.maps.DistanceMatrixService();
    const origins = [currentLocation];
    const destinations = routes.map(route => route.legs[0].end_location);

    service.getDistanceMatrix(
      {
        origins,
        destinations,
        travelMode: 'DRIVING',
      },
      (response, status) => {
        if (status === 'OK') {
          const distances = response.rows[0].elements.map(element => element.distance.text);
          setDistances(distances);
        } else {
          console.error('Distance Matrix request failed due to ' + status);
        }
      }
    );
  };

  return (
    <div>
      <LoadScript googleMapsApiKey="AIzaSyCfZK9eq1sBWYplK3kxdkE7BJ6JkXGsNWs">
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={12}
          center={center} // Default center if no route is displayed
        >
          {directions && directions.routes.map((route, index) => (
            <DirectionsRenderer
              key={index}
              directions={directions}
              routeIndex={index}
              options={{
                polylineOptions: {
                  strokeColor: index === 0 ? 'blue' : 'gray',
                },
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MyGoogleMap;
