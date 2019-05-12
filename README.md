# Data Journalism and D3

## D3 Interactive Scatter Plot

![Webpage](assets/images/webpage.png)

--------------------------------------------------------------------------

## Census Data

The editor wants to run a series of feature stories about the health risks facing particular demographics. She's counting on me to sniff out the first story idea by sifting through information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System.

![csv data](assets/images/data.png)

--------------------------------------------------------------------------

## My Task

Create a scatter plot between two of the data variables such as Income vs. Obesity or Smokers vs. Healthcare


Create a scatter plot that represents each state with circle elements. Pull in the data from data.csv by using the d3.csv function.

* Include state abbreviations in the circles.

* Create and situate your axes and labels to the left and bottom of the chart.

### Bind the scatter circles and text within the circles

```js
// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .classed("chart", true);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "income";
var chosenYAxis = "obesity";


// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
      d3.max(stateData, d => d[chosenXAxis])])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(stateData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8,
      d3.max(stateData, d => d[chosenYAxis]) * 1.2])
    .range([height, 0]);

  return yLinearScale;

}
```js


