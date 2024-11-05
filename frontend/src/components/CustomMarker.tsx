import {Waypoint} from "../interfaces/Interfaces.ts";
import L from "leaflet";
import {Marker} from "react-leaflet";


type MarkerProps = {
    waypoint: Waypoint
    orderNumber: number
  }

  const CustomMarker = ({waypoint, orderNumber}: MarkerProps) => {
    const customIcon = L.divIcon({
      className: `${waypoint.id} custom-marker`,
      html: `<div id=${waypoint.id}>${orderNumber}</div>`,
      iconSize: [20, 20]
    })
    return <Marker position={waypoint.latlang} icon={customIcon}></Marker>
  }

export default CustomMarker