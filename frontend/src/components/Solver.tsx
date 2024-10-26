import {useEffect, useState} from 'react';
import {ClipLoader} from "react-spinners";
import {Route, Waypoint} from "../interfaces/Interfaces.ts";
import L from "leaflet";
import { v4 as uuidv4 } from 'uuid';

type Props = {
    durationMatrix: [],
    waypoints: Waypoint[],
    requestToAddToDisplayedRoutes: (route: Route) => boolean
    requestToRemoveFromDisplayedRoutes: (id: string) => boolean
}

enum Status{
    idle="Idle", running="Running", finished="Finished"
}

const Solver = ({durationMatrix, waypoints, requestToAddToDisplayedRoutes, requestToRemoveFromDisplayedRoutes}: Props) => {
    const name = "Naive Solver"


    useEffect(() => {
        if(durationMatrix.length){
            solve()
        }
    }, [durationMatrix]);
    const [route, setRoute] = useState<Route>()

    const [isRunning, setIsRunning] = useState(false)
    const [isFinished, setIsFinished] = useState(false)
    const [currentAction, setCurrentAction] = useState("")
    const [totalCost, setTotalCost] = useState(-1)
    const [status, setStatus] = useState(Status.idle)
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [solution, setSolution] = useState<number[]>([])
    const [solutionRoute, setSolutionRoute] = useState([])
    const [isDisplayed, setIsDisplayed] = useState<boolean>(false)
    const [color, setColor] = useState("#000000")


      useEffect(() => {
        let timerId;

        if (isRunning) {
          timerId = setInterval(() => {
            setTimeElapsed((prevTime) => prevTime + 1);
          }, 10); // Increment every 10 milliseconds
        }

        return () => clearInterval(timerId); // Cleanup the interval on component unmount or when isRunning changes
      }, [isRunning]);

      const startTimer = () => {
        setIsRunning(true);
      };

      const stopTimer = () => {
        setIsRunning(false);
      };

      const resetTimer = () => {
        setIsRunning(false);
        setTimeElapsed(0);
      };

      const seconds = Math.floor(timeElapsed / 100);
      const milliseconds = timeElapsed%100;

    const sendPostRequest = async (url: string, body: any) => {
        return await fetch(url, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
  }

    const solveTSP = (): number[] => {
        return [...Array.from({length: durationMatrix.length}, (_, index) => index), 0]
    }

    const getRouteFromSolution = async (ordering: number[]) => {
        const transformedWaypoints = waypoints.map(waypoint => ({id: waypoint.id, lat: waypoint.latlang.lat, lng: waypoint.latlang.lng}))
        const points = ordering.map(p => transformedWaypoints[p])
        const response = await sendPostRequest("http://127.0.0.1:8000/api/test", points)

        const data = await response.json()
        const geometries: [[number]] = JSON.parse(data.response).features[0].geometry.coordinates
        return geometries
    }

    const calculateCost = () => {
        let totalCost = 0;
        for(let i = 0; i<solution.length -1; i++){
            const currentVertex = solution[i]
            const nextVertex = solution[i+1]
            totalCost += durationMatrix[currentVertex][nextVertex]
        }
        return totalCost
    }

    const solve = async () => {
        setIsRunning(true)
        setStatus(Status.running)
        const solution = solveTSP()
        setSolution(solution)
        let routePoints = await getRouteFromSolution(solution)
        setSolutionRoute(routePoints)

        const mappedPoints: L.latlang[] = routePoints.map(x => ({lat: x[1], lng: x[0]}))

        console.log(mappedPoints[0].lat, mappedPoints[0].lng)

        console.log(mappedPoints)

        const route: Route = {id: uuidv4(), color: color, points: mappedPoints}

        setRoute(route)
        setIsDisplayed(requestToAddToDisplayedRoutes(route))
        setStatus(Status.finished)
        setIsRunning(false)
    }

    const updateDisplayedRoute = () => {
        if(isDisplayed){
            console.log("remove")
            requestToRemoveFromDisplayedRoutes(route!.id)
            setIsDisplayed(false)
        }
        else{
            console.log("add")
            requestToAddToDisplayedRoutes(route!)
            setIsDisplayed(true)
        }
    }

    return (
        <div className="flex flex-col text-xs">
            <h2 className="font-bold">{name}</h2>
            <div className="flex justify-between gap-3">
                <div>
                    <p className="w-48">Status: {status}</p>
                    <p>Time to solve: {(seconds!== 0 && milliseconds !== 0) ? `${seconds}.${milliseconds}`: "N/A"}</p>
                    <p>Cost: {calculateCost() === 0? "N/A": calculateCost()}</p>
                    <input type="checkbox" onClick={updateDisplayedRoute} checked={isDisplayed}/>
                    <input className="w-4 h-4" type="color" defaultValue={color} onChange={(e)=>{setColor(e.target.value)}}/>
                </div>
                <div style={{ width: '50px', height: '50px' }}>
                    {isRunning && <ClipLoader size={20} />}
                </div>
            </div>
        </div>
    );
};

export default Solver;