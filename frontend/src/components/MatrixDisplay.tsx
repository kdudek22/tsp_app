import Modal from "react-modal";
import {useState} from "react";


type Props = {
    name: string

}

const MatrixDisplay = ({name}: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div>
            <p className="hover:cursor-pointer" onClick={(e) => setIsOpen(true)}>{name}</p>
        </div>
    );
};

export default MatrixDisplay;