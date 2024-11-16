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
import Matrix from "./components/Matrix.tsx";


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

  // List of waypoints that are displayed on the map
  const setWaypoints = useAppStore((state) => state.setWaypoints)

  // This determines wether lines between points are shown
  const showLinesBetweenWaypoints = useAppStore((state) => state.showLinesBetweenWaypoints)

  // Sets the color for lines between waypoints
  const linesBetweenWaypointsColor = useAppStore((state) => state.linesBetweenPointsColor)

  const setDurationMatrix = useAppStore((state) => state.setDurationMatrix)

  const setDistanceMatrix = useAppStore((state) => state.setDistanceMatrix)

  const durationMatrix = useAppStore((state) => state.durationMatrix)
  const distanceMatrix = useAppStore((state) => state.distanceMatrix)

  const setStartSolving = useAppStore((state) => state.setStartSolving)

  const returnToStartingPoint = useAppStore((state) => state.returnToStartingPoint)

  const solverTransportType = useAppStore((state) => state.solverTransportType)

    useEffect(() => {
        getDurationMatrix()
    }, [solverTransportType]);


  // this useEffect updates the waypoint numbers displayed on the map, when a user chooses a route, its ordering is displayed
  useEffect(() => {
    const defaultMap = new Map(waypoints.map(waypoint => [waypoint.id, waypoint.orderNumber!]))
    setWaypointToNumberMapping(defaultMap)
    setDefaultWaypointMapping(defaultMap)
    getDurationMatrix()
  }, [waypoints]);


  // This gets the durationMatrix from the api
  const getDurationMatrix = async () => {
    const transformedWaypoints = waypoints.map(waypoint => ({id: waypoint.id, lat: waypoint.latlang.lat, lng: waypoint.latlang.lng}))

    const transportType = useAppStore.getState().solverTransportType.toString()

    const response = await requestService.post(`http://127.0.0.1:8000/api/duration_matrix?transport_type=${transportType}`, transformedWaypoints)

    const data = await response.json()
    const jsonData = JSON.parse(data.response)

    setDistanceMatrix(jsonData.distances)
    setDurationMatrix(jsonData.durations)
  }

  return (
    <>
      <div className='w-screen h-screen flex justify-center relative'>
        <MapContainer center={[50.065262, 19.919038]} zoom={13} style={{ height: '100vh', width: '100vw'}}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <ClickListener onClick={(waypoint) => addWaypoint(waypoint)}/>

          {/* this displays the waypoints, and their numbers */}
          {waypoints.map((waypoint, index) => (
            <CustomMarker orderNumber={waypointToNumberMapping.get(waypoint.id)!} color={"white"} key={index} waypoint={waypoint}/>
          ))}

          {/* this displays the route */}
          {displayedRoutes.map((route, index) => (
              <Polyline key={route.id + route.color} positions={route.points} color={route.color}></Polyline>
          ))}

          {/* this is the lines between the waypoints */}
          {showLinesBetweenWaypoints && waypoints.length >= 2 && <Polyline key={linesBetweenWaypointsColor} positions={returnToStartingPoint ? [...waypoints.map(w => w.latlang), waypoints[0].latlang] : [...waypoints.map(w => w.latlang)]} color={linesBetweenWaypointsColor} />}

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
      {waypoints.length > 1 &&
          <div id="#bottom-menu" className="absolute bottom-0 mb-2" style={{left: "50%", zIndex: 999, transform: "translateX(-50%)"}}>
            <BottomMenu onClick={() => setStartSolving(true)} disableButton={waypoints.length < 2}/>
          </div>}

       {/* This is used to render the used solvers */}
      <div className="absolute top-0 right-0" style={{zIndex: "999"}}>
        <SolversList setWaypointMapping={setWaypointToNumberMapping}/>
      </div>
        {}
        {durationMatrix &&
            <div className="absolute left-0 bottom-0 ml-4 mb-4 flex flex-col gap-3" style={{zIndex: "999"}}>
                <Matrix name={"Duration Matrix"} matrix={durationMatrix}/>
                <Matrix name={"Distance Matrix"} matrix={distanceMatrix}/>
            </div>}
    </>
  )
}

export default App
