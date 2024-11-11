include "globals.mzn";

int: n;  % Number of cities
array[1..n, 1..n] of int: distance;  % Distance matrix
array[1..n] of var 1..n: tour;  % Tour order
var int: total_cost;  % Total cost of the tour

% Start at the first city
constraint tour[1] = 1;

constraint alldifferent(tour);


constraint total_cost = sum([distance[tour[i], tour[i+1]] | i in 1..n-1])
                       + distance[tour[n], tour[1]];

% Objective: Minimize the total cost
solve minimize total_cost;