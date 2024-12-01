from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import lru_cache
from Solvers import AbstractSolver, MinizincSolver, BruteForceSolver, DynamicSolver, GeneticSolver

app = Flask(__name__)
CORS(app)


solvers = {"minizinc": MinizincSolver, "dynamic": DynamicSolver, "brute_force": BruteForceSolver,
           "genetic": GeneticSolver}


def get_solver_from_name(solver_name: str) -> AbstractSolver | None:
    """Given the solver name return the correct solver from the solvers map, if the solver name is not in the map
    return None"""
    return solvers[solver_name]() if solver_name in solvers else None


def traveling_salesman_solver(dist_matrix):
    n = len(dist_matrix)
    all_visited = (1 << n) - 1

    @lru_cache(None)
    def tsp(mask, pos):
        if mask == all_visited:
            return dist_matrix[pos][0], [0]  # Return to start with the path including the starting city

        min_cost = float('inf')
        best_path = []

        for city in range(n):
            if not (mask & (1 << city)):  # If city is unvisited
                new_cost, path = tsp(mask | (1 << city), city)
                new_cost += dist_matrix[pos][city]

                if new_cost < min_cost:
                    min_cost = new_cost
                    best_path = [city] + path  # Add the current city to the path

        return min_cost, best_path

    # Start from city 0 with only the first city visited
    min_cost, path = tsp(1, 0)
    return min_cost, [0] + path


@app.route("/solve", methods=["POST"])
def solve():
    try:
        data = request.get_json()
        matrix = data.get("matrix")

        solver_name = request.args.get("solver")

        if not solver_name:
            return jsonify({"error": f"No solver supplied, set it with the query parameter 'solver', possible options are {', '.join('\''+s+'\'' for s in solvers.keys())}"}), 400

        solver = get_solver_from_name(solver_name)

        if solver is None:
            return jsonify({"error": f"No such solver: '{solver_name}', possible options are {' ,'.join('\''+s+'\'' for s in solvers.keys())}"})

        solution = solver.solve(matrix)

        return jsonify({"solution": solution})
    except Exception as e:
        print(e)


@app.route("/minizinc", methods=["POST"])
def asd():
    data = request.get_json()
    matrix = data.get("matrix")
    start_city = data.get("start_city", 0)
    end_city = data.get("end_city", 0)
    int_matrix = [[int(value) for value in row] for row in matrix]

    solution = MinizincSolver().solve(int_matrix, start_city, end_city)

    return jsonify({"solution": solution})


@app.route("/brute_force", methods=["POST"])
def bas():
    data = request.get_json()
    matrix = data.get("matrix")
    start_city = data.get("start_city", 0)
    end_city = data.get("end_city", 0)
    int_matrix = [[int(value) for value in row] for row in matrix]

    solution = BruteForceSolver().solve(int_matrix, start_city, end_city)

    return jsonify({"solution": solution})


if __name__ == '__main__':
    app.run(debug=True)