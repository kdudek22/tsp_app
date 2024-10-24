import Waypoint from "./Waypoint";

type Props = {
    waypoints: L.LatLng[]
    updateWaypoints: (waypoints: L.LatLng[]) => void
}

function WaypointList({waypoints, updateWaypoints}: Props) {

    const onWaypointDelete = (waypointId: number) => {
        updateWaypoints(waypoints.filter(w => w.id))
    }

    return (
        <>
            {waypoints.map((waypoint, index) => (
                <Waypoint waypoint={waypoint} id={index} key={index} onDeleteClicked={onWaypointDelete}></Waypoint>
            ))}
        </>
    );
}

export default WaypointList;