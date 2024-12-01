import {Waypoint} from "../interfaces/Interfaces.ts";
import L from "leaflet";
import {Marker, Popup} from "react-leaflet";
import { TrashIcon } from '@heroicons/react/24/outline';
import {useAppStore} from "../store/AppStore.tsx";




type MarkerProps = {
    waypoint: Waypoint
    orderNumber: number
  }

  const CustomMarker = ({waypoint, orderNumber, color}: MarkerProps) => {

    const removeWaypoint = useAppStore((state) => state.removeWaypoint)

    const customIcon = L.divIcon({
      className: `${waypoint.id} ${waypoint.isStart || waypoint.isEnd ? "starting" : "custom-marker"}`,
      html: `<div id=${waypoint.id}>${orderNumber}</div>`,
      iconSize: [20, 20]
    })
    return <Marker position={waypoint.latlang} icon={customIcon} >
      <Popup interactive={true}>
        <div className="flex flex-col relative">
          <p className="m-0 p-0">Lat: {waypoint.latlang.lat}</p>
          <p>Lng: {waypoint.latlang.lng}</p>
          {waypoint.isStart && <p>Starting point</p>}
          {waypoint.isEnd && <p>Ending point</p>}
          <div className="flex justify-center" title="Remove waypoint" onClick={(e) => { removeWaypoint(waypoint.id); e.stopPropagation();}}>
            <TrashIcon className="w-4 h-4"/>
          </div>

        </div>
      </Popup>
    </Marker>
  }

export default CustomMarker