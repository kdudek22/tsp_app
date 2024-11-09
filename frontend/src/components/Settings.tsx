import {useState} from "react";
import {PencilIcon, Cog6ToothIcon} from "@heroicons/react/24/outline";
import Modal from 'react-modal';
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import {useAppStore} from "../store/store.tsx";

type Props = {

}

Modal.setAppElement("#root");

function Settings() {
    const [isOpen, setIsOpen] = useState(false)
    const showLinesBetweenPoints = useAppStore((state) => state.showLinesBetweenWaypoints)
    const setShowLinesBetweenPoints = useAppStore((state) => state.setShowLinesBetweenWaypoints)
    const setLinesBetweenPointsColor = useAppStore((state) => state.setLinesBetweenPointsColor)
    const linesBetweenPointsColor = useAppStore((state) => state.linesBetweenPointsColor)
    const solveForMinimumTime = useAppStore((state) => state.solveForMinimumTime)
    const setSolveForMinimumTime = useAppStore((state) => state.setSolveForMinimumTime)
    const solveForMinimumDistance = useAppStore((state) => state.solveForMinimumDistance)
    const setSolveForMinimumDistance = useAppStore((state) => state.setSolveForMinimumDistance)

    return (
        <div className="relative rounded w-8 h-8 p-0.5 border-2 border-gray-400 flex items-center justify-center" style={{background: "rgba(255, 255, 255, 0.9)", zIndex: 500}}>
            <Cog6ToothIcon className="w-6 h-6 hover:cursor-pointer" onClick={() => setIsOpen(true)}/>
            <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}  style={{overlay: { zIndex: 1000, backgroundColor: "rgba(0, 0, 0, 0.3)" }, content: {width: "fit-content", height: "fit-content",margin: "auto" ,zIndex: 1001}}}>
                <div className="flex flex-col divide-y divide-blue-600 rounded-lg gap-3">
                    <p className="text-xl font-bold">Settings</p>
                    <div>
                        <p>UI:</p>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-32 justify-between">
                                <p>Show lines between points</p>
                                <input type="checkbox" defaultChecked={showLinesBetweenPoints} onChange={() => setShowLinesBetweenPoints(!showLinesBetweenPoints)}/>
                            </div>
                            <div className="flex items-center gap-32 justify-between">
                                <span>Line color</span>
                                <input type="color" value={linesBetweenPointsColor} onChange={(e) => setLinesBetweenPointsColor(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p>Solver:</p>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-32 justify-between">
                                <p>Solve for minimum travel duration</p>
                                <input type="checkbox" checked={solveForMinimumTime} onChange={(e) => setSolveForMinimumTime(!solveForMinimumTime)}/>
                            </div>
                            <div className="flex items-center gap-32 justify-between">
                                <p>Solve for minimum distance</p>
                                <input type="checkbox" checked={solveForMinimumDistance} onChange={(e) => setSolveForMinimumDistance(!solveForMinimumDistance)}/>
                            </div>
                            {/*<div>*/}
                            {/*    <div className="flex items-center gap-32 justify-between">*/}
                            {/*        <p>Weighted solver</p>*/}
                            {/*        <input type="checkbox"/>*/}
                            {/*    </div>*/}
                            {/*    <div className="flex items-center gap-32 justify-between">*/}
                            {/*        <p>Weights</p>*/}
                            {/*        <input type="range" min="0" max="1" value="50" className="slider" id="myRange"/>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Settings;