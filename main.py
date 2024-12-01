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


@app.route("/solve", methods=["POST"])
def solve():
    data = request.get_json()
    matrix = data.get("matrix")

    solver_name = request.args.get("solver")

    if not solver_name:
        return jsonify({"error": f"No solver supplied, set it with the query parameter 'solver', possible options are {', '.join('\''+s+'\'' for s in solvers.keys())}"}), 400

    solver = get_solver_from_name(solver_name)

    if solver is None:
        return jsonify({"error": f"No such solver: '{solver_name}', possible options are {' ,'.join('\''+s+'\'' for s in solvers.keys())}"})
    try:
        solution = solver.solve(matrix)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"solution": solution})


if __name__ == '__main__':
    app.run(debug=True)