import {useState} from "react";
import {Cog6ToothIcon} from "@heroicons/react/24/outline";
import Modal from 'react-modal';
import "react-toggle/style.css"
import {useAppStore} from "../store/store.tsx";
import {SolveFor, SolveTransportType} from "../interfaces/Interfaces.ts";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PedestrianIcon from "@mui/icons-material/DirectionsWalk";

Modal.setAppElement("#root");

function Settings() {
    const [isOpen, setIsOpen] = useState(false)
    const showLinesBetweenPoints = useAppStore((state) => state.showLinesBetweenWaypoints)
    const setShowLinesBetweenPoints = useAppStore((state) => state.setShowLinesBetweenWaypoints)
    const setLinesBetweenPointsColor = useAppStore((state) => state.setLinesBetweenPointsColor)
    const linesBetweenPointsColor = useAppStore((state) => state.linesBetweenPointsColor)
    const solveFor = useAppStore((state) => state.solveFor)
    const setSolveFor = useAppStore((state) => state.setSolveFor)
    const weightedSolveWeight = useAppStore((state) => state.weightedSolveWeight)
    const setWeightedSolverWeight = useAppStore((state) => state.setWeightedSolverWeight)
    const returnToStartingPoint = useAppStore((state) => state.returnToStartingPoint)
    const setReturnToStartingPoint = useAppStore((state) => state.setReturnToStartingPoint)
    const solverTransportType = useAppStore((state) => state.solverTransportType)
    const setSolverTransportType = useAppStore((state) => state.setSolverTransportType)


    return (
        <div className="relative rounded w-8 h-8 p-0.5 border-2 border-gray-400 flex items-center justify-center" style={{background: "rgba(255, 255, 255, 0.9)", zIndex: 500}}>
            <Cog6ToothIcon className="w-6 h-6 hover:cursor-pointer" onClick={() => setIsOpen(true)}/>
            <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}  style={{overlay: { zIndex: 1000, backgroundColor: "rgba(0, 0, 0, 0.3)" }, content: {width: "fit-content", height: "fit-content",margin: "auto" ,zIndex: 1001, backgroundColor: "white", borderRadius: "0.75rem"}}}>
                <div className="flex flex-col text-gray-700">
                    <p className="mb-2 text-xl font-bold">General:</p>
                    <div className="shadow p-2 rounded-xl bg-gray-100 border-2 border-gray-400">
                        <div className="flex flex-col divide-y divide-gray-400 ">
                            <div className="flex items-center gap-32 justify-between">
                                <p>Route for</p>
                                <div className="flex">
                                    <input type="checkbox" checked={solverTransportType === SolveTransportType.car} onChange={() => setSolverTransportType(SolveTransportType.car)}/>
                                    <DirectionsCarIcon style={{ fontSize: 30, color: "black" }} />
                                    <input type="checkbox" checked={solverTransportType === SolveTransportType.walking} onChange={() => setSolverTransportType(SolveTransportType.walking)}/>
                                    <PedestrianIcon style={{ fontSize: 30, color: "black" }} />
                                </div>

                            </div>
                        </div>
                    </div>
                    <p className="mb-2 text-xl font-bold">UI:</p>
                    <div className="shadow p-2 rounded-xl bg-gray-100 border-2 border-gray-400">
                        <div className="flex flex-col divide-y divide-gray-400 ">
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
                    <p className="mb-2 text-xl font-bold">Solver:</p>
                    <div className="bg-gray-100 rounded-xl p-2 shadow border-2 border-gray-400">
                        <div className="flex flex-col divide-y divide-gray-400">
                            <div className="flex items-center gap-32 justify-between">
                                <p>Return to starting point</p>
                                <input type="checkbox" checked={returnToStartingPoint} onChange={(e) => setReturnToStartingPoint(!returnToStartingPoint)}/>
                            </div>
                            <div className="flex items-center gap-32 justify-between">
                                <p>Solve for minimum travel duration</p>
                                <input type="checkbox" checked={solveFor === SolveFor.duration} onChange={(e) => setSolveFor(SolveFor.duration)}/>
                            </div>
                            <div className="flex items-center gap-32 justify-between">
                                <p>Solve for minimum distance</p>
                                <input type="checkbox" checked={solveFor === SolveFor.distance} onChange={(e) => setSolveFor(SolveFor.distance)}/>
                            </div>
                            <div>
                                <div className="flex items-center gap-32 justify-between">
                                    <p>Weighted solver</p>
                                    <input type="checkbox" checked={solveFor === SolveFor.weighted} onChange={(e) => setSolveFor(SolveFor.weighted)}/>
                                </div>
                                <div className={`flex items-center gap-32 justify-between ${solveFor === SolveFor.weighted? "":"text-gray-400"}`}>
                                    <div className="flex gap-3 items-center">
                                        <p>Weights:</p>
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                            <p>distance</p>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                                            <p>duration</p>
                                        </div>

                                    </div>
                                    <div className="flex">
                                        <p>{weightedSolveWeight}</p>
                                        <input disabled={solveFor !== SolveFor.weighted} type="range" min="0" max="100" value={weightedSolveWeight} onChange={(e) => setWeightedSolverWeight(e.target.value)} className="slider" id="myRange"/>
                                        <p>{100 - weightedSolveWeight}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </Modal>
        </div>
    );
}

export default Settings;