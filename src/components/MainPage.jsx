import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import MyGoogleMap from './MyGoogleMap';
import Tabs from './Tabs';
import IconSaveButton from './IconSaveButton';
import axios from 'axios';
import trafficSpeedIcon from "../assets/speedometerIcon.png";
// import IconTheme from './components/IconTheme';
import IconLogo from './IconLogo';


function MainPage() {
  const [currentLocation, setCurrentLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [locationName, setLocationName] = useState('');
  const [activeTab, setActiveTab] = useState("recents");
  const [isTabColumnVisible, setIsTabColumnVisible] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 992) {
      setIsTabColumnVisible(true);
    }
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
      const response = await axios.post('http://192.168.1.53:5000/recents/', { location: locationName });
      alert(response.data.message);
    } catch (error) {
      console.error('There was an error saving the location!', error);
    }
  };
  const [isBlackAndWhiteTheme, setIsBlackAndWhiteTheme] = useState(false);

  const handleThemeChange = () => {
    setIsBlackAndWhiteTheme(!isBlackAndWhiteTheme); 
  };

  return (
    <div className={` ${isBlackAndWhiteTheme ? 'black-and-white-theme' : ''}`}>
    <div className="bg full-height">
      <div className="container upper-row p-5">
        <div className="row">
        <div className="col" style={{paddingLeft: "0px"}}>
        <div style={{paddingLeft: "23px", color: "#2BAF6A", fontWeight: "100px"}}>
        <IconLogo/><p style={{fontFamily: "sans-serif"}}>TKT Smart Traffic</p>
        </div>
      </div>
          <div  className="col" style={{marginRight: "0px"}}>
            <div className="input-group mb-3" style={{width: "800px"}}>
              <button
                className="btn btn-primary d-lg-none"
                onClick={toggleTabColumn}
              >
                {isTabColumnVisible ? "Hide Tabs" : "Show Tabs"}
              </button>
              <input
                type="text"
                className="form-control"
                placeholder="Current Location"
                aria-label="Current Location"
                value={currentLocation}
                onChange={handleCurrentLocationChange}
                style={{ width: "191px" }}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Destination"
                aria-label="Destination"
                value={destination}
                onChange={handleDestinationChange}
                style={{ width: "191px", marginLeft: "10px" }}
              />
              &nbsp;
              <button 
                style={{ border: "none", borderRadius: "100%" }}
                onClick={handleSaveLocation}
              >
                <IconSaveButton />
              </button>
            </div>
          </div>
          <div className="col">
            <h3>{locationName}</h3>
          </div>
        </div>
      </div>

      <div className="row lower-row">
        {(isTabColumnVisible || window.innerWidth >= 992) && (
          <div className="col-lg-2">
            <div className="row justify-content-center">
              <Tabs activeTab={activeTab} setActiveTab={setActiveTab} handleThemeChange={handleThemeChange} />
            </div>
          </div>
        )}

        <div className="col-lg-8 pt-5">
          <div className="container-sm">
            <MyGoogleMap currentLocation={currentLocation} destination={destination} setLocationName={setLocationName} />
            <div className="pt-5">
              <div className="card w-100" style={{ width: "980px", border: "none" }}>
                <ul className="list-group" style={{ backgroundColor: "white" }}>
                  <li className="list-group-item justify-content-center suggest-tab">
                    Main North Rd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <img src={trafficSpeedIcon} alt="Traffic Speed Icon" style={{ width: "20px", height: "20px" }} />&nbsp;&nbsp;&nbsp;45 km/h
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8.2 km away &nbsp;&nbsp;&nbsp;(19 min) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 11:39 AM
                  </li>
                  <li className="list-group-item suggest-tab">
                    Airport Rd &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <img src={trafficSpeedIcon} alt="Traffic Speed Icon" style={{ width: "20px", height: "20px" }} />&nbsp;&nbsp;&nbsp;km/h &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    10.6 km away &nbsp;&nbsp;&nbsp;(26 min) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 12:05 AM
                  </li>
                  {/* <li className="list-group-item suggest-tab">
                    Moshoeshoe Rd &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <img src={trafficSpeedIcon} alt="Traffic Speed Icon" style={{ width: "20px", height: "20px" }} />&nbsp;&nbsp;&nbsp;28 km/h &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    7.3 km away (32 min) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 12:11 AM
                  </li> */}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-2"></div>
      </div>
    </div>
    </div>
  );
}

export default MainPage;