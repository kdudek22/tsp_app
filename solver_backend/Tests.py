import unittest
from collections import Counter

from Solvers import MinizincSolver, BruteForceSolver, GeneticSolver, OrderSolver, DynamicSolver


class TestSolver(unittest.TestCase):
    small_matrix = [[1, 2],
                    [3, 4]]

    medium_matrix = [[1, 2, 3, 4],
                     [5, 3, 5, 2],
                     [6, 7, 8, 1],
                     [8, 2, 6, 1]]

    large_matrix = [[2, 3, 9, 7, 4, 0, 1, 6, 8, 5],
                    [1, 8, 6, 0, 3, 7, 9, 4, 2, 5],
                    [4, 7, 3, 9, 6, 8, 2, 5, 0, 1],
                    [0, 2, 8, 1, 5, 4, 6, 3, 7, 9],
                    [6, 5, 1, 3, 7, 9, 0, 8, 4, 2],
                    [9, 0, 5, 4, 2, 1, 3, 7, 6, 8],
                    [8, 1, 0, 6, 9, 5, 7, 2, 3, 4],
                    [3, 9, 7, 8, 4, 6, 5, 1, 2, 0],
                    [7, 4, 2, 5, 8, 3, 1, 9, 0, 6],
                    [5, 6, 4, 2, 1, 3, 8, 0, 9, 7]]

    solvers = [MinizincSolver(), BruteForceSolver(), GeneticSolver(), OrderSolver(), DynamicSolver()]
    matrices = [small_matrix, medium_matrix, large_matrix]

    def test(self):
        for solver in self.solvers:
            for matrix in self.matrices:
                self._test_result_length(solver, matrix)
                self._test_first_element_should_be_equal_to_0(solver, matrix)
                self._test_last_element_should_be_equal_to_0(solver, matrix)
                self._test_result_are_all_different_except_last_element(solver, matrix)
                self._test_correct_last_element_if_starting_city_different_than_ending(solver, matrix)
                self._test_returns_to_correct_city_on_provided_start_city_and_end_city(solver, matrix)

    def _test_result_length(self, solver, matrix):
        """The length of a result should be equal to the number of col/rows the matrix has + 1"""
        result = solver.solve(matrix)
        self.assertEqual(len(result), len(matrix) + 1)

    def _test_first_element_should_be_equal_to_0(self, solver, matrix):
        """First element should be equal to 0"""
        result = solver.solve(matrix)
        self.assertEqual(result[0], 0)

    def _test_last_element_should_be_equal_to_0(self, solver, matrix):
        """In the current setup the solvers always return a solution that goes back to the first element"""
        result = solver.solve(matrix)
        self.assertEqual(result[-1], 0)

    def _test_result_are_all_different_except_last_element(self, solver, matrix):
        """All element in the result should be unique (except the last element) - we visit every node once"""
        result = solver.solve(matrix)[:-1]  # remove the last element that is always equal to 0

        counter = Counter(result)
        [self.assertEqual(counter[num], 1) for num in counter]

    def _test_correct_last_element_if_starting_city_different_than_ending(self, solver, matrix):
        """If we pass the startCity and the endCity and they are different the model should adjust to the constraints"""
        result = solver.solve(matrix, startCity=0, endCity=1)

        self.assertEqual(len(result), len(matrix))
        self.assertEqual(result[0], 0)
        self.assertEqual(result[-1], 1)

    def _test_returns_to_correct_city_on_provided_start_city_and_end_city(self, solver, matrix):
        """If we pass a startCity and an endCity and they are the same the result should have the additional route at
        the end back to the start"""
        result = solver.solve(matrix, startCity=1, endCity=1)

        self.assertEqual(len(result), len(matrix) + 1)
        self.assertEqual(result[0], 1)
        self.assertEqual(result[-1], 1)
