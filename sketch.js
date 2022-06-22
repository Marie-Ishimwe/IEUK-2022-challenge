// A function that loops through the array 
// to check if the array has the element that was visited 
// and removes it from that array from backward
function dropSpot(arr, element){
  for (var i = arr.length -1; i>= 0; i--){
      if (arr[i] == element){
          arr.splice(i, 1);
      }
      
  }
}

// Function to calculate the heuristic distance h(x) 
// using the Manhattan distance formula
function heuristic(a, b){
  var d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}

var columns = 9;
var rows = 9;
var grid = new Array(columns);

// Array containing nodes that have finished being evaluted
var openSet = [];
// Array containing nodes that still need to be evaluated
var closedSet = [];
var start;
var end;
var width, height;
var path = [];

// A constructor function containing features 
// of each cell/spot
function Spot(i, j){
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.obstacle = false;

  // Generating random obstacles with probability 
  // of 40% of them to apper in the whole grid
  if(random(1) < 0.4){
      this.obstacle = true;
  }

  this.show = function(col){
      fill(col);
      if (this.obstacle){
          fill(0);
      }
      noStroke();
      rect(this.i * width, this.j * height, width-1, height-1); 

  }

  // Function to add neighbors from a particular grid
  this.addNeighbors = function(grid)
  {
      var i = this.i;
      var j = this.j;

      // Pushing the 4 neighbors of a grid into an array
      if(i < columns-1)
      {
      this.neighbors.push(grid[i+1][j]);

      }
      if(i > 0){
          this.neighbors.push(grid[i-1][j]);
      }  
      
      if(j < rows - 1){
          this.neighbors.push(grid[i][j+1]);
      }
      
      if(j > 0){
          this.neighbors.push(grid[i][j-1]);
      }

      if(i > 0 && j > 0){
          this.neighbors.push(grid[i-1][j-1]);
      }

      if(i < columns - 1 && j > 0){
          this.neighbors.push(grid[i+1][j-1]);
      }
      
      if(i > 0 && j < rows - 1){
          this.neighbors.push(grid[i-1][j+1]);
      }

      if(i < columns - 1 && j < rows - 1){
          this.neighbors.push(grid[i+1][j+1]);
      }
  }
}

function setup(){
  createCanvas(400, 400);
  console.log('IEUK - 2022 challenge solution!');

  width = width/columns;
  height = height/rows;


  // Making a 2D array
  for( var i = 0; i < columns; i++){
      grid[i] = new Array(rows);
  }

  // Making grids
  for( var i =0; i < columns; i++){
      for( var j = 0 ; i < rows; j++){
          grid[i][j] = new Spot(i,j);
      }
  }


  // Adding neighbors to each grid
  for( var i = 0; i < columns; i++){
      for( var j = 0; i < rows; j++){
          grid[i][j].addNeighbors(grid);
      }
  }

  start = grid[0][0];  // starting point of the path
  end = grid[colums - 1][rows - 1];  // destination of the path

  // setting obstacles in spots which originally had obstacles
  grid[7][7].obstacle = true;
  grid[7][8].obstacle = true;
  grid[7][9].obstacle = true;
  grid[8][7].obstacle = true;

  // setting a conditon that the start and endpoints should not contain obstacles
  start.obstacle = false;
  end.obstacle = false;

  openSet.push(start);

}

function draw(){
  background(0);
  if (openSet.length > 0){

      var winner = 0;
      for(var i = 0; i < openSet.length; i++){
          if (openSet[i].f < openSet[winner].f){
              winner = i;
          }
      }

      var current = openSet[winner];

      //  If we have reached to the bottom 
      // right corner of our 10X10 grid
      if (current === end){
          noLoop();
          console.log("The End!")
      }

      dropSpot(openSet, current);
      closedSet.push(current);

      var neighbors = current.neighbors[i];

      for (var i = 0; i < neighbors.length; i++){
          var neighbor = neighbors[i];

          var newPath = false;
          if (!closedSet.includes(neighbor) && !neighbor.obstacle) {
              var tempG = current.g + 1;

              if(openSet.includes(neighbor)) {
                  if (tempG < neighbor.g){
                      neighbor.g = tempG;
                      newPath = true;
                  }
              }
              else{
                  neighbor.g = tempG;
                  newPath = true;
                  openSet.push(neighbor);
              }

              if(newPath){

                  neighbor.h = heuristic(neighbor, end);
                  neighbor.f = neighbor.g + neighbor.h;
                  neighbor.previous = current;
              }

          }
      }

  }
  else{
      console.log("Unable to reach delivery point!");
      noLoop();
      return;
      
  }


  for (var i = 0; i < columns; i++){
      for (var j =0; j< rows; j++){
          grid[i][j].show(color(255));
      }
  }

// Setting the color of the closed path to red
  for ( var i = 0; i < closedSet.length; i++){
      closedSet[i].show(color(255, 0, 0));
  }

  // Setting the color of the closed path to green
  for ( var j = 0; i < openSet.length; i++){
      openSet[i].show(color(0, 255, 0));
  }

  // Finding the path
  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous){
      path.push(temp.previous);
      temp = temp.previous;
  }

  // Setting the color of the closed path to blue
  for (var i = 0; i < path.length; i++){
      path[i].show(color(0, 0, 255));
  }
  
}
