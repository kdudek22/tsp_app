import {useEffect, useState} from 'react';
import {ClipLoader} from "react-spinners";
import {Waypoint} from "../interfaces/Interfaces.ts";
import L from "leaflet";

type Props = {
    durationMatrix: [],
    waypoints: Waypoint[],
    requestToSetDisplayedRoute: (points: any[]) => boolean
}

enum Status{
    idle="Idle", running="Running", finished="Finished"
}

const Solver = ({durationMatrix, waypoints, requestToSetDisplayedRoute}: Props) => {
    const name = "Naive Solver"
    const color = "#5CF64A"


    useEffect(() => {
        if(durationMatrix.length){
            solve()
        }
    }, [durationMatrix]);


    const [isRunning, setIsRunning] = useState(false)
    const [isFinished, setIsFinished] = useState(false)
    const [currentAction, setCurrentAction] = useState("")
    const [totalCost, setTotalCost] = useState(-1)
    const [status, setStatus] = useState(Status.idle)
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [solution, setSolution] = useState<number[]>([])
    const [solutionRoute, setSolutionRoute] = useState([])
    const [isDisplayed, setIsDisplayed] = useState(false)


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
        const geometries: L.latlang[] = JSON.parse(data.response).features[0].geometry.coordinates

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
        const routePoints = await getRouteFromSolution(solution)
        setSolutionRoute(routePoints)
        setIsDisplayed(requestToSetDisplayedRoute(routePoints.map(x => ({lat: x[1], lng: x[0]}))))
        setStatus(Status.finished)
        setIsRunning(false)
    }

    const updateDisplayedRoute = () => {
        if(isDisplayed){
            requestToSetDisplayedRoute([])
            setIsDisplayed(false)
        }
        else{
            requestToSetDisplayedRoute(solutionRoute.map(x => ({lat: x[1], lng: x[0]})))
            setIsDisplayed(true)
        }
    }

    return (
        <div className="flex flex-col text-xs">
            <h2 className="font-bold">{name}</h2>
            <div className="flex justify-between gap-3">
                <div>
                    <p className="w-48">Status: {status}</p>
                    <p>Time to solve: {(seconds!== 0 && milliseconds !== 0) ? `${seconds}.${milliseconds}`: "NA"}</p>
                    <p>Cost: {calculateCost()}</p>
                    <p onClick={updateDisplayedRoute}>{isDisplayed ? "Hide": "Show"}</p>
                </div>
                <div style={{ width: '50px', height: '50px' }}>
                    {isRunning && <ClipLoader size={20} />}
                </div>
            </div>
        </div>
    );
};

export default Solver;