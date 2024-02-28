import React, { useRef, useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  LayerGroup,
  Circle,
  
} from "react-leaflet";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import airplaneIcon from './airplane.png'
import L from 'leaflet'


function Map() {

  const icon = L.icon({
    iconSize: [45,45],
    pupupAnchor: [2,-20],
    iconUrl: airplaneIcon,
  })

  const mapRef = useRef(null);
  const latitude = 51.505;
  const longitude = -0.09;

  const greenOptions = { color: "green", fillColor: "green" };

  const url = "https://api.wheretheiss.at/v1/satellites/25544";

  const [mLat, setMlat] = useState("");
  const [mLong, setMlong] = useState("");
  const [vel, setVel] = useState("");
  const [alt, setAlt] = useState("");


  const getPosition = async () => {
    await axios
      .get(url)
      .then((res) => {
        setMlat(res.data.latitude);
        setMlong(res.data.longitude);
        setVel(res.data.velocity);
        setAlt(res.data.altitude);
        console.log(res.data)
        let postn = [res.data.latitude, res.data.longitude];
        console.log(postn)
      })
    
      
    }

  const eventHandler = () => {
    setInterval(getPosition, 10000);
  
  };

  const eventHandlerC = () => {
    clearInterval(getPosition);
  };

  return (
    <div>
      <div id="map">
        <button type="button" onClick={() => eventHandler()}>
          Start Tracking
        </button>
        <button type="button" onClick={() => eventHandlerC()}>
          Stop
        </button>

        <h3>
          ISS Satellite: Current Latitude: {Number(mLat).toFixed(3)} Longitude:{" "}
          {Number(mLong).toFixed(3)} Velocity: {Number(vel).toFixed(2)}{" "}
          Altitude: {Number(alt).toFixed(2)} Km
        </h3>
        <MapContainer
          className="mapcont"
          center={[latitude, longitude]}
          zoom={3}
          ref={mapRef}
          style={{ height: "80vh", width: "100vw" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LayerGroup>
            <Circle
              center={[mLat, mLong]}
              pathOptions={greenOptions}
              radius={100000}
            />

            <LeafletTrackingMarker
              icon = {icon}
              
              position={[mLat, mLong]}
              duration={1000}
              keepAtCenter={true}
            ></LeafletTrackingMarker>
          </LayerGroup>

          {/* Additional map layers or components can be added here */}
        </MapContainer>
      </div>
    </div>
  );
}

export default Map;

//  const [prevPos, setPrevPos]=useState([])
/*  .then(
        
        setPrevPos((postn) => {
         console.log(prevPos)
          return {
            ...prevPos,
            postn,
          };
        }))*/