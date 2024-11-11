import Solver from "./Solver.tsx";
import {requestService} from "../../services/services.ts";

type Props = {
    onSolverClicked: (solverId: string, waypointMapping: Map<string, number>) => void
    selectedSolverName: string | null
    durationMatrix: [[number]],
}


function MiniZincSolver({onSolverClicked, selectedSolverName, durationMatrix}: Props) {

    const solveTSP = async  (durationMatrix: [[number]]): Promise<number[]> => {
        const response = await requestService.post("http://127.0.0.1:5000/minizinc", {matrix: durationMatrix})

        const data = await response.json()
        console.log(data)
        return data.solution
    }

    return (
        <Solver durationMatrix={durationMatrix} selectedSolverName={selectedSolverName} onSolverClicked={onSolverClicked} defaultColor={"#FF0000"} name={"Minizinc solver"} solveTSP={solveTSP}></Solver>
    );
}

export default MiniZincSolver;