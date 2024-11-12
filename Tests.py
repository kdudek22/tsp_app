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
        result = solver.solve(self. medium_matrix)
        self.assertEqual(len(result), len(self.medium_matrix) + 1)

    def test_first_element_should_be_equal_to_0(self):
        """First element should be equal to 0"""
        solver = MinizincSolver()
        result = solver.solve(self.medium_matrix)
        self.assertEqual(result[0], 0)

    def test_last_element_should_be_equal_to_0(self):
        """In the current setup the solvers always return a solution that goes back to the first element"""
        solver = MinizincSolver()
        result = solver.solve(self.medium_matrix)
        self.assertEqual(result[-1], 0)

    def test_result_are_all_different_except_last_element(self):
        """All element in the result should be unique (except the last element) - we visit every node once"""
        solver = MinizincSolver()
        result = solver.solve(self.medium_matrix)[:-1]  # remove the last element that is always equal to 0

        counter = Counter(result)
        [self.assertEqual(counter[num], 1) for num in counter]

    def test_correct_last_element_if_starting_city_different_than_ending(self):
        """If we pass the startCity and the endCity and they are different the model should adjust to the constraints"""
        solver = MinizincSolver()
        result = solver.solve(self.medium_matrix, startCity=0, endCity=3)

        self.assertEqual(len(result), len(self.medium_matrix))
        self.assertEqual(result[0], 0)
        self.assertEqual(result[-1], 3)

    def test_returns_to_correct_city_on_provided_start_city_and_end_city(self):
        """If we pass a startCity and an endCity and they are the same the result should have the additional route at
        the end back to the start"""
        solver = MinizincSolver()
        result = solver.solve(self.medium_matrix, startCity=2, endCity=2)

        self.assertEqual(len(result), len(self.medium_matrix) + 1)
        self.assertEqual(result[0], 2)
        self.assertEqual(result[-1], 2)
