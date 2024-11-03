import {useState} from "react";
import {PencilIcon, Cog6ToothIcon} from "@heroicons/react/24/outline";

type Props = {

}

function Settings() {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="relative rounded w-8 h-8 p-0.5 border-2 border-gray-400" style={{background: "rgba(255, 255, 255, 0.9)", zIndex: 500}}>
            <Cog6ToothIcon className="w-6 h-6 hover:cursor-pointer" onClick={() => setIsOpen(prevState => !prevState)}/>
            {isOpen &&
                <div className="absolute top-6 left-0 bg-white w-64 p-2 rounded shadow">
                    <div className="flex gap-3">
                        <input type="checkbox"/>
                        <p>Show lines between points</p>
                    </div>
                    <div className="flex gap-3">
                        <input type="checkbox"/>
                        <p>Some other setting</p>
                    </div>
                </div>
            }
        </div>
    );
}

export default Settings;