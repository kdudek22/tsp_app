import {Waypoint} from "../interfaces/Interfaces.ts";
import L from "leaflet";
import {Marker, Popup} from "react-leaflet";




type MarkerProps = {
    waypoint: Waypoint
    orderNumber: number
  }

  const CustomMarker = ({waypoint, orderNumber, color}: MarkerProps) => {
    const customIcon = L.divIcon({
      className: `${waypoint.id} custom-marker`,
      html: `<div id=${waypoint.id} style="color: ${color}">${orderNumber}</div>`,
      iconSize: [20, 20]
    })
    return <Marker position={waypoint.latlang} icon={customIcon} >
      <Popup interactive={true}>
        <div className="flex flex-col">
          <p className="m-0 p-0">Lat: {waypoint.latlang.lat}</p>
          <p>Lng: {waypoint.latlang.lng}</p>
        </div>
      </Popup>
    </Marker>
  }

export default CustomMarker