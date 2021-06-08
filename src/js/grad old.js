import $ from 'jquery';
import * as d3 from 'd3';
import { clampIndex } from './utils';

// an array of the readable race names for our tooltip. We'll add races that have at least a 5% enrollment
var readableRacePool = ['All races: '];
// our minimum enrollment percentage to include races in the graduation rate chart
const minEnrollment = 4.51;
export function findData(grad, degreetype){

// helper function to test if race meets minimum enrollment
function enrollmentThreshold(race) {

  if ((grad.enrollment[`enrollment_${race}`] / grad.enrollment.total_enrollment) * 100 >= minEnrollment) {
    return true;
  }
}

// Detrermine which variable to port in from the school's JSON file
let gradData;
let chartableGrad = grad.yearly_data.slice(1, 7).reverse();

// global race pool based on data key names.
// note: key for american indian alaskan native varies between 2 and 4 year institutions
const globalRacePool = ['white', 'black', 'hisp', 'asian', 'towmore', 'amerindalasknat', 'nathawpacisl', 'unknown'];
// global list of readable race names
const globalReadableRaces = ['White: ', 'Black: ', 'Hispanic: ', 'Asian: ', '2+ races: ', 'Am. Ind.: ', 'Pac. Isl.: ', 'Unknown: ']

// empty array that we'll populate with races that pass the threshold
const passedRacePool = [];

// if the race meets the minimum enrollment, add it to the passed race pool, along with
// the readable version of that race to the readable race pool
globalRacePool.forEach((race, index) => {
  if (enrollmentThreshold(race) === true) {
    passedRacePool.push(race);
    readableRacePool.push(globalReadableRaces[index]);
  }
});
document.onload = function() {
  console.log("Hello")
  document.getElementById("choose-family-income-bracket").focus(); 
}
if (grad.level === 4 || grad.level === 5 || grad.level === 6){

  gradData = chartableGrad.map(year => {
    $('#grad-rates-container').show();
    $('#grad-placeholder').hide();
    const thisYear = {
        'timescale': '20' + year.year.slice(0,2),
        'allGradPct': {
          'rate':year.grad_rate_associate_3years_total,
          'cohort':year.grad_cohort_associate_3years_total
        },
      }

      // grab the grad rates for each race that meets the minimum enrollment and add it to this Year
      passedRacePool.forEach((race) => {
        thisYear[`${race}GradPct`] = {} 
        thisYear[`${race}GradPct`]['rate'] = year[`grad_rate_associate_3years_${race}`]
        thisYear[`${race}GradPct`]['cohort'] = year[`grad_cohort_associate_3years_${race}`]
      });

    return thisYear;
  });

} else {

  gradData = chartableGrad.map(year => {
      $('#grad-rates-container').show();
      $('#grad-placeholder').hide();
      
      const thisYear = {
        'timescale': '20' + year.year.slice(0,2),
        'allGradPct': {
          'rate':year.grad_rate_bachelors_6years_total,
          'cohort':year.grad_cohort_bachelors_6years_total
        },
      }

      // grab the grad rates for each race that meets the minimum enrollment and add it to this Year
      passedRacePool.forEach((race) => {
        thisYear[`${race}GradPct`] = {} 
        thisYear[`${race}GradPct`]['rate'] = year[`grad_rate_bachelors_6years_${race}`]
        thisYear[`${race}GradPct`]['cohort'] = year[`grad_cohort_bachelors_6years_${race}`]
      });


      return thisYear;
  });
}
  return gradData;

}

function isitChartable(data){
  for (let d of data){
    if (d.allGradPct.rate){
        return true;
      };
  }
}

