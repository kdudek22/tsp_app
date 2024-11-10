import React, {useState} from 'react';
import {InformationCircleIcon} from "@heroicons/react/24/outline";
import MatrixDisplay from "./MatrixDisplay.tsx";
import Modal from "react-modal";
import {useAppStore} from "../store/store.tsx";


Modal.setAppElement("#root");

const Info = () => {

    const [isOpen2, setIsOpen2] = useState(false)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [displayedMatrix, setDisplayedMatrix] = useState<null | [[number]]>(null)

    return (
        <div className="relative rounded w-8 h-8 p-0.5 border-2 border-gray-400" style={{background: "rgba(255, 255, 255, 0.9)", zIndex: 500}} onClick={() => setIsOpen2(!isOpen2)}>
            <InformationCircleIcon className="h-6 w-6"/>
            {isOpen2 &&
                <div className="absolute -top-24 left-8 p-2 rounded w-36 border-2 border-gray-400" style={{background: "rgba(255, 255, 255, 0.9)"}}>
                    <div>
                        <p className="hover:underline hover:cursor-pointer" onClick={() => {setDisplayedMatrix(useAppStore.getState().durationMatrix); setModalIsOpen(true)}}>Duration Matrix</p>
                        <p className="hover:underline hover:cursor-pointer" onClick={() => {setDisplayedMatrix(useAppStore.getState().distanceMatrix); setModalIsOpen(true)}}>Distance Matrix</p>
                        <p className="hover:underline hover:cursor-pointer">Weighted Matrix</p>
                    </div>

                </div>}
            <Modal isOpen={modalIsOpen && displayedMatrix !== null} onRequestClose={() => setModalIsOpen(false)} style={{overlay: { zIndex: 1000, backgroundColor: "rgba(0, 0, 0, 0.3)" }, content: {zIndex: 1001}}}>
                <MatrixDisplay passedMatrix={displayedMatrix!} name={"pies"}/>
            </Modal>
        </div>
    );
};

export default Info;