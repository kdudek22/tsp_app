import unittest
from Solvers import BruteForceSolver, OrderSolver, MinizincSolver, DynamicSolver, GeneticSolver
from collections import Counter


class TestSolver(unittest.TestCase):
    small_matrix = [[1, 2],
                    [3, 4]]

    medium_matrix = [[1, 2, 3, 4],
                     [5, 3, 5, 2],
                     [6, 7, 8, 1],
                     [8, 2, 6, 1]]

    large_matrix = [[85, 81, 15,  0, 44, 31, 18, 48, 45, 60, 92, 55, 92, 41, 83, 55, 11, 15, 55, 11],
                    [91, 64,  8, 53, 80, 71, 84, 51, 29, 65, 50, 22, 89, 84, 78, 27, 23, 59, 31, 44],
                    [83, 23, 66, 73, 17,  6, 61, 63, 15, 67, 63, 66, 43, 66, 26, 39, 72, 24, 45, 62],
                    [91, 13, 88, 53, 33, 73, 35, 98, 48, 54, 54, 60, 40, 50, 54, 74, 35, 52, 35, 84],
                    [23, 49, 58, 33, 50,  7, 76, 48, 10, 93, 34, 27, 98, 84, 65, 53, 78, 78, 96,  0],
                    [98, 91, 19, 66, 59, 47, 35, 11,  5, 29,  6, 21, 36, 64, 25, 66, 89,  2, 72,  5],
                    [85,  4, 59, 83,  9, 23, 49, 99, 25, 50, 69, 74, 64, 62, 11, 83, 91, 61, 81, 54],
                    [19, 93, 52, 36, 72, 19, 79, 48, 95, 30, 17, 46, 85, 14, 86, 52, 47,  0, 20, 46],
                    [99, 82, 12, 84, 80, 47, 48, 11, 74, 66, 26, 69, 10, 60, 33, 32,  6, 99,  2, 88],
                    [73, 18, 26, 42, 15, 15, 29, 40, 46, 80, 27, 82, 88, 76, 30, 80, 23, 71, 50, 53],
                    [37, 62, 36, 16, 46, 86, 99, 20, 86, 87, 17, 28, 97, 82, 32, 72, 40, 88, 10, 71],
                    [71, 49, 77, 96, 73, 87, 53, 68,  7, 71, 96, 45, 17, 45, 78, 20, 29, 53, 68, 92],
                    [90, 76, 78, 35, 69, 63, 41, 44, 73, 63,  7, 51, 46,  8, 97, 93, 35, 50,  8, 24],
                    [36, 11, 52, 66, 95, 55, 90,  4, 95,  4, 74, 46, 52, 35, 75, 10, 92, 71, 91, 27],
                    [72,  1, 57, 82, 34, 42, 86, 40, 30, 92, 74, 39, 64,  8, 10,  7, 56, 61, 88,  4],
                    [61, 28, 84, 30, 69, 28, 12, 49, 98, 64, 97, 39, 19, 51,  7, 17, 26, 87, 50, 51],
                    [88, 23, 17, 53, 50, 82, 10, 87, 60,  9, 10, 20, 73, 80, 68, 21, 62, 77, 44, 30],
                    [68, 74,  2,  7, 57, 60, 45, 81, 32, 95, 41, 55, 27, 83, 81, 65, 49, 25, 54, 50],
                    [56, 83, 24, 84, 63, 99, 61, 38, 33, 81,  9, 44,  0, 95, 54, 77, 81, 52, 34, 83],
                    [32, 66, 58, 69, 51, 62, 68, 66, 86, 60, 96, 98, 59, 45, 24, 55, 58, 63, 54, 97]]

    def test_result_length(self):
        """The length of a result should be equal to the number of col/rows the matrix has + 1"""
        solver = GeneticSolver()
        result = solver.solve(self. medium_matrix)
        self.assertEqual(len(result), len(self.medium_matrix) + 1)

    def test_first_element_should_be_equal_to_0(self):
        """First element should be equal to 0"""
        solver = GeneticSolver()
        result = solver.solve(self.medium_matrix)
        self.assertEqual(result[0], 0)

    def test_last_element_should_be_equal_to_0(self):
        """In the current setup the solvers always return a solution that goes back to the first element"""
        solver = GeneticSolver()
        result = solver.solve(self.medium_matrix)
        self.assertEqual(result[-1], 0)

    def test_result_are_all_different_except_last_element(self):
        """All element in the result should be unique (except the last element) - we visit every node once"""
        solver = GeneticSolver()
        result = solver.solve(self.medium_matrix)[:-1]  # remove the last element that is always equal to 0

        counter = Counter(result)
        [self.assertEqual(counter[num], 1) for num in counter]

    def test_correct_last_element_if_starting_city_different_than_ending(self):
        """If we pass the startCity and the endCity and they are different the model should adjust to the constraints"""
        solver = GeneticSolver()
        result = solver.solve(self.medium_matrix, startCity=0, endCity=1)

        self.assertEqual(len(result), len(self.medium_matrix))
        self.assertEqual(result[0], 0)
        self.assertEqual(result[-1], 1)

    def test_returns_to_correct_city_on_provided_start_city_and_end_city(self):
        """If we pass a startCity and an endCity and they are the same the result should have the additional route at
        the end back to the start"""
        solver = GeneticSolver()
        result = solver.solve(self.medium_matrix, startCity=1, endCity=1)

        self.assertEqual(len(result), len(self.medium_matrix) + 1)
        self.assertEqual(result[0], 1)
        self.assertEqual(result[-1], 1)