export function runData(datafile) {
  const chartable = isitChartable(datafile);

  if (!chartable) {
    $('#grad-rates-container').hide();
    $('#grad-placeholder').show();
  }


 // responsiveness
 let window_width = $(window).width();
 let fullWidth;
 let fullHeight;

 if (window_width > 650){
   fullWidth = 600;
   fullHeight = 400;
 } else if (window_width <= 350) {
   fullWidth = 300;
   fullHeight = 350;
 } else {
   fullWidth = window_width - 50;
   fullHeight = (fullWidth * .7) + 90;
 }

 const commas = d3.format(',');

 // set the dimensions and margins of the graph

 const margin = { top: 20, right: 20, bottom: 20, left: 50 };

 const svg = d3.select('#grad-rates-chart');
 const width = fullWidth - margin.left - margin.right;
 const height = $('#grad-rates-chart').height() - margin.top - margin.bottom;

 svg.attr('width', width)
  .attr('height', height);

 const g = svg.append("g")
   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 // set the ranges
 const x = d3.scaleBand().rangeRound([0, width]).padding(1),
     y = d3.scaleLinear().rangeRound([height, 0]),
     z = d3.scaleOrdinal(['#00aeef', '#8531BA','#E4C16F', '#E46F88', '#6FE4CF', '#e9651b','#52b033','#000000']);

   // define the line
  const line = d3.line()
    .x(d => x(d.timescale))
    .y(d => y(d.total));

   // scale the range of the gradData
   z.domain(d3.keys(datafile[0]).filter(function(key) {
     return key !== "timescale";
   }));

   const trends = z.domain().map(function(name) {
     return {
       name: name,
       values: datafile.map(function(d) {
         return {
           timescale: d.timescale,
           total: isNaN(d[name].rate) ? 0 : d[name].rate,
           cohort: isNaN(d[name].cohort) ? 0 : d[name].cohort
         };
       })
     };
   });

   var newTrends = trends.map((race) => {
     race.values = race.values.filter(item => !(isNaN(item.total)));
     return race;
   });
   // Sort the names of races, making sure that "All" is the last loaded into the DOM
   newTrends.sort(function(a, b){
    return d3.ascending(b.name, a.name);
    });
   readableRacePool.sort().reverse();

   // Set the domains
   x.domain(newTrends[0].values.map(d => d.timescale));
   y.domain([0, d3.max(newTrends, function(c) {
     return d3.max(c.values, function(v) {
       return v.total;
     });
   })]);

   // Draw the line
   const trend = g.selectAll(".trend")
     .data(newTrends)
     .enter()
     .append("g")
     .attr("class", "trend");



    trend.append("path")
      .attr("class", "line")
      .attr("d", (d) => {
        let keepValues = [];
        for(var i = 0; i < d.values.length; i++){
          if (d.values[i].cohort > 0){
            keepValues.push(d.values[i]);
          }
        }
        return line(keepValues);
      })
      .style("stroke-dasharray", (d) => {
        if (d.name == "allGradPct") {
          return 0;
        } else {
        return 3;
        }
      })

     // Draw the circle
     trend
       .style("fill", "#FFF")
       .style("stroke", function(d) { return z(d.name); })
       .selectAll("circle.line")
       .data(function(d){
         let keepValues = [];
         for(var i = 0; i < d.values.length; i++){
           if (d.values[i].total){
             keepValues.push(d.values[i]);
           } else {
          }
         }
         return keepValues;
       })
       .enter()
       .append("circle")
       .attr("r", 3)
       .style("stroke-width", 3)
       .attr("cx", function(d) { return x(d.timescale); })
       .attr("cy", function(d) { return y(d.total); });

     // Draw the axis
     g.append("g")
       .attr("class", "axis axis-x")
       .attr("transform", "translate(0, " + height + ")")
       .call(d3.axisBottom(x));

     g.append("g")
       .attr("class", "axis axis-y")
       .call(d3.axisLeft(y)
               .ticks(6)
               .tickFormat(function(d){
                 //return `${d}`
                 return `${d}%`
               })
             );

     const focus = g.append('g')
       .attr('class', 'focus')
       .style('display', 'none');

     focus.append('line')
       .attr('class', 'x-hover-line hover-line')
       .attr('y1' , 0)
       .attr('y2', height);

     svg.append('rect')
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
       .attr("class", "overlay")
       .attr("width", width)
       .attr("height", height)
       .on("mouseover", mouseover)
       .on("mouseout", mouseout)
       .on("mousemove", mousemove);


    // Tip row height necessary in several places
    const tipRowHeight = 18;

    // Add the hidden tooltip rectangle
    const toolTip = svg.append('rect')
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("class", "tooltip-legend")
      .attr("width", '130') // Change to what you need
      .attr("height", trends.length * tipRowHeight + 10) // Calculated height based on num rows
      .style('z-index', 100)
      .style('stroke', 'black')
      .style('stroke-width', 1)
      .style('fill', 'white')
      .style("visibility", "hidden");

    // Add legend item for each item in trends
    newTrends.forEach(function (trend) {
        svg.append('circle')
          .attr('class', `tooltip-circle-${trend.name} tooltip-circle`)
          .style('fill', z(trend.name))
          .style('visibility', 'hidden')
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr('r', 5);

        svg.append('text')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr('class', `tooltip-${trend.name} tooltip-row`)
        .text(trend.name)
        .attr('height', tipRowHeight)
        .style('font-size', '12px')
        .attr('text-anchor', 'start')
        .style('visibility', 'hidden');
    });


    const timeScales = datafile.map(function(name) { return x(name.timescale); });

    function mouseover() {
      // Reveal the tooltip items
      focus.style("display", null);
      toolTip.style("visibility", "visible");
      d3.selectAll('.tooltip-row').style("visibility", "visible");
      d3.selectAll('.tooltip-circle').style("visibility", "visible");
    }

    function mouseout() {
      // Hide the tooltip items
      focus.style("display", "none");
      toolTip.style("visibility", "hidden");
      d3.selectAll('.tooltip-row').style("visibility", "hidden");
      d3.selectAll('.tooltip-circle').style("visibility", "hidden");
    }

    // TOOLTIP
    function mousemove() {
      // Get the mouse position
      var [mouseX, mouseY] = d3.mouse(this);
      // Find the x line to use data for
      const i = d3.bisect(timeScales, mouseX, 1);
      const di = datafile[i-1];
      // Create a vertical line at the datum under inspection
      focus.attr("transform", "translate(" + x(di.timescale) + ",0)");

      // Set up constants for rows
      const mouseOffsetX = 10;
      const mouseOffsetY = 10;
      const rowXPadding = 3;

      // Move the tooltip down and to the right of the mouse
      toolTip
        .attr('x', function(d) { return mouseX + mouseOffsetX; })
        .attr('y', function(d) { return mouseY + mouseOffsetY; })

      // Iterate over each of the trends, setting the text content and position

      const raceNames = readableRacePool;

      newTrends.forEach(function (trend, index) {
        d3.selectAll(`.tooltip-${trend.name}`)
          .text(function() {
              if(+trend.values[clampIndex(i-1, trend.values)].cohort === 0){
                return `${raceNames[index]} N/A`;
              } else {
                return `${raceNames[index]} ${Math.round(+trend.values[clampIndex(i-1, trend.values)].total)}%`;
              }
          })
          .attr('x', mouseX + rowXPadding + mouseOffsetX + 15)
          .attr('y', mouseY + mouseOffsetY + tipRowHeight * (index + 1))

        d3.selectAll(`.tooltip-circle-${trend.name}`)
          .attr('cx', mouseX + rowXPadding + mouseOffsetX + 5)
          .attr('cy', mouseY + mouseOffsetY + tipRowHeight * (index + 1) - 5)
      });

    }

 } // end rundata

 export default {findData, runData}
