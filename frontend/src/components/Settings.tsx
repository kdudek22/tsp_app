import {useState} from "react";
import {PencilIcon, Cog6ToothIcon} from "@heroicons/react/24/outline";

type Props = {

}

function Settings() {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="relative" style={{zIndex: 999}}>
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