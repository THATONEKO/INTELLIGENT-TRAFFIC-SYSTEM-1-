import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import IconRecentsTab from "./IconRecentsTab";
import IconCustomize from "./IconCustomize";
import IconSavedTab from "./IconSavedTab";
import IconTraveled from "./IconTraveled";
import DeleteData from "./DeleteData";
import IconTheme from "./IconTheme";

const Tabs = ({ activeTab, setActiveTab, handleThemeChange }) => {
  const [recentLocations, setRecentLocations] = useState([]);

  useEffect(() => {
    fetchRecentLocations(activeTab);
  }, [activeTab]);

  const fetchRecentLocations = async (activetabs) => {
    try {
      const response = await axios.get(`https://h27x0zfg-5000.inc1.devtunnels.ms/${activetabs}/`);
      console.log(response.data);
      setRecentLocations(response.data);
    } catch (error) {
      console.error('Error fetching recent locations:', error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleDelete = async (location) => {
    try {
      await axios.delete(`https://h27x0zfg-5000.inc1.devtunnels.ms/${activeTab}/${location}`); // Replace with your Flask backend URL
      fetchRecentLocations(activeTab); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  // const [isBlackAndWhiteTheme, setIsBlackAndWhiteTheme] = useState(false);

  // const handleThemeChange = () => {
  //   setIsBlackAndWhiteTheme(!isBlackAndWhiteTheme); 
  // };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
      <ul
        className="list-group mg"
        style={{ width: "200px", border: "none", borderRadius: "0%", paddingTop: "48px" }}
      >
        <li
          className={`list-group-item ${
            activeTab === "recents" ? "current-tab" : ""
          } custom-list-group`}
          aria-current={activeTab === "recents"}
          onClick={() => handleTabClick("recents")}
        >
          <IconRecentsTab />&nbsp;&nbsp;&nbsp;Recent
        </li>
        <li
          className={`list-group-item ${
            activeTab === "marked" ? "current-tab" : ""
          } custom-list-group`}
          onClick={() => handleTabClick("marked")}
        >
          <IconSavedTab />&nbsp;&nbsp;&nbsp;Marked
        </li>
        {/* <li
          className={`list-group-item ${
            activeTab === "Traveled" ? "current-tab" : ""
          } custom-list-group`}
          onClick={() => handleTabClick("Traveled")}
        >
          <IconTraveled />&nbsp;&nbsp;&nbsp;Traveled
        </li> */}
        <li
      className={`list-group-item ${
        activeTab === "Customize" ? "current-tab" : ""
      } custom-list-group`}
      onClick={() => setActiveTab("Customize")}
    >
      <IconCustomize />&nbsp;&nbsp;&nbsp;Customize
    </li>
        
      </ul>
      <div className="row " style={{ paddingTop: "12px" }}>
             <div className="card display-card" style={{ width: "200px" }}>
      
      <ul className="list-group list-group-flush">
      
      {activeTab}
        {recentLocations.map((location, index) => activeTab !== "Customize" && (
          <li key={index} className="list-group-item custom-list-group2 list-group">
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto" }}>
              {location}
              <DeleteData onDelete={() => handleDelete(location)} />
            </div>
          </li>
        ))}
        {activeTab === "Customize" && (
                   <>
                     <li className="list-group-item custom-list-group2">
                       <h5>Customize</h5>
                     </li>
                     <li className="list-group-item custom-list-group2">
                       <button style={{border: "none", backgroundColor: "#D9D9D9"}}onClick={handleThemeChange}>
                         <IconTheme/>
                       </button>
                     </li>
                   </>
                 )}
      </ul>
    </div>
    </div>
    </div>
  );
};

export default Tabs;
