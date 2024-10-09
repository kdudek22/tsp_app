import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


function App() {

  return (
    <>
      <div className='bg-slate-800 w-screen h-screen flex justify-center py-8'>
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '40vh', width: '90vw'}}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
      </div>
    </>
  )
}

export default App
