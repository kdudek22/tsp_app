import React, { useState } from 'react';
import MatrixDisplay from "./MatrixDisplay.tsx";
import Modal from "react-modal";
import { useAppStore } from "../store/store.tsx";

import matrixImage from "../static/matrix.png";

Modal.setAppElement("#root");

type Props = {
    name: string
    matrix: [[number]]
}

const Matrix = ({name, matrix}: Props) => {
    const durationMatrix = useAppStore((state) => state.durationMatrix);

    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
            <div title={name} className="border-4 hover:border-yellow-500">
                <div onClick={() => setIsHovered(true)}>
                <img src={matrixImage} className="w-16 h-16" />
            </div>
                <Modal isOpen={isHovered} shouldCloseOnOverlayClick={true} onRequestClose={() => setIsHovered(false)}  style={{overlay: { zIndex: 1000, backgroundColor: "rgba(0, 0, 0, 0.3)" }, content: {width: "fit-content", height: "fit-content",margin: "auto" ,zIndex: 1001, backgroundColor: "white", borderRadius: "0.75rem"}}}>
                    <MatrixDisplay passedMatrix={matrix} />
                </Modal>
            </div>
        </>
    );
};

export default Matrix;
