import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Waypoint } from '../interfaces/Interfaces';

type Props = {
    waypoint: Waypoint
    onDeleteClicked: (waypointId: string) => void
}

function WaypointElement({waypoint, onDeleteClicked}: Props) {

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseOver = () =>{
        setIsHovered(true)
        document.getElementsByClassName(waypoint.id)[0].classList.add("highlighted-marker")
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        document.getElementsByClassName(waypoint.id)[0].classList.remove("highlighted-marker")
    }

    return (
        <div className="w-16" onMouseEnter={handleMouseOver} onMouseLeave={handleMouseLeave} style={{background: isHovered? "rgba(255, 255, 255, 0.6)": "", position: "relative"}}>
            <p className="py-2 px-4" title={`lat:${waypoint.latlang.lat} long:${waypoint.latlang.lng}`}>{waypoint.orderNumber}</p>
            {isHovered && <TrashIcon onClick={() => onDeleteClicked(waypoint.id)} className="h-5 w-5 mr-2 mt-2 absolute top-0 right-0" />}
        </div>
    );
}

export default WaypointElement;