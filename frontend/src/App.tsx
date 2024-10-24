import { MapContainer, TileLayer, Marker, useMapEvents, Polyline} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useState } from 'react';
import { LeafletMouseEvent } from 'leaflet';
import WaypointList from './components/WaypointList';
import { Waypoint } from './interfaces/Interfaces';

type ClickListenerProps = {
  onClick: (latlng: L.LatLng) => void
}

const ClickListener = ({onClick}: ClickListenerProps) => {
  useMapEvents({
    click(e: LeafletMouseEvent){
      onClick(e.latlng)
    }
  })
  return null
}

function App() {
  const [waypoints, setWaypoints] = useState<L.LatLng[]>([]);

  const addWaypoint = (waypoint: L.LatLng) => {
    setWaypoints([...waypoints, waypoint])
    console.log([...waypoints, waypoints[0]])
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
            <Marker key={index} position={waypoint} style={{background: "rgba(255, 255, 255, 0.5)"}}/>
          ))}
          {waypoints.length >= 2 && <Polyline positions={[...waypoints, waypoints[0]]} color="gray" />}
        </MapContainer>
      </div>
      <div className="absolute top-0 left-0 z-50 h-screen py-12 ps-3" style={{zIndex: 999}}>
        <div className="overflow-auto max-h-full" style={{background: "rgba(255, 255, 255, 0.5)"}}>
          <WaypointList updateWaypoints={setWaypoints} waypoints={waypoints}></WaypointList>

        </div>
      </div>
    </>
  )
}

export default App
