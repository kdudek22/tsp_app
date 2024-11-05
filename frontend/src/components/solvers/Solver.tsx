import {useEffect, useState} from 'react';
import {ClipLoader} from "react-spinners";
import {Route, Waypoint} from "../../interfaces/Interfaces.ts";
import { v4 as uuidv4 } from 'uuid';
import {requestService} from "../../services/services.ts";

type Props = {
    name: string
    defaultColor: string
    durationMatrix: [[number]],
    waypoints: Waypoint[],
    solveTSP: ([[number]]) => Promise<number[]>,
    requestToAddToDisplayedRoutes: (route: Route) => void
    requestToRemoveFromDisplayedRoutes: (id: string) => void
    onSolverClicked: (solverId: string, waypointMapping: Map<string, number>) => void
    selectedSolverName: string | null
}

enum Status{
    idle="Idle", running="Running", finished="Finished"
}

const Solver = ({name, defaultColor, durationMatrix, waypoints, solveTSP, requestToAddToDisplayedRoutes, requestToRemoveFromDisplayedRoutes, onSolverClicked, selectedSolverName}: Props) => {


    useEffect(() => {
        if (durationMatrix[0].length !== 0) {
            solve()
        }
    }, [durationMatrix]);

    const [route, setRoute] = useState<Route>()
    const [isRunning, setIsRunning] = useState(false)
    const [status, setStatus] = useState(Status.idle)
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isDisplayed, setIsDisplayed] = useState<boolean>(false)
    const [color, setColor] = useState(defaultColor)
    const [waypointToNumberMapping, setWaypointToNumberMapping] = useState<Map<string, number>>(new Map())

    useEffect(() => {
        let timerId;
        if (isRunning) {
            timerId = setInterval(() => {
                setTimeElapsed((prevTime) => prevTime + 10);
            }, 10);
        }

        return () => clearInterval(timerId);
    }, [isRunning]);

    const getRouteFromSolution = async (ordering: number[]) => {
        const transformedWaypoints = waypoints.map(waypoint => ({
            id: waypoint.id,
            lat: waypoint.latlang.lat,
            lng: waypoint.latlang.lng
        }))
        const points = ordering.map(p => transformedWaypoints[p])
        const response = await requestService.post("http://127.0.0.1:8000/api/test", points)

        const data = await response.json()
        const geometries: [[number]] = JSON.parse(data.response).features[0].geometry.coordinates
        return geometries
    }

    const calculateCost = (solution) => {
        return solution.slice(0, -1).reduce((x, vertex, i) => x + durationMatrix[vertex][solution[i + 1]], 0);
    }

    const solve = async () => {
        setIsRunning(true); setStatus(Status.running)

        const solution = await solveTSP(durationMatrix)
        let routePoints = (await getRouteFromSolution(solution)).map(x => ({lat: x[1], lng: x[0]}))

        const route: Route = {id: uuidv4(), color: color, solution: solution, totalCost: calculateCost(solution), points: routePoints}

        requestToAddToDisplayedRoutes(route)
        setRoute(route); setIsDisplayed(true); setStatus(Status.finished); setIsRunning(false); setWaypointToNumberMapping(createWaypointToNumberMapping(solution))
    }

    const toggleDisplayRoute = () => {
        isDisplayed ?
        (requestToRemoveFromDisplayedRoutes(route!.id), setIsDisplayed(false))
        :
        (requestToAddToDisplayedRoutes(route!), setIsDisplayed(true));
    }

    const updateRouteColor = (newColor: string) => {
        setColor(newColor)

        if(route !== undefined){
            // TODO make this a simple setRoute call
            const newRoute = {...route}
            newRoute!.color = newColor
            setRoute(newRoute)
            requestToAddToDisplayedRoutes(newRoute!)
        }
    }

    // This maps the result and the waypoints to a map waypointId => number, that matches the result ordering
    const createWaypointToNumberMapping = (solution: number[]): Map<String, number> => {
        return new Map(solution.slice(0, solution.length - 1).map((n, idx) => [waypoints[n].id, idx]))
    }

    return (
        <div className={`flex flex-col text-xs py-3 px-4`} style={{background: selectedSolverName === name  && status === Status.finished ? "rgba(102, 204, 255, 0.5)" : ""}} onClick={() => status === Status.finished? onSolverClicked(name, waypointToNumberMapping) : null}>
            <h2 className="font-bold">{name}</h2>
            <div className="flex justify-between gap-3">
                <div>
                    <p className="w-32">Status: {status}</p>
                    <p>Time to solve: {timeElapsed !== 0 ? `${Math.floor(timeElapsed/1000)}.${timeElapsed%1000}`: "N/A"}</p>
                    <p>Cost: {route == undefined ? "N/A": route.totalCost}</p>
                    <div className="flex items-center">
                        <input disabled={ status!== Status.finished} type="checkbox" onChange={toggleDisplayRoute} checked={isDisplayed}/>
                        <input className="w-4 h-4" type="color" defaultValue={color} onChange={(e)=>{e.preventDefault(), updateRouteColor(e.target.value)}}/>
                    </div>
                </div>
                <div style={{ width: '50px', height: '50px' }}>
                    {isRunning && <ClipLoader size={20} />}
                </div>
            </div>
        </div>
    );
};

export default Solver;