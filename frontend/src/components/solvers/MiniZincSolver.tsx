import Solver from "./Solver.tsx";
import {requestService} from "../../services/services.ts";
import {useAppStore} from "../../store/AppStore.tsx";
import {useSettingsStore} from "../../store/SettingsStore.tsx";

type Props = {
    onSolverClicked: (solverId: string, waypointMapping: Map<string, number>) => void
    selectedSolverName: string | null
    durationMatrix: [[number]],
}


function MiniZincSolver({onSolverClicked, selectedSolverName, durationMatrix}: Props) {

    const solveTSP = async  (durationMatrix: [[number]]): Promise<number[]> => {
        let body: any = {matrix: durationMatrix}

        if(!useSettingsStore.getState().returnToStartingPoint){
            body = {...body, start_city: 0, end_city: durationMatrix.length - 1}
        }

        const response = await requestService.post("http://127.0.0.1:5000/solve?solver=minizinc", body)

        const data = await response.json()

        return data.solution
    }

    return (
        <Solver durationMatrix={durationMatrix} selectedSolverName={selectedSolverName} onSolverClicked={onSolverClicked} defaultColor={"#FF0000"} name={"Minizinc solver"} solveTSP={solveTSP}></Solver>
    );
}

export default MiniZincSolver;