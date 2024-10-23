import { MapContainer, TileLayer, Marker, useMapEvents, Polyline} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useState } from 'react';


const ClickListener = ({onClick}) => {
  const map = useMapEvents({
    click(e){
      onClick(e.latlng)
    }
  })
  return null
}

function App() {

  const [waypoints, setWaypoints] = useState([]);


  const addWaypoint = (waypoint) => {
    setWaypoints([...waypoints, waypoint])
    console.log(waypoints)
  }


  return (
    <>
      <div className='w-screen h-screen flex justify-center pb-8'>
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh', width: '100vw'}}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <ClickListener onClick={addWaypoint}/>

          {waypoints.map((waypoint, index) => (
            <Marker position={waypoint}></Marker>
          ))}
          {waypoints.length >= 2 && <Polyline positions={waypoints} color="gray" />}

        </MapContainer>
      </div>
      <div className="absolute top-0 left-0 z-50 h-screen py-12 ps-3" style={{zIndex: 999}}>
        <div className="overflow-auto max-h-full" style={{background: "rgba(255, 255, 255, 0.5)"}}>
          {waypoints.map((waypoint, index) => (
              <p className="py-8">Waypoint: {index} {waypoint.lat} - {waypoint.lng}</p>
            ))}
        </div>
      </div>
    </>
  )
}

export default App
