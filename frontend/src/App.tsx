import { MapContainer, TileLayer, Polyline} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import {useEffect, useState} from 'react';
import WaypointList from './components/WaypointList';

import {requestService} from "./services/services.ts";
import CustomMarker from "./components/CustomMarker.tsx";
import ClickListener from "./components/ClickListener.tsx";
import Settings from "./components/Settings.tsx";
import BottomMenu from "./components/BottomMenu.tsx";
import SolversList from "./components/SolversList.tsx";
import {useAppStore} from "./store/store.tsx";
import Info from "./components/Info.tsx";


function App() {

  // List of waypoints that are visible on the map
  const waypoints = useAppStore((state) => state.waypoints);

  // When you need  to add a waypoint - this has some logic inside
  const addWaypoint = useAppStore((state) => state.addWaypoint);

  // List of routes that are displayed on the map
  const displayedRoutes =  useAppStore((state) => state.displayedRoutes);

  // This maps a given waypoint to a number used for displaying the order of visits on a map
  const waypointToNumberMapping = useAppStore((state) => state.waypointToVisitOrderNumberMapping)

  const setWaypointToNumberMapping = useAppStore((state) => state.setWaypointToVisitOrderNumberMapping)

  // Same as above, but this is used to preserve the default ordering - the input one
  const [defaultWaypointMapping, setDefaultWaypointMapping] = useState<Map<string, number>>(new Map())

  const setCanAddWaypoints = useAppStore((state) => state.setCanAddWaypoints)

  const showLinesBetweenWaypoints = useAppStore((state) => state.showLinesBetweenWaypoints)

  const linesBetweenWaypointsColor = useAppStore((state) => state.linesBetweenPointsColor)

  const setDurationMatrix = useAppStore((state) => state.setDurationMatrix)

  const setDistanceMatrix = useAppStore((state) => state.setDistanceMatrix)

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
    const jsonData = JSON.parse(data.response)

    setDistanceMatrix(jsonData.distances)
    setDurationMatrix(jsonData.durations)
    setCanAddWaypoints(false)
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
            <CustomMarker orderNumber={waypointToNumberMapping.get(waypoint.id)!} key={index} waypoint={waypoint}/>
          ))}

          {/* this displays the route */}
          {displayedRoutes.map((route, index) => (
              <Polyline key={route.id + route.color} positions={route.points} color={route.color}></Polyline>
          ))}

          {/* this is the lines between the waypoints */}
          {showLinesBetweenWaypoints && waypoints.length >= 2 && <Polyline key={linesBetweenWaypointsColor} positions={[...waypoints.map(w => w.latlang), waypoints[0].latlang]} color={linesBetweenWaypointsColor} />}

        </MapContainer>
      </div>
      <div className="absolute top-0 left-0 z-50 py-24 ms-3" style={{zIndex: 500}}>
        <div>
            <Settings/>
          </div>
        <div>
          {/*<div className="mt-4 overflow-auto " style={{background: "rgba(255, 255, 255, 0.7)", maxHeight: "65vh"}}>*/}
          {/*  <WaypointList updateWaypoints={setWaypoints} waypoints={waypoints}></WaypointList>*/}
          {/*</div>*/}
        </div>
      </div>
      <div className="absolute bottom-0 mb-2" style={{left: "50%", zIndex: 999, transform: "translateX(-50%)"}}>
        <BottomMenu onClick={getDurationMatrix} disableButton={waypoints.length < 2}/>
      </div>
       {/* This is used to render the used solvers */}
      <div className="absolute top-0 right-0" style={{zIndex: "999"}}>
        <SolversList setWaypointMapping={setWaypointToNumberMapping}/>
      </div>
      <div className="absolute left-0 bottom-0 ml-4 mb-4" style={{zIndex: "999"}}>
        <Info/>
      </div>

    </>
  )
}

export default App
