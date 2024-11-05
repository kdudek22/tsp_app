import {MapIcon} from "@heroicons/react/24/outline";

type Props = {
    onClick: () => any
    disableButton: boolean
}

const BottomMenu = ({onClick, disableButton}: Props) => {
    return (
        <div>
            <button onClick={onClick} disabled={disableButton} className='border-2 disabled:border-gray-400 disabled:opacity-80 border-gray-700 rounded-xl text-white bg-green-600 disabled:bg-gray-300 py-2 px-6 text-2xl flex items-center' style={{zIndex: 500}}>
                <MapIcon className="w-8 h-8"/>
                <p>Route</p>
            </button>
        </div>
    );
};

export default BottomMenu;