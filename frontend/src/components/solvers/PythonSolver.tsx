import Solver from "./Solver.tsx";
import {requestService} from "../../services/services.ts";

type Props = {
    onSolverClicked: (solverId: string, waypointMapping: Map<string, number>) => void
    selectedSolverName: string | null
}


function PythonSolver({onSolverClicked, selectedSolverName}: Props) {

    const solveTSP = async  (durationMatrix: [[number]]): Promise<number[]> => {
        const response = await requestService.post("http://127.0.0.1:5000/solve?solver=dynamic", {matrix: durationMatrix})

        const data = await response.json()

        if(!response.ok){
            throw new Error(data.error)
        }

        return data.solution
    }

    return (
        <Solver selectedSolverName={selectedSolverName} onSolverClicked={onSolverClicked} defaultColor={"#6F6FFF"} name={"Python solver"} solveTSP={solveTSP}></Solver>
    );
}

export default PythonSolver;