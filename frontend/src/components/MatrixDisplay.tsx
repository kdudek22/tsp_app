import {useState} from "react";
import {useAppStore} from "../store/AppStore.tsx";

type Props = {
    passedMatrix: [[number]]
}

type ElementProps = {
    value: number
    rowIndex: number
    colIndex: number
    valueToColor: (n: number) => string
}

const MatrixElement = ({value, rowIndex, colIndex, valueToColor}: ElementProps) => {
    const [isHovered, setIsHovered] = useState<boolean>(false)
    const setMatrixHoveredGridElement = useAppStore((state) => state.setMatrixHoveredGridElement)
    return (
        <div onMouseEnter={() => {setIsHovered(true); setMatrixHoveredGridElement([rowIndex, colIndex])}} onMouseLeave={() => setIsHovered(false)} key={`${rowIndex}-${colIndex}`} style={{ backgroundColor: valueToColor(value), borderColor: isHovered ? "yellow" : valueToColor(value)}} className="border-2 hover:border-yellow-500 flex-1 flex items-center justify-center h-16 w-16 text-white">{value}</div>
    )
}

const MatrixDisplay = ({passedMatrix}: Props) => {

    const hoveredGridElement = useAppStore((state) => state.matrixHoveredGridElement)
    const setMatrixHoveredGridElement = useAppStore((state) => state.setMatrixHoveredGridElement)

    function valueToColor(value) {
        const {min, max} = getMaxMin(passedMatrix)

        value = Math.min(Math.max(value, min), max);

        const normalizedValue = (value - min) / (max - min);

        const red = Math.round(normalizedValue * 255);
        const blue = Math.round((1 - normalizedValue) * 255);

        return `rgb(${red}, 0, ${blue})`;
    }

    function getMaxMin(matrix: number[][]): { max: number, min: number } {
        const allValues = matrix.flat();
        return {
            max: Math.max(...allValues),
            min: Math.min(...allValues),
        };
    }

    return (
        <div className="flex flex-col w-full h-full relative" onMouseLeave={() => setMatrixHoveredGridElement([null, null])}>
          {passedMatrix.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-1">
              {row.map((cell, colIndex) => (
                <MatrixElement key={colIndex.toString() + rowIndex.toString()} value={cell} colIndex={colIndex} rowIndex={rowIndex} valueToColor={valueToColor}/>
              ))}
            </div>
          ))}
            {hoveredGridElement[0] !== null &&
                <div className="absolute bottom-0 left-0" style={{backgroundColor: "rgba(0,0,0,0.3)", marginBottom: "2px", marginLeft: "2px"}}>
                    <p>Row: {hoveredGridElement[0]}</p>
                    <p>Col: {hoveredGridElement[1]}</p>
                </div>}
        </div>

    );
};

export default MatrixDisplay;