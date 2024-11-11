import itertools
from abc import ABC
from collections import Counter
from minizinc import Instance, Model, Solver


class AbstractSolver(ABC):
    def solve(self, matrix: [[float]]) -> list[int]:
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
    def solve(self, matrix):
        permutations = list(itertools.permutations([i for i in range(len(matrix))]))

        self.calculateCostFromMatrix(matrix, [0, 1, 2])

        return [1]


class MinizincSolver(AbstractSolver):
    def solve(self, matrix):
        model = Model("model.mzn")

        instance = Instance(Solver.lookup("chuffed"), model)

        instance["n"] = len(matrix)
        instance["distance"] = matrix

        result = instance.solve()

        return [i-1 for i in result["tour"]] + [0]


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