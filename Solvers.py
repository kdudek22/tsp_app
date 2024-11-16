import itertools
import math
from abc import ABC
from collections import Counter
from minizinc import Instance, Model, Solver


class AbstractSolver(ABC):
    def solve(self, matrix: [[float]], startCity: int = 1, endCity: int = 1) -> list[int]:
        ...

    def assertAllUnique(self, ordering):
        counter = Counter(ordering)
        for num in counter:
            assert(counter[num] == 1)

    def calculateCostFromMatrix(self, matrix: [[float]], ordering: [int]) -> float:
        assert(len(matrix) == len(ordering) == len(matrix[0]))

        self.assertAllUnique(ordering)

        totalCost = 0
        for i in range(len(matrix) - 1):
            totalCost += matrix[ordering[i]][ordering[i+1]]
        return totalCost


class OrderSolver(AbstractSolver):
    def solve(self, matrix):
        return [i for i in range(len(matrix))] + [0]


class BruteForceSolver(AbstractSolver):
    def solve(self, matrix: [[float]], startCity: int = 0, endCity: int = 0) -> list[int]:
        by_permutations = list(
            itertools.permutations([i for i in range(len(matrix)) if i != startCity and i != endCity]))

        print(len(by_permutations))

        permutations = [[startCity] + list(permutation) for permutation in by_permutations] if startCity == endCity else  [[startCity] + list(permutation) + [endCity] for permutation in by_permutations]

        min_cost, best_one = math.inf, None

        for permutation in permutations:
            cost = self.calculateCostFromMatrix(matrix, permutation)
            if cost < min_cost:
                min_cost = cost
                best_one = permutation

        return best_one + ([startCity] if startCity == endCity else [])


class MinizincSolver(AbstractSolver):
    def solve(self, matrix: [[float]], startCity: int = 0, endCity: int = 0) -> list[int]:
        startCity += 1
        endCity += 1

        assert(0 < startCity <= len(matrix))
        assert(0 < endCity <= len(matrix))

        model = Model("model.mzn")

        instance = Instance(Solver.lookup("chuffed"), model)

        instance["n"] = len(matrix)
        instance["distance"] = matrix
        instance["startingCity"] = startCity
        instance["endingCity"] = endCity

        result = instance.solve()

        return [i-1 for i in result["tour"]] + ([startCity - 1] if startCity == endCity else [])


if __name__ == "__main__":

    small_matrix = [[1, 2],
                    [3, 4]]

    medium_small_matrix = [[0, 1, 2],
                           [4, 0, 4],
                           [5, 2, 0]]

    medium_matrix = [[0, 2, 3, 4],
                     [5, 0, 5, 2],
                     [6, 7, 0, 1],
                     [8, 2, 6, 0]]

    solver = MinizincSolver()
    solver.solve(small_matrix)

"""Miniznc array: 
    [| 1, 2, 3
     | 4, 5, 6
     | 5, 6, 7 |]
     
     [| 0, 650, 1035
      | 666, 0, 782
      | 1053, 875, 0 |]
"""