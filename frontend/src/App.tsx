import { MapContainer, TileLayer, Marker, useMapEvents, Polyline} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useState } from 'react';
import { icon, LeafletMouseEvent } from 'leaflet';
import WaypointList from './components/WaypointList';
import { Waypoint } from './interfaces/Interfaces';
import { v4 as uuidv4 } from 'uuid';
import L from 'leaflet';


type ClickListenerProps = {
  onClick: (latlng: Waypoint) => void
}

const ClickListener = ({onClick}: ClickListenerProps) => {
  useMapEvents({
    click(e: LeafletMouseEvent){
      onClick({id:uuidv4(), latlang: e.latlng})
    }
  })
  return null
}

function App() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [routePoints, setRoutePoints] = useState([])

  const addWaypoint = (waypoint: Waypoint) => {
    setWaypoints([...waypoints, waypoint])
  }

  type MarkerProps = {
    waypoint: Waypoint
  }

  const CustomMarker = ({waypoint}: MarkerProps) => {
    const customIcon = L.divIcon({
      className: `${waypoint.id} custom-marker`,
      html: `<div id=${waypoint.id}></div>`,
      iconSize: [20, 20]
    })
    return <Marker position={waypoint.latlang} icon={customIcon} id={waypoint.id}></Marker>
  }

  const sendRouteRequest = async () => {
    const transformedWaypoints = waypoints.map(waypoint => ({id: waypoint.id, lat: waypoint.latlang.lat, lng: waypoint.latlang.lng}))
    console.log(transformedWaypoints)
    
    const response = await fetch("http://127.0.0.1:8000/api/test", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(transformedWaypoints)
    })

    const data = await response.json()
    const geometries: L.latlang[] = JSON.parse(data.response).features[0].geometry.coordinates
    setRoutePoints(geometries.map(x => ({lat: x[1], lng: x[0]})))
  }

  return (
    <>
      <div className='w-screen h-screen flex justify-center relative'>
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh', width: '100vw'}}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <ClickListener onClick={addWaypoint}/>
          {waypoints.map((waypoint, index) => (
            <CustomMarker key={index} waypoint={waypoint}/>
          ))}
          {waypoints.length >= 2 && <Polyline positions={[...waypoints.map(w => w.latlang), waypoints[0].latlang]} color="gray" />}
          {routePoints.length > 0 && <Polyline positions={routePoints} color="red"></Polyline>}
        </MapContainer>
      </div>
      <div className="absolute top-0 left-0 z-50 h-screen py-12 ps-3" style={{zIndex: 999}}>
        <div className="overflow-auto max-h-full" style={{background: "rgba(255, 255, 255, 0.5)"}}>
          <WaypointList updateWaypoints={setWaypoints} waypoints={waypoints}></WaypointList>
        </div>
      </div>

      <div className='bg-white absolute bottom-0 w-screen py-8 flex justify-center' style={{background: "rgba(255, 255, 255, 0.5)", zIndex: 999}}>
        <button className='bg-green-600 disabled:bg-gray-400 disabled:text-gray-600 py-2 px-6 rounded-xl text-2xl text-white' disabled={waypoints.length < 2} onClick={sendRouteRequest}>Route</button>
      </div>
    </>
  )
}

export default App
