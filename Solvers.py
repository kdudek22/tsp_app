import itertools
import math
from abc import ABC
from collections import Counter
from minizinc import Instance, Model, Solver
from utils import log_time
import random
import numpy as np


class AbstractSolver(ABC):
    @log_time
    def solve(self, matrix: [[float]], startCity: int = 0, endCity: int = 0) -> list[int]:
        ...

    def assertAllUnique(self, ordering):
        counter = Counter(ordering)
        for num in counter:
            assert (counter[num] == 1), "The given ordering is not unique"

    def calculateCostFromMatrix(self, matrix: [[float]], ordering: [int]) -> float:
        if ordering[0] == ordering[-1]:  # This is a temporary solution for the GP solver
            ordering = ordering[:-1]

        assert (len(matrix) == len(ordering) == len(matrix[0])), f"Length of the solution has to match matrix dimensions {ordering}, {matrix}"

        self.assertAllUnique(ordering)

        totalCost = 0
        for i in range(len(matrix) - 1):
            totalCost += matrix[ordering[i]][ordering[i + 1]]
        return totalCost


class OrderSolver(AbstractSolver):
    @log_time
    def solve(self, matrix):
        return [i for i in range(len(matrix))] + [0]


class BruteForceSolver(AbstractSolver):
    @log_time
    def solve(self, matrix: [[float]], startCity: int = 0, endCity: int = 0) -> list[int]:
        by_permutations = list(
            itertools.permutations([i for i in range(len(matrix)) if i != startCity and i != endCity]))

        permutations = [[startCity] + list(permutation) for permutation in
                        by_permutations] if startCity == endCity else [[startCity] + list(permutation) + [endCity] for
                                                                       permutation in by_permutations]

        min_cost, best_one = math.inf, None

        for permutation in permutations:
            cost = self.calculateCostFromMatrix(matrix, permutation)
            if cost < min_cost:
                min_cost = cost
                best_one = permutation

        return best_one + ([startCity] if startCity == endCity else [])


class MinizincSolver(AbstractSolver):
    @log_time
    def solve(self, matrix: [[float]], startCity: int = 0, endCity: int = 0) -> list[int]:
        matrix = [[int(value) for value in row] for row in matrix]
        startCity += 1
        endCity += 1

        assert (0 < startCity <= len(matrix))
        assert (0 < endCity <= len(matrix))

        model = Model("model.mzn")

        instance = Instance(Solver.lookup("chuffed"), model)

        instance["n"] = len(matrix)
        instance["distance"] = matrix
        instance["startingCity"] = startCity
        instance["endingCity"] = endCity

        result = instance.solve()

        return [i - 1 for i in result["tour"]] + ([startCity - 1] if startCity == endCity else [])


class DynamicSolver(AbstractSolver):
    @log_time
    def solve(self, matrix: [[float]], startCity: int = 0, endCity: int = 0) -> list[int]:
        n = len(matrix)
        all_cities = [i for i in range(n)]

        visited_cities = [startCity] + [-1] * (n - 1)

        if startCity != endCity:
            visited_cities[len(visited_cities) - 1] = endCity

        def tsp(visited: list[int]):
            if all(i != -1 for i in visited):
                return visited

            min_cost = float("inf")
            best_path = []

            for c in all_cities:
                if c not in visited:
                    cities_copy = visited.copy()
                    cities_copy[visited.index(-1)] = c

                    solution = tsp(cities_copy)

                    cost = self.calculateCostFromMatrix(matrix, solution)
                    if cost < min_cost:
                        min_cost = cost
                        best_path = solution

            return best_path

        return tsp(visited_cities) + ([startCity] if startCity == endCity else [])


