include "globals.mzn";
include "alldifferent.mzn";


%%% INPUT %%%
int: n;  % Number of cities
array[1..n, 1..n] of int: distance;  % Distance matrix
int: startingCity;
int: endingCity;


%%% VARIABLES %%%
array[1..n] of var 1..n: tour;  % Tour order
var int: total_cost;  % Total cost of the tour


%%% CONSTRAINTS %%%

% Start at the first city
constraint tour[1] = startingCity;

% If the endCity is different from the starting city, we should finish in the last city
constraint
    if startingCity != endingCity then
        tour[n] = endingCity
    endif;

% Cities do not repeat in the solution
constraint alldifferent(tour);



constraint total_cost = sum([distance[tour[i], tour[i+1]] | i in 1..n-1]);

% Objective: Minimize the total cost
solve minimize total_cost;