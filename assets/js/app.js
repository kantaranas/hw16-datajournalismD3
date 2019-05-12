// //SVG viewport dimensions 
var svgWidth = 1100;
var svgHeight = 600;

var margin = {
  top: 50,
  right: 200,
  bottom: 150,
  left: 200
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//--------------------------------------------------------------------------
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

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating text within scatter circle
function renderText(circleState, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circleState.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));

  return circleState;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  //X axis if conditions  
  if (chosenXAxis === "income") {
    var Xlabel = "Dollars is the Median Income";
  }
  else if (chosenXAxis === "healthcare") {
    var Xlabel = "% Lacks Healthcare";
  }

  else {
    var Xlabel = "% Lives in Poverty";
  }

  //Y axis if conditions  
  if (chosenYAxis === "obesity") {
    var Ylabel = "% Obesity Rate";
  }
  else if (chosenYAxis === "smokes") {
    var Ylabel = "% of People are Smokers";
  }

  else {
    var Ylabel = "is the Average Age";
  }
  
  // D3 tool tip mouseover fuction
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([0, 0])
    .html(function(d) {
      return (`${d.state}<br> ${d[chosenXAxis]} ${Xlabel}<br> ${d[chosenYAxis]} ${Ylabel}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

//----------------------------------------------------------------------------
// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv", function(err, stateData) {
    console.log(stateData);
  if (err) throw err;

  // parse data
  stateData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    data.abbr = data.abbr;

  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(stateData, chosenXAxis);
  var yLinearScale = yScale(stateData, chosenYAxis);


  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);


  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 16)
    .attr("opacity", ".5");


    // Add state abbreviation withon scatter circle
    var circleState = chartGroup.selectAll("stateText")
    .data(stateData)
    .enter()
    .append("text")
    .classed("stateText", true)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))    
    .text(function(d) { return d.abbr})
    .attr("dy", 3)
    .attr("font-size", 9)
    .attr("font-weight", "bold")
    .attr("text-anchor","middle");

  // ------------------------------------------------------------------------

  // Create group of 3 x-axis filter labels - Income, Healthcare, Poverty
  var XComparisonGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);

  var incomeLabel = XComparisonGroup.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("value", "income") // value to grab for event listener
    .classed("active", true) // will make the text vold and black
    .text("Median Income ($)") // D3 tool tip label text value
    .attr("dx", "1em"); //center the x axis label within the graph

  var healthcareLabel = XComparisonGroup.append("text")
    .attr("x", 0)
    .attr("y", 30)
    .attr("value", "healthcare")
    .classed("inactive", true)
    .text("Lacks Healthcare (%)")
    .attr("dx", "1em");
    
  var povertyLabel = XComparisonGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "poverty")
    .classed("inactive", true)
    .text("Lives in Poverty (%)")
    .attr("dx", "1em"); 

  //----------------------------------------------------------------------------
  //create group of 3 y-axis filter labels - Obesity, Smokers, Age
  var YComparisonGroup = chartGroup.append("g")
  .attr("transform", `translate(${0 - margin.left/4}, ${(height/2)})`);

  var obesityLabel = YComparisonGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -50)
    .attr("x", 0)
    .attr("value", "obesity") 
    .classed("active", true)
    .text("Obesity Rate (%)")
    .attr("dy", "2em");

  var smokesLabel = YComparisonGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -95)
    .attr("x", 0)
    .attr("value", "smokes") 
    .classed("inactive", true)
    .text("Smokers by State (%)")
    .attr("dy", "2em");
    
  var ageLabel = YComparisonGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -145)
    .attr("x", 0)
    .attr("value", "age")
    .style("text-anchor", "middle")
    .classed("inactive", true)
    .text("Average Age (Years)")
    .attr("dy", "2em");


  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  XComparisonGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(stateData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);

        //update text with new x values
        circleState = renderText(circleState, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


        if (chosenXAxis === "income") {
          incomeLabel
          .classed("active", true)
          .classed("inactive", false);
          healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
          povertyLabel
          .classed("active", false)
          .classed("inactive", true);  
        }
        else if (chosenXAxis === "healthcare") {
          incomeLabel
          .classed("active", false)
          .classed("inactive", true);
          healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
          povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        }
        else {
          incomeLabel
          .classed("active", false)
          .classed("inactive", true);
          healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
          povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        }
      }
    });

  // y axis labels event listener
  YComparisonGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(stateData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);

        //update text with new y values
        circleState = renderText(circleState, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


        if (chosenYAxis === "obesity") {
          obesityLabel
          .classed("active", true)
          .classed("inactive", false);
          smokesLabel
          .classed("active", false)
          .classed("inactive", true);
          ageLabel
          .classed("active", false)
          .classed("inactive", true);  
        }
        else if (chosenYAxis === "smokes") {
          obesityLabel
          .classed("active", false)
          .classed("inactive", true);
          smokesLabel
          .classed("active", true)
          .classed("inactive", false);
          ageLabel
          .classed("active", false)
          .classed("inactive", true);  
        }

        else {
          obesityLabel
          .classed("active", false)
          .classed("inactive", true);
          smokesLabel
          .classed("active", false)
          .classed("inactive", true);
          ageLabel
          .classed("active", true)
          .classed("inactive", false);

        }
      }
    });

});