class GeneticSolver(AbstractSolver):
    def __init__(self):
        self.matrix = None
        self.start_city = None
        self.end_city = None
        self.population_size: int = 500
        self.num_of_generations: int = 500

    def create_individual(self, n, start_city, end_city) -> list[int]:
        """Creates a random list representing the path, the start city and end city are placed correctly, rest is
        randomized"""
        random_ordering = list(set(i for i in range(n)) - set([start_city, end_city]))
        random.shuffle(random_ordering)
        return [start_city] + random_ordering + [end_city]

    def create_population(self) -> list[list[int]]:
        return [self.create_individual(len(self.matrix), self.start_city, self.end_city) for _ in range(self.population_size)]

    def mutate(self, individual: list[int]) -> list[int]:
        """Takes in an individual, copies, mutates and then returns it"""
        c_individual = individual.copy()

        if len(c_individual) <= 4:
            return c_individual

        i, j = random.sample(range(1, len(self.matrix) -1), 2)
        c_individual[i], c_individual[j] = c_individual[j], c_individual[i]

        assert len(c_individual) == len(individual)

        return c_individual

    def tournament_select(self, population, fitnesses, tournament_size=5):
        """Pick random {tournament_size} nodes and return the one with the best(lowest) fitness"""
        tournament_indices = random.sample(range(len(population)), tournament_size)
        tournament_individuals = [population[i] for i in tournament_indices]
        tournament_fitnesses = [fitnesses[i] for i in tournament_indices]

        winner_index = tournament_fitnesses.index(min(tournament_fitnesses))
        return tournament_individuals[winner_index]

    def crossover(self, parent1: list[int], parent2: list[int]):
        """Perform ordered crossover between two parents. Take some portion from parent1 and fill the rest with other"""
        assert parent1[0] == parent2[0] and parent1[-1] == parent2[-1], "Start and end cities have to be the same"
        assert len(parent1) == len(parent2), "Length soh"

        if len(parent1) <= 4:
            return parent1

        start, end = sorted(random.sample(range(1, len(parent1) -1), 2))
        child: list[int | None] = [None] * (len(parent1))
        child[start:end] = parent1[start:end]
        child[0] = parent1[0]
        child[-1] = parent1[-1]

        pointer = 0
        for city in parent2:
            if city not in child:
                while child[pointer] is not None:
                    pointer += 1
                child[pointer] = city

        assert len(child) == len(parent1) == len(parent2)
        return child

    def evolve(self, population: list[list[int]]):
        new_population = []
        fitnesses = [self.calculateCostFromMatrix(self.matrix, p) for p in population]

        for p in population:
            p_copy = p.copy()
            r = random.random()
            if r < 0.4:
                new_population.append(self.mutate(p.copy()))
            elif r < 0.7:
                parent_1, parent_2 = self.tournament_select(population, fitnesses), self.tournament_select(population, fitnesses)
                new_population.append(self.crossover(parent_1, parent_2))
            else:
                new_population.append(p_copy)

        return new_population

    @log_time
    def solve(self, matrix: [[float]], startCity: int = 0, endCity: int = 0) -> list[int]:
        self.matrix = matrix
        self.start_city = startCity
        self.end_city = endCity

        population = self.create_population()
        best_individual = None
        best_fitness = float("inf")  # for use the fitness is the cost of the path: lower = better

        for generation in range(100):
            population_fitness = [self.calculateCostFromMatrix(matrix, p) for p in population]

            current_best_index = np.argmin(population_fitness)
            current_best_fitness = population_fitness[current_best_index]

            if current_best_fitness < best_fitness:
                best_fitness = current_best_fitness
                best_individual = population[current_best_index].copy()

            population = self.evolve(population)

        return best_individual


class BranchAndBoundSolver(AbstractSolver):
    def solve(self, matrix: [[float]], startCity: int = 1, endCity: int = 1) -> list[int]:
        pass


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

    solver = GeneticSolver()
    res = solver.solve(medium_matrix, startCity=0, endCity=0)

"""Miniznc array: 
    [| 1, 2, 3
     | 4, 5, 6
     | 5, 6, 7 |]
     
     [| 0, 650, 1035
      | 666, 0, 782
      | 1053, 875, 0 |]
"""
