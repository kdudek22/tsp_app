import unittest
from Solvers import BruteForceSolver, OrderSolver, MinizincSolver
from collections import Counter


class TestSolver(unittest.TestCase):
    small_matrix = [[1, 2],
                    [3, 4]]

    medium_matrix = [[1, 2, 3, 4],
                     [5, 3, 5, 2],
                     [6, 7, 8, 1],
                     [8, 2, 6, 1]]

    def test_result_length(self):
        """The length of a result should be equal to the number of col/rows the matrix has + 1"""
        solver = MinizincSolver()
        result = solver.solve(self.small_matrix)
        self.assertEqual(len(result), len(self.small_matrix) + 1)

    def test_first_element_should_be_equal_to_0(self):
        """First element should be equal to 0"""
        solver = MinizincSolver()
        result = solver.solve(self.small_matrix)
        self.assertEqual(result[0], 0)

    def test_last_element_should_be_equal_to_0(self):
        """In the current setup the solvers always return a solution that goes back to the first element"""
        solver = MinizincSolver()
        result = solver.solve(self.small_matrix)
        self.assertEqual(result[-1], 0)

    def test_result_are_all_different_except_last_element(self):
        """All element in the result should be unique (except the last element) - we visit every node once"""
        solver = MinizincSolver()
        result = solver.solve(self.small_matrix)[:-1]  # remove the last element that is always equal to 0

        counter = Counter(result)
        [self.assertEqual(counter[num], 1) for num in counter]
