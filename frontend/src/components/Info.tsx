import React, {useState} from 'react';
import {InformationCircleIcon} from "@heroicons/react/24/outline";
import MatrixDisplay from "./MatrixDisplay.tsx";
import Modal from "react-modal";


Modal.setAppElement("#root");

const Info = () => {

    const [isOpen, setIsOpen] = useState(false)
    const [modalIsOpen, setModalIsOpen] = useState(false)

    return (
        <div className="relative rounded w-8 h-8 p-0.5 border-2 border-gray-400" style={{background: "rgba(255, 255, 255, 0.9)", zIndex: 500}} onClick={() => setIsOpen(!isOpen)}>
            <InformationCircleIcon className="h-6 w-6"/>
            {isOpen &&
                <div className="absolute -top-24 left-8 p-2 rounded w-36 border-2 border-gray-400" style={{background: "rgba(255, 255, 255, 0.9)"}}>
                    <div>
                        <MatrixDisplay key="Duration Matrix" name={"Duration Matrix"}/>
                        <MatrixDisplay key={"Distance Matrix"} name={"Distance Matrix"}/>
                        <MatrixDisplay key={"Weighted Matrix"} name={"Weighted Matrix"}/>
                    </div>
                    <div onClick={() => setModalIsOpen(true)}>Click me</div>
                    <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={{overlay: { zIndex: 1000, backgroundColor: "rgba(0, 0, 0, 0.3)" }, content: {zIndex: 1001}}}>
                        <p>Pies was jebal</p>
                    </Modal>
                </div>}

        </div>
    );
};

export default Info;