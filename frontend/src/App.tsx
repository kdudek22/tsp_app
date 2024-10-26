import { MapContainer, TileLayer, Marker, useMapEvents, Polyline} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useState } from 'react';
import WaypointList from './components/WaypointList';
import {Route, Waypoint} from './interfaces/Interfaces';
import L from 'leaflet';
import Solver from "./components/Solver.tsx";
import {requestService, mapServie} from "./services/services.ts";
import CustomMarker from "./components/CustomMarker.tsx";
import ClickListener from "./components/ClickListener.tsx";

function App() {
  // List of waypoints that are visible on the map, Waypoint components use the setter to remove waypoints
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);

  // List of routes that are displayed on the map
  const [displayedRoutes, setDisplayedRoutes] = useState<Route[]>([])

  // The calculated cost matrix - after the routing procedure has been started
  const [durationMatrix, setDurationMatrix] = useState([])


  // This gets the durationMatrix from the api
  const getDurationMatrix = async () => {
    const transformedWaypoints = waypoints.map(waypoint => ({id: waypoint.id, lat: waypoint.latlang.lat, lng: waypoint.latlang.lng}))

    const response = await requestService.post("http://127.0.0.1:8000/api/duration_matrix", transformedWaypoints)

    const data = await response.json()
    setDurationMatrix(JSON.parse(data.response).durations)
  }

  const updateDisplayedRoutes = (route: Route) => {
    setDisplayedRoutes([...displayedRoutes, route])
    return true
  }

  const removeRouteFromDisplayedRoutes = (routeId: string) => {
    setDisplayedRoutes(displayedRoutes.filter(r => r.id !== routeId))
    return true
  }

  return (
    <>
      <div className='w-screen h-screen flex justify-center relative'>
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh', width: '100vw'}}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <ClickListener onClick={(waypoint) => setWaypoints([...waypoints, waypoint])}/>
          {waypoints.map((waypoint, index) => (
            <CustomMarker key={index} waypoint={waypoint}/>
          ))}

          // this displays the route
          {displayedRoutes.map((route, index) => (
              <Polyline key={index} positions={route.points} color={route.color}></Polyline>
          ))}
          // this is the lines between the waypoints
          {waypoints.length >= 2 && <Polyline positions={[...waypoints.map(w => w.latlang), waypoints[0].latlang]} color="gray" />}

        </MapContainer>
      </div>
      <div className="absolute top-0 left-0 z-50 h-screen py-12 ps-3" style={{zIndex: 999}}>
        <div className="overflow-auto max-h-full" style={{background: "rgba(255, 255, 255, 0.5)"}}>
          <WaypointList updateWaypoints={setWaypoints} waypoints={waypoints}></WaypointList>
        </div>
      </div>
      <div className='absolute bottom-0 w-screen py-8 flex justify-center' style={{background: "rgba(255, 255, 255, 0.5)", zIndex: 999}}>
        <button className='bg-green-600 disabled:bg-gray-400 disabled:text-gray-600 py-2 px-6 rounded-xl text-2xl text-white' disabled={waypoints.length < 2} onClick={getDurationMatrix}>Route</button>
      </div>
      <div className="absolute top-0 right-0 py-8 px-4 flex flex-col" style={{background: "rgba(255, 255, 255, 0.5)", zIndex: 999}}>
        <h2>Solvers:</h2>
        <Solver requestToRemoveFromDisplayedRoutes={removeRouteFromDisplayedRoutes} requestToAddToDisplayedRoutes={updateDisplayedRoutes} waypoints={waypoints} durationMatrix={durationMatrix}/>
      </div>
    </>
  )
}

export default App
