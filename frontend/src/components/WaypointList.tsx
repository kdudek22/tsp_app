import { Waypoint } from "../interfaces/Interfaces";
import WaypointElement from "./WaypointElement";

type Props = {
    waypoints: Waypoint[]
    updateWaypoints: (waypoints: Waypoint[]) => void
}

function WaypointList({waypoints, updateWaypoints}: Props) {

    const onWaypointDelete = (waypointId: string) => {
        updateWaypoints(waypoints.filter(w => w.id !== waypointId))
    }

    return (
        <>
            <h1 className="p-2 font-bold">Waypoints:</h1>
            {waypoints.map((waypoint, index) => (
                <WaypointElement waypoint={waypoint} key={index} onDeleteClicked={onWaypointDelete}></WaypointElement>
            ))}
        </>
    );
}

export default WaypointList;