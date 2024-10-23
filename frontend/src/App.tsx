import { MapContainer, TileLayer, Marker, useMapEvents, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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

        </MapContainer>
      </div>
      <div className="absolute top-0 left-0 z-50 h-screen" style={{zIndex: 999}}>
        <div className='my-20 overflow-y-scroll'>
          <div className="">
            {waypoints.map((waypoint, index) => (
                <p>Waypoint: {index} {waypoint.lat} - {waypoint.lng}</p>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
