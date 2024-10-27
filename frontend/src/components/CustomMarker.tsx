import {Waypoint} from "../interfaces/Interfaces.ts";
import L from "leaflet";
import {Marker} from "react-leaflet";

type MarkerProps = {
    waypoint: Waypoint
  }

  const CustomMarker = ({waypoint}: MarkerProps) => {
    const customIcon = L.divIcon({
      className: `${waypoint.id} custom-marker`,
      html: `<div id=${waypoint.id}>1</div>`,
      iconSize: [20, 20]
    })
    return <Marker position={waypoint.latlang} icon={customIcon} id={waypoint.id}></Marker>
  }

export default CustomMarker