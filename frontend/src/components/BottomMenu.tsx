import {ArrowUturnLeftIcon} from "@heroicons/react/24/outline";

type Props = {
    onClick: () => any
    disableButton: boolean
}

const BottomMenu = ({onClick, disableButton}: Props) => {
    return (
        <div>
            <button onClick={onClick} disabled={disableButton} className='border-2 border-gray-400 bg-green-600 disabled:bg-gray-300 py-2 px-6 rounded-xl text-2xl text-white' style={{zIndex: 500}} >Route</button>
        </div>
    );
};

export default BottomMenu;