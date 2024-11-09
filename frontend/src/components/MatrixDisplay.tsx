
type Props = {
    name: string
    passedMatrix: [[number]]
}

const MatrixDisplay = ({name, passedMatrix}: Props) => {
    const matrix = Array.from({ length: 8 }, (_, rowIndex) => Array.from({ length: 8 }, (_, colIndex) => rowIndex * 8 + colIndex + 1));

    function valueToColor(value) {
        const minValue = 0
        const maxValue = 75
        // Clamp value between minValue and maxValue
        value = Math.min(Math.max(value, minValue), maxValue);

        // Normalize the value between 0 and 1
        const normalizedValue = (value - minValue) / (maxValue - minValue);

        // Calculate red and blue components
        const red = Math.round(normalizedValue * 255); // Red increases as value increases
        const blue = Math.round((1 - normalizedValue) * 255); // Blue decreases as value increases

        // Return color in RGB format
        return `rgb(${red}, 0, ${blue})`;
    }

    return (
        <div className="flex flex-col w-full h-full">
          {matrix.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-1">
              {row.map((cell, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} style={{ backgroundColor: valueToColor(cell) }} className="flex-1 flex items-center justify-center min-w-2 min-h-2 text-white">{cell}</div>
              ))}
            </div>
          ))}
        </div>
    );
};

export default MatrixDisplay;