import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import MyGoogleMap from './MyGoogleMap';
import Tabs from './Tabs';
import IconSaveButton from './IconSaveButton';
import axios from 'axios';
import trafficSpeedIcon from "../assets/speedometerIcon.png";
import IconLogo from './IconLogo';
import IconGlass from './IconGlass';
import IconTabs from './IconTabs';
import { ClerkProvider, SignInButton, SignedOut, UserButton, SignedIn, useUser } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const MainPage = () => {

  


  const [currentLocation, setCurrentLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [locationName, setLocationName] = useState('');
  const [distances, setDistances] = useState([]);
  const [trafficSpeeds, setTrafficSpeeds] = useState({ speed1: 0, speed2: 0 });
  const [activeTab, setActiveTab] = useState("recents");
  const [isTabColumnVisible, setIsTabColumnVisible] = useState(false);
  const [isBlackAndWhiteTheme, setIsBlackAndWhiteTheme] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    if (window.innerWidth >= 992) {
      setIsTabColumnVisible(true);
    }
  }, []);

  useEffect(() => {
    const fetchTrafficSpeeds = async () => {
      try {
        const [res1, res2, res3, res4] = await Promise.all([
          axios.get('https://h27x0zfg-5000.inc1.devtunnels.ms/traffic_speed/'),
          axios.get('https://h27x0zfg-5000.inc1.devtunnels.ms/traffic_speed2/'),
          axios.get('https://h27x0zfg-5000.inc1.devtunnels.ms/traffic_speed3/'),
          axios.get('https://h27x0zfg-5000.inc1.devtunnels.ms/traffic_speed4/')
        ]);

        const speed1 = (res1.data.traffic_speed + res2.data.traffic_speed2) / 2;
        const speed2 = (res3.data.traffic_speed3 + res4.data.traffic_speed4) / 2;

        // Convert speeds from km/h to m/min
        const speed1_mpm = speed1;
        const speed2_mpm = speed2;

        setTrafficSpeeds({ speed1, speed2, speed1_mpm, speed2_mpm });


      } catch (error) {
        console.error('There was an error fetching the traffic speeds!', error);
      }
    };

    fetchTrafficSpeeds();
    const interval = setInterval(fetchTrafficSpeeds, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup function to avoid memory leaks
  }, []);

  const toggleTabColumn = () => {
    setIsTabColumnVisible(!isTabColumnVisible);
  };

  const handleCurrentLocationChange = (e) => {
    const value = e.target.value;
    setCurrentLocation(value);
    setLocationName(`${value} to ${destination}`);
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    if (currentLocation) {
      setLocationName(`${currentLocation} to ${value}`);
    } else {
      setLocationName(value);
    }
  };

  const handleSaveLocation = async () => {
    try {
      const response = await axios.post('https://h27x0zfg-5000.inc1.devtunnels.ms/recents/', { location: locationName });
      alert(response.data.message);
    } catch (error) {
      console.error('There was an error saving the location!', error);
    }
  };

  const handleThemeChange = () => {
    setIsBlackAndWhiteTheme(!isBlackAndWhiteTheme);
  };

  const formatTime = (minutes) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes); // Add travel time in minutes to current time
    const hours = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minute}`;
  };

  const ETA1 = distances.length > 0 ? formatTime(Math.round((parseInt(distances[0]) * 60) / parseInt(trafficSpeeds.speed1_mpm))) : 'N/A';
  const ETA2 = distances.length > 0 ? formatTime(Math.round((parseInt(distances[1]) * 60) / parseInt(trafficSpeeds.speed2_mpm))) : 'N/A';


  return (
    <>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <header>
          <SignedOut>
            <SignInButton style={{backgroundColor: "#288066", border: "none", color: "#FFFFFF"}}/>
          </SignedOut>
          <SignedIn>
            <UserButton/>
          </SignedIn>
          
        </header>
        <main>
          <div className={`${isBlackAndWhiteTheme ? 'black-and-white-theme' : ''}`}>
            <div className="bg full-height parent-card">
              {/* Upper/Search-Bars Row  */}
              <div className="container upper-row">
                <div className="row" id="parent_col">
                  <div className="col-2 logo">
                    <div style={{ paddingLeft: "23px", color: "#2BAF6A", fontWeight: "100px", width: "100%", marginLeft: "12px" }}>
                      <IconLogo /><p style={{ fontFamily: "sans-serif" }}>TKT Smart Traffic</p>
                    </div>
                  </div>
                  <div className="col-2 input-group-parent" style={{ marginLeft: "0px" }}>
                    <div className="input-group mb-3" style={{ width: "100%" }}>
                      <button
                        className="btn btn-primary d-lg-none"
                        onClick={toggleTabColumn}
                      >
                        {isTabColumnVisible ? <IconTabs /> : <IconTabs />}
                      </button>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Current Location"
                        aria-label="Current Location"
                        value={currentLocation}
                        onChange={handleCurrentLocationChange}

                        id="location_id"
                      />
                      <input
                        type="text"
                        className="form-control margin-input2"
                        placeholder="Destination"
                        aria-label="Destination"
                        value={destination}
                        onChange={handleDestinationChange}
                        // style={{marginLeft: "10px" }}
                        id="destination_id"
                      />
                      &nbsp;
                      <div className="col-1" >
                        <button
                          style={{ border: "none", borderRadius: "100%" }}
                          onClick={handleSaveLocation}
                        >
                          <IconSaveButton />
                        </button>

                      </div>
                      <div className="col">
                        <h3 style={{ fontSize: "20px" }}>{locationName}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Lower Row */}
              <div className="row lower-row">
                {/* Tab Column */}
                {(isTabColumnVisible || window.innerWidth >= 992) && (
                  <div className="col-lg-2 tab-col justify-content-center">
                    <div className="row">
                      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} handleThemeChange={handleThemeChange} />
                    </div>
                  </div>
                )}
                {/* Map Column */}
                <div className="col-lg-8 pt-5 map-col" style={{ marginRight: "15px" }}>
                  <div className="container-sm">
                    <MyGoogleMap
                      currentLocation={currentLocation}
                      destination={destination}
                      setLocationName={setLocationName}
                      setDistances={setDistances}
                    />
                    <div className="pt-5">
                      <div className="card w-100" style={{ width: "980px", border: "none" }}>
                        <ul className="list-group" style={{ backgroundColor: "white" }}>
                          {distances.length > 0 && (
                            <>
                              <li className="list-group-item justify-content-center suggest-tab">
                                Main North Rd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <img src={trafficSpeedIcon} alt="Traffic Speed Icon" style={{ width: "20px", height: "20px" }} />&nbsp;&nbsp;&nbsp;{Math.round(trafficSpeeds.speed1)} km/h
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Distance:&nbsp;&nbsp;{distances[0]} away&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Arrival Time: {ETA1}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<IconGlass />{Math.round((parseInt(distances[0]) * 60) / parseInt(trafficSpeeds.speed1_mpm))} min
                              </li>
                              <li className="list-group-item suggest-tab">
                                Airport Rd &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <img src={trafficSpeedIcon} alt="Traffic Speed Icon" style={{ width: "20px", height: "20px" }} />&nbsp;&nbsp;&nbsp;{Math.round(trafficSpeeds.speed2)} km/h &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                Distance:&nbsp;&nbsp;{distances[1]} away &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Arrival Time: {ETA2}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<IconGlass />{(Math.round((parseInt(distances[1]) * 60) / parseInt(trafficSpeeds.speed2_mpm)))} min
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Empty Column */}
                <div className="col-lg-2"></div>
              </div>
            </div>
          </div>
        </main>
      </ClerkProvider>
    </>
  );
};

export default MainPage;
