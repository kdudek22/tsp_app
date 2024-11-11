# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from functools import lru_cache
#
#
# app = Flask(__name__)
# CORS(app)
#
#
#
#
#
# def traveling_salesman_solver(dist_matrix):
#     n = len(dist_matrix)
#     all_visited = (1 << n) - 1
#
#     @lru_cache(None)
#     def tsp(mask, pos):
#         if mask == all_visited:
#             return dist_matrix[pos][0], [0]  # Return to start with the path including the starting city
#
#         min_cost = float('inf')
#         best_path = []
#
#         for city in range(n):
#             if not (mask & (1 << city)):  # If city is unvisited
#                 new_cost, path = tsp(mask | (1 << city), city)
#                 new_cost += dist_matrix[pos][city]
#
#                 if new_cost < min_cost:
#                     min_cost = new_cost
#                     best_path = [city] + path  # Add the current city to the path
#
#         return min_cost, best_path
#
#     # Start from city 0 with only the first city visited
#     min_cost, path = tsp(1, 0)
#     return min_cost, [0] + path
#
# @app.route("/solve", methods=["POST"])
# def solve():
#     data = request.get_json()
#     matrix = data.get("matrix")
#
#     total_cost, solution = traveling_salesman_solver(matrix)
#
#     print(matrix)
#     print(solution)
#
#     return jsonify({"total_cost": total_cost, "solution": solution})
#
#

def naive_solver(matrix):
    return [5,5]

if __name__ == '__main__':
    naive_solver([[5,5],[5,1]])
    # app.run(debug=True)
#
# # print(traveling_salesman_solver(distance_matrix))
