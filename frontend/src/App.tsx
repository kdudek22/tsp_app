import { MapContainer, TileLayer, Polyline} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import {useEffect, useState} from 'react';
import WaypointList from './components/WaypointList';
import {Route, Waypoint} from './interfaces/Interfaces';


import {requestService} from "./services/services.ts";
import CustomMarker from "./components/CustomMarker.tsx";
import ClickListener from "./components/ClickListener.tsx";
import Settings from "./components/Settings.tsx";
import BottomMenu from "./components/BottomMenu.tsx";
import SolversList from "./components/SolversList.tsx";
import {useAppStore} from "./store/store.tsx";


function App() {

  // List of waypoints that are visible on the map
  const waypoints = useAppStore((state) => state.waypoints);

  // Setter to remove waypoints
  const setWaypoints = useAppStore((state) => state.setWaypoints);

  // When you need  to add a waypoint - this has some logic inside
  const addWaypoint = useAppStore((state) => state.addWaypoint);

  // List of routes that are displayed on the map
  const displayedRoutes =  useAppStore((state) => state.displayedRoutes);

  const setDisplayedRoutes = useAppStore((state) => state.setDisplayedRoutes);

  const removeRouteFromDisplayed = useAppStore((state) => state.removeRouteFromDisplayed)

  // The calculated cost matrix - after the routing procedure has been started
  const [durationMatrix, setDurationMatrix] = useState<[[number]]>([[]])

  // This maps a given waypoint to a number used for displaying the order of visits on a map
  const waypointToNumberMapping = useAppStore((state) => state.waypointToVisitOrderNumberMapping)

  const setWaypointToNumberMapping = useAppStore((state) => state.setWaypointToVisitOrderNumberMapping)

  // Same as above, but this is used to preserve the default ordering - the input one
  const [defaultWaypointMapping, setDefaultWaypointMapping] = useState<Map<string, number>>(new Map())

  const [canAddWaypoints, setCanAddWaypoints] = useState<boolean>(true)



  // this useEffect updates the waypoint numbers displayed on the map, when a user chooses a route, its ordering is displayed
  useEffect(() => {
    const defaultMap = new Map(waypoints.map(waypoint => [waypoint.id, waypoint.orderNumber!]))
    setWaypointToNumberMapping(defaultMap)
    setDefaultWaypointMapping(defaultMap)
  }, [waypoints]);


  // This gets the durationMatrix from the api
  const getDurationMatrix = async () => {
    const transformedWaypoints = waypoints.map(waypoint => ({id: waypoint.id, lat: waypoint.latlang.lat, lng: waypoint.latlang.lng}))

    const response = await requestService.post("http://127.0.0.1:8000/api/duration_matrix", transformedWaypoints)

    const data = await response.json()
    setDurationMatrix(JSON.parse(data.response).durations)
    setCanAddWaypoints(false)
  }

  // this is responsible for updating the displayed routes, also used in color changing
  const updateDisplayedRoutes = (route: Route) => {
      displayedRoutes.some(r => r.id === route.id) ?
          setDisplayedRoutes(displayedRoutes.map(r => r.id === route.id ? { ...r, color: route.color } : r))
          :
          setDisplayedRoutes([...displayedRoutes, route])
  };

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
            <CustomMarker orderNumber={waypointToNumberMapping.get(waypoint.id)!} key={index} waypoint={waypoint}/>
          ))}

          {/* this displays the route */}
          {displayedRoutes.map((route, index) => (
              <Polyline key={route.id + route.color} positions={route.points} color={route.color}></Polyline>
          ))}

          {/* this is the lines between the waypoints */}
          {waypoints.length >= 2 && <Polyline positions={[...waypoints.map(w => w.latlang), waypoints[0].latlang]} color="rgb(27, 48, 139)" />}

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
        <SolversList setWaypointMapping={setWaypointToNumberMapping} waypoints={waypoints} durationMatrix={durationMatrix}/>
      </div>
    </>
  )
}

export default App
