import { MapContainer, TileLayer, Polyline} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import {useEffect, useState} from 'react';
import WaypointList from './components/WaypointList';
import {Route, Waypoint} from './interfaces/Interfaces';
import {ArrowUturnLeftIcon, Cog6ToothIcon} from "@heroicons/react/24/outline";


import Solver from "./components/solvers/Solver.tsx";
import {requestService} from "./services/services.ts";
import CustomMarker from "./components/CustomMarker.tsx";
import ClickListener from "./components/ClickListener.tsx";
import BasicSolver from "./components/solvers/BasicSolver.tsx";
import PythonSolver from "./components/solvers/PythonSolver.tsx";
import Settings from "./components/Settings.tsx";
import BottomMenu from "./components/BottomMenu.tsx";
import SolversList from "./components/SolversList.tsx";


function App() {
  // List of waypoints that are visible on the map, Waypoint components use the setter to remove waypoints
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);

  // List of routes that are displayed on the map
  const [displayedRoutes, setDisplayedRoutes] = useState<Route[]>([])

  // The calculated cost matrix - after the routing procedure has been started
  const [durationMatrix, setDurationMatrix] = useState<[[number]]>([[]])

  const [waypointMapping, setWaypointMapping] = useState<Map<string, number>>(new Map())

  const [waypointNumber, setWaypointNumber] = useState(0)

  const [defaultWaypointMapping, setDefaultWaypointMapping] = useState<Map<string, number>>(new Map())

  // this useEffect updates the waypoint numbers displayed on the map, when a user chooses a route, its ordering is displayed
  useEffect(() => {
    const defaultMap = new Map(waypoints.map(waypoint => [waypoint.id, waypoint.orderNumber!]))
    setWaypointMapping(defaultMap)
    setDefaultWaypointMapping(defaultMap)
  }, [waypoints]);


  // This gets the durationMatrix from the api
  const getDurationMatrix = async () => {
    const transformedWaypoints = waypoints.map(waypoint => ({id: waypoint.id, lat: waypoint.latlang.lat, lng: waypoint.latlang.lng}))

    const response = await requestService.post("http://127.0.0.1:8000/api/duration_matrix", transformedWaypoints)

    const data = await response.json()
    setDurationMatrix(JSON.parse(data.response).durations)
  }

  // this is responsible for updating the displayed routes, also used in color changing
const updateDisplayedRoutes = (route: Route) => {
  setDisplayedRoutes(prevDisplayedRoutes => {
    if (prevDisplayedRoutes.some(r => r.id === route.id)) {
      return prevDisplayedRoutes.map(r =>
        r.id === route.id ? { ...r, color: route.color } : r
      );
    } else {

      return [...prevDisplayedRoutes, route];
    }
  });
};

  const removeRouteFromDisplayedRoutes = (routeId: string) => {
    setDisplayedRoutes(displayedRoutes.filter(r => r.id !== routeId))
  }

  const addWaypoint = (waypoint) => {
    waypoint = {...waypoint, orderNumber: waypointNumber}
    setWaypointNumber(prevState => prevState + 1)
    setWaypoints([...waypoints, waypoint])
  }

  return (
    <>
      <div className='w-screen h-screen flex justify-center relative'>
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh', width: '100vw'}}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <ClickListener onClick={(waypoint) => addWaypoint(waypoint)}/>

          {/* this displays the waypoints, and their numbers */}
          {waypoints.map((waypoint, index) => (
            <CustomMarker orderNumber={waypointMapping.get(waypoint.id)!} key={index} waypoint={waypoint}/>
          ))}

          {/* this displays the route */}
          {displayedRoutes.map((route, index) => (
              <Polyline key={route.id + route.color} positions={route.points} color={route.color}></Polyline>
          ))}

          {/* this is the lines between the waypoints */}
          {waypoints.length >= 2 && <Polyline positions={[...waypoints.map(w => w.latlang), waypoints[0].latlang]} color="gray" />}

        </MapContainer>
      </div>
      <div className="absolute top-0 left-0 z-50 py-24 ms-3" style={{zIndex: 500}}>
        <div>
          <div>
            <Settings/>
          </div>
          <div className="mt-4 overflow-auto " style={{background: "rgba(255, 255, 255, 0.7)", maxHeight: "65vh"}}>
            <WaypointList updateWaypoints={setWaypoints} waypoints={waypoints}></WaypointList>
          </div>
        </div>

      </div>
      <div className="absolute bottom-0 mb-2" style={{left: "50%", zIndex: 999, transform: "translateX(-50%)"}}>
        <BottomMenu onClick={getDurationMatrix} disableButton={waypoints.length < 2}/>
      </div>
      {/* This is used to render the used solvers */}
      <div className="absolute top-0 right-0" style={{zIndex: "999"}}>
        <SolversList waypoints={waypoints} durationMatrix={durationMatrix} removeRouteFromDisplayedRoutes={removeRouteFromDisplayedRoutes} updateDisplayedRoutes={updateDisplayedRoutes}/>
      </div>
    </>
  )
}

export default App
