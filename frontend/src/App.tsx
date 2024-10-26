import { MapContainer, TileLayer, Marker, useMapEvents, Polyline} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useState } from 'react';
import { icon, LeafletMouseEvent } from 'leaflet';
import WaypointList from './components/WaypointList';
import {Route, Waypoint} from './interfaces/Interfaces';
import { v4 as uuidv4 } from 'uuid';
import L from 'leaflet';
import Solver from "./components/Solver.tsx";


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
  const [displayedRoutes, setDisplayedRoutes] = useState<Route[]>([])
  const [displayedRoutePoints, setDisplayedRoutePoints] = useState<L.latlang>([])
  const [durationMatrix, setDurationMatrix] = useState([])

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

  const sendPostRequest = async (url: string, body: any) => {
    return await fetch(url, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })
  }

  const getRouteFromPoints = async (points: L.latlang) => {
    const response = await sendPostRequest("http://127.0.0.1:8000/api/test", points)

    const data = await response.json()
    const geometries: L.latlang[] = JSON.parse(data.response).features[0].geometry.coordinates
    return geometries
  }


  const getDurationMatrix = async () => {
    const transformedWaypoints = waypoints.map(waypoint => ({id: waypoint.id, lat: waypoint.latlang.lat, lng: waypoint.latlang.lng}))

    const response = await sendPostRequest("http://127.0.0.1:8000/api/duration_matrix", transformedWaypoints)

    const data = await response.json()
    const matrix = JSON.parse(data.response).durations
    setDurationMatrix(matrix)

    // const solver_response = await sendPostRequest("http://127.0.0.1:5000/solve", {matrix: matrix})
    //
    // const solver_data = await solver_response.json()
    // const points_order: number[] = solver_data.solution
    // console.log(solver_data.solution)
    //
    // const route = await getRouteFromPoints(points_order.map(p => transformedWaypoints[p]))
    // setDurationMatrix(matrix)
    // console.log(route)
    // setRoutePoints(route.map(x => ({lat: x[1], lng: x[0]})))
  }

  const sendRouteRequest = async () => {
    const transformedWaypoints = waypoints.map(waypoint => ({id: waypoint.id, lat: waypoint.latlang.lat, lng: waypoint.latlang.lng}))
    console.log(transformedWaypoints)

    const response = await sendPostRequest("http://127.0.0.1:8000/api/test", transformedWaypoints)

    const data = await response.json()
    console.log(data.response)
    const geometries: L.latlang[] = JSON.parse(data.response).features[0].geometry.coordinates
    setDisplayedRoutePoints(geometries.map(x => ({lat: x[1], lng: x[0]})))
  }

  const updateDisplayedRoute = (points: any[]) => {
    setDisplayedRoutePoints(points)
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
          <ClickListener onClick={addWaypoint}/>
          {waypoints.map((waypoint, index) => (
            <CustomMarker key={index} waypoint={waypoint}/>
          ))}
          {waypoints.length >= 2 && <Polyline positions={[...waypoints.map(w => w.latlang), waypoints[0].latlang]} color="gray" />}
          {displayedRoutePoints.length > 0 && <Polyline positions={displayedRoutePoints} color="#5CF64A"></Polyline>}
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
        <Solver requestToSetDisplayedRoute={updateDisplayedRoute} waypoints={waypoints} durationMatrix={durationMatrix}/>
      </div>
    </>
  )
}

export default App
