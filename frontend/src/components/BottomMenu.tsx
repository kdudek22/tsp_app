import {ArrowUturnLeftIcon} from "@heroicons/react/24/outline";

type Props = {
    onClick: () => any
    disableButton: boolean
}

const BottomMenu = ({onClick, disableButton}: Props) => {
    return (
        <div className="px-8 py-4 rounded-t-3xl flex justify-between items-center gap-6" style={{background: "rgba(255, 255, 255, 0.8)"}}>
            <button onClick={onClick} disabled={disableButton} className='bg-green-600 disabled:bg-gray-300 py-2 px-6 rounded-xl text-2xl text-white' style={{zIndex: 500}} >Route</button>
        </div>
    );
};

export default BottomMenu;