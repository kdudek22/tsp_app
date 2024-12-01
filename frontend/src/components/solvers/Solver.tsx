import {useEffect, useState} from 'react';
import {ClipLoader} from "react-spinners";
import {Route, SolveFor, Waypoint} from "../../interfaces/Interfaces.ts";
import {v4 as uuidv4} from 'uuid';
import {requestService} from "../../services/services.ts";
import {useAppStore} from "../../store/AppStore.tsx";
import {ArrowPathIcon} from "@heroicons/react/24/outline";
import {useSettingsStore} from "../../store/SettingsStore.tsx";

type Props = {
    name: string
    defaultColor: string
    durationMatrix: [[number]],
    solveTSP: ([[number]]) => Promise<number[]>,
    onSolverClicked: (solverId: string, waypointMapping: Map<string, number>) => void
    selectedSolverName: string | null
}

enum Status{
    idle="Idle", running="Running", finished="Finished", error="Error"
}

const Solver = ({name, defaultColor, solveTSP, onSolverClicked, selectedSolverName, durationMatrix}: Props) => {

    const removeRouteFromDisplayed = useAppStore((state) => state.removeRouteFromDisplayed)
    const addRouteToDisplayedRoutes = useAppStore((state) => state.addRouteToDisplayed)
    const startSolving = useAppStore((state) => state.startSolving)
    const [isHovered, setIsHovered] = useState<boolean>(false)

    const getMatrixToSolveFor = () => {
        if(useSettingsStore.getState().solveFor === SolveFor.distance){
                return useAppStore.getState().distanceMatrix
        }
        else if(useSettingsStore.getState().solveFor === SolveFor.duration){
            return useAppStore.getState().durationMatrix
        }
        return useAppStore.getState().durationMatrix
    }

    useEffect(() => {
        if (startSolving) {
            runSolve()
        }
    }, [startSolving]);

    const runSolve = async () => {
        solve(getMatrixToSolveFor())
            .catch(e => setStatus(Status.error))
    }

    const [route, setRoute] = useState<Route>()
    const [status, setStatus] = useState(Status.idle)
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isDisplayed, setIsDisplayed] = useState<boolean>(false)
    const [color, setColor] = useState(defaultColor)
    const [waypointToNumberMapping, setWaypointToNumberMapping] = useState<Map<string, number>>(new Map())

    useEffect(() => {
        let timerId;
        if (status === Status.running) {
            setTimeElapsed(0)
            timerId = setInterval(() => {
                setTimeElapsed((prevTime) => prevTime + 10);
            }, 10);
        }

        return () => clearInterval(timerId);
    }, [status]);

    const getRouteFromSolution = async (ordering: number[], waypoints: Waypoint[]) => {
        const transformedWaypoints = waypoints.map(waypoint => ({
            id: waypoint.id,
            lat: waypoint.latlang.lat,
            lng: waypoint.latlang.lng
        }))
        const points = ordering.map(p => transformedWaypoints[p])

        const transportType = useSettingsStore.getState().solverTransportType.toString()
        const response = await requestService.post(`http://127.0.0.1:8000/api/route?transport_type=${transportType}`, points)

        const data = await response.json()
        const geometries: [[number]] = JSON.parse(data.response).features[0].geometry.coordinates
        return geometries
    }

    const calculateCost = (solution, durationMatrix) => {
        return solution.slice(0, -1).reduce((x, vertex, i) => x + durationMatrix[vertex][solution[i + 1]], 0);
    }

    const solve = async (durationMatrix: [[number]]) => {
        setStatus(Status.running)
        const waypoints = useAppStore.getState().waypoints

        let solution = await solveTSP(durationMatrix)

        let routePoints = (await getRouteFromSolution(solution, waypoints)).map(x => ({lat: x[1], lng: x[0]}))

        const route: Route = {id: uuidv4(), color: color, solution: solution, totalCost: calculateCost(solution, durationMatrix), points: routePoints}

        addRouteToDisplayedRoutes(route)
        setRoute(route); setIsDisplayed(true); setStatus(Status.finished); setWaypointToNumberMapping(createWaypointToNumberMapping(solution, waypoints))
    }

    const toggleDisplayRoute = () => {
        isDisplayed ?
        (removeRouteFromDisplayed(route!), setIsDisplayed(false))
        :
        (addRouteToDisplayedRoutes(route!), setIsDisplayed(true));
    }

    const updateRouteColor = (newColor: string) => {
        setColor(newColor)

        if(route !== undefined){
            // TODO make this a simple setRoute call
            const newRoute = {...route}
            newRoute!.color = newColor
            setRoute(newRoute)
            addRouteToDisplayedRoutes(newRoute!)
        }
    }

    // This maps the result and the waypoints to a map waypointId => number, that matches the result ordering
    const createWaypointToNumberMapping = (solution: number[], waypoints: Waypoint[]): Map<String, number> => {
        if(useSettingsStore.getState().returnToStartingPoint)
            return new Map(solution.slice(0, solution.length - 1).map((n, idx) => [waypoints[n].id, idx]))
        return new Map(solution.map((n, idx) => [waypoints[n].id, idx]))
    }

    const getMetric = () => {
        return useSettingsStore.getState().solveFor == SolveFor.duration ? "seconds" : "meters"
    }

    return (
        <div className="fex flex-col text-xs py-3 px-4 relative" style={{background: selectedSolverName === name  && status === Status.finished ? "rgba(102, 204, 255, 0.5)" : ""}} onClick={() => status === Status.finished? onSolverClicked(name, waypointToNumberMapping) : null} onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)}>
            <h2 className="font-bold">{name}</h2>
            <div className="flex justify-between items-center gap-3">
                <div>
                    <p className="w-32">Status: {status}</p>
                    <p>Time to solve: {timeElapsed !== 0 ? `${Math.floor(timeElapsed/1000)}.${timeElapsed%1000}`: "N/A"}</p>
                    <p>Cost: {route == undefined ? "N/A": route.totalCost.toFixed(2) + getMetric()}</p>
                    <div className="flex items-center">
                        <input disabled={ status!== Status.finished} type="checkbox" onChange={toggleDisplayRoute} checked={isDisplayed}/>
                        <input className="w-4 h-4" type="color" defaultValue={color} onChange={(e)=>{e.preventDefault(), updateRouteColor(e.target.value)}}/>
                    </div>
                </div>
                <div className="w-12">
                    {status === Status.running && <ClipLoader size={20} />}
                    {status === Status.error && <p className="text-red-600">Solver Error</p>}
                </div>
                {isHovered &&
                    <div className="absolute top-0 right-0 mt-1 me-1" title="Rerun solver" onClick={() => runSolve()}>
                        <ArrowPathIcon className="w-3 h-3"/>
                    </div>
                }
            </div>
        </div>
    );
};

export default Solver;