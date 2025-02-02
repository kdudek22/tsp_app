import numpy as np
import requests
import json
import time
from Solvers import AbstractSolver
import matplotlib
matplotlib.use('Agg')



def generate_random_matrix(n: int):
    random_matrix = np.random.rand(n, n) * 100

    np.fill_diagonal(random_matrix, 0)

    return random_matrix


if __name__ == "__main__":

    MIN_NUMBER_OF_VERTICES, MAX_NUMBER_OF_VERTICES = 2, 19

    solvers = {"minizinc", "dynamic", "brute_force", "genetic", "order"}
    # solvers = {"minizinc", "genetic", "order"}
    # solvers = {"minizinc", "genetic"}

    res = {i: {solver: None} for i in range(MIN_NUMBER_OF_VERTICES, MAX_NUMBER_OF_VERTICES) for solver in solvers}

    for i in range(MIN_NUMBER_OF_VERTICES, MAX_NUMBER_OF_VERTICES):
        matrix = generate_random_matrix(i)
        res[i]["matrix"] = matrix.tolist()
        for solver in solvers:
            if solver in ["brute_force", "dynamic"] and i > 13:
                continue
            start = time.time()
            print(f"{solver} {i}")
            try:
                response = requests.post(f"http://127.0.0.1:5000/solve?solver={solver}",
                                         data=json.dumps({"matrix": matrix.tolist()}), headers={"Content-Type": "application/json"})

                response_time = time.time() - start
                solution = json.loads(response.content)["solution"]

                cost = AbstractSolver.calculateCostFromMatrix(matrix, solution)

                res[i][solver] = {"cost": float(cost), "time": response_time}

            except Exception as e:
                print(f"Failed on {solver} {i} {str(e)}")

            with open('all_solvers_data_5.json', 'w') as f:
                json.dump(res, f, indent=4)
