import Solver from "./Solver.tsx";
import {requestService} from "../../services/services.ts";
import {useSettingsStore} from "../../store/SettingsStore.tsx";

type Props = {
    onSolverClicked: (solverId: string, waypointMapping: Map<string, number>) => void
    selectedSolverName: string | null
}


function BruteForceSolver({onSolverClicked, selectedSolverName}: Props) {

    const solveTSP = async  (durationMatrix: [[number]]): Promise<number[]> => {
        let body: any = {matrix: durationMatrix}

        if(!useSettingsStore.getState().returnToStartingPoint){
            body = {...body, start_city: 0, end_city: durationMatrix.length - 1}
        }

        const response = await requestService.post("http://127.0.0.1:5000/solve?solver=brute_force", body)

        const data = await response.json()

        if(!response.ok){
            throw new Error(data.error)
        }

        return data.solution
    }

    return (
        <Solver selectedSolverName={selectedSolverName} onSolverClicked={onSolverClicked} defaultColor={"#3F6333"} name={"BruteForce solver"} solveTSP={solveTSP}></Solver>
    );
}

export default BruteForceSolver;