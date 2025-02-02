# TSP App


## Overview

This is a microservices-based application designed to solve small instances of TSP problem. It allows users to input a TSP problem and get multiple solutions using different solvers. The app is built using three services: a web app, a solver service, and an ORS service. Each of these services communicates with one another to provide an optimal solution to the TSP problem.

### Key Features
- **Web App**: A frontend application built with TypeScript and React. React leaflet is used for displaying the map.
- **Solver Service**: A backend service in Python using Flask that exposes REST APIs to solve the TSP problem using various algorithms.
- **ORS Service**: A service responsible for interacting with the Open Route Service for data manipulation and visualizing routes.

## Architecture

The app is structured as a set of independent microservices:
1. **Web App**: Written in TypeScript with React, it provides an interactive interface for users to input TSP problems. The app uses **React Leaflet** to display a map and visualize the routes.
   
2. **Solver Service**: A Flask-based service written in Python that exposes a simple REST API. It hosts multiple solvers:
   - **Brute Force Approach**: Calculates all possible solutions and picks the optimal one.
   - **Genetic Algorithms**: A heuristic-based approach to find an optimal solution through evolutionary processes.
   - **MiniZinc Solver**: A constraint programming-based solver to find the best solution.
   
3. **ORS Service**: A dedicated service that communicates with the **Open Route Service** to gather geospatial data, such as distances between points and routing information. This service facilitates accurate geographic data for the TSP solution.
