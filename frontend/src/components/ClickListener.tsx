import {Waypoint} from "../interfaces/Interfaces.ts";
import {useMapEvents} from "react-leaflet";
import {LeafletMouseEvent} from "leaflet";
import {v4 as uuidv4} from "uuid";

type ClickListenerProps = {
  onClick: (latlng: Waypoint) => void
}

const ClickListener = ({onClick}: ClickListenerProps) => {
  useMapEvents({
    click(e: LeafletMouseEvent){
      onClick({id:uuidv4(), latlang: e.latlng})
    }
  })
  return null
}

export default ClickListener