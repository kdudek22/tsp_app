import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

type Props = {
    waypoint: L.LatLng
    id: number
    onDeleteClicked: (waypointId: number) => void
}

function Waypoint({waypoint, id, onDeleteClicked}: Props) {

    const [isHovered, setIsHovered] = useState(false);

    return (
        <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={{background: isHovered? "rgba(255, 255, 255, 0.6)": "", position: "relative"}}>
            <p className="py-8 px-4"><strong>Waypoint:</strong> {id} {waypoint.lat} - {waypoint.lng}</p>
            {isHovered && <TrashIcon onClick={() => onDeleteClicked(id)} className="h-5 w-5 mr-2 mt-2 absolute top-0 right-0" />}
        </div>
    );
}

export default Waypoint;