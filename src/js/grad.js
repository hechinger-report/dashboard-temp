import $ from 'jquery';
import * as d3 from 'd3';
import * as d3Symbol from 'd3-symbol-extra';
import { clampIndex } from './utils';
// import d3Ease from 'd3-ease';

// an array of the readable race names for our tooltip. We'll add races that have at least a 5% enrollment
var readableRacePool = ['TOTAL'];
// our minimum enrollment percentage to include races in the graduation rate chart
const minEnrollment = 4.51;
let nationalAverage = [[59.7, 63.48, 40.04, 53.78, 72.46, 61.74, 49.48, 39.78, -100, 67.88],[29.64, 30.92, 22.86, 30.9, 35.68, 25.22, 34.64, 25.14,-100, 35.42]];

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
const globalRacePool = ['white', 'black', 'hisp', 'asian', 'twomore', 'amerindalasknat', 'nathawpacisl', 'unknown'];
// global list of readable race names
const globalReadableRaces = ["WHITE","BLACK / AFRICAN-AMERICAN", "HISPANIC / LATINO", "ASIAN", "TWO OR MORE RACES", "AMERICAN INDIAN / ALASKA NATIVE", "NATIVE HAWAIIAN / PACIFIC ISLANDER",  "NO RACE REPORTED"];
const raceColors = ['#000000','#00aeef', '#8531BA', '#E46F88', '#E4C16F','#6FE4CF', '#e9651b','#52b033'];

// empty array that we'll populate with races that pass the threshold
const passedRacePool = [];

// if the race meets the minimum enrollment, add it to the passed race pool, along with
// the readable version of that race to the readable race pool
globalRacePool.forEach((race, index) => {
    passedRacePool.push(race);
    readableRacePool.push(globalReadableRaces[index]);
});

document.onload = function() {
  console.log("Document onload")
}

if (grad.level === 4 || grad.level === 5 || grad.level === 6){

  gradData = chartableGrad.map(year => {
    $('#grad-rates-container').show();
    $('#grad-placeholder').hide();
    const thisYear = {
        'sector': 1,
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
        'sector': 0,
        'timescale': '20' + year.year.slice(0,2),
        'allGradPct': {
          'rate':year.grad_rate_bachelors_6years_total,
          'cohort':year.grad_cohort_bachelors_6years_total
        },
      }

      // grab the grad rates for each race that meets the minimum enrollment and add it to this Year
      passedRacePool.forEach((race) => {
        let averageGrad = [];

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
 // let window_width = $(window).width();
 // let fullWidth;
 // let fullHeight;

 // if (window_width > 650){
 //   fullWidth = 600;
 //   fullHeight = 400;
 // } else if (window_width <= 350) {
 //   fullWidth = 300;
 //   fullHeight = 350;
 // } else {
 //   fullWidth = window_width - 50;
 //   fullHeight = (fullWidth * .7) + 90;
 // }
 
 const commas = d3.format(',');

 // set the dimensions and margins of the graph
 const margin = {top: 0, right: 25, bottom: 130, left: 0},
      height = 500 - margin.top - margin.bottom;

  let windowWidth;
  if ($(window).width() <= 650 ) {
    windowWidth = $('#demographics').width();
  } else {
    windowWidth = $(window).width()
  }

  const width = Math.min(625, $(window).width() - margin.left - margin.right);
  const barWidth = 25;
  const barSpace = 8;
  const chartHeight = 200;
  const chartWidth = Math.min(600, windowWidth);
  

  const x = d3.scaleLinear()
            .domain([0, 100])
            .range([0, chartWidth]);

  const globalRacePool = ['all','white', 'black', 'hisp', 'asian', 'twomore', 'amerindalasknat', 'nathawpacisl', 'unknown'];
  const globalReadableRaces = ["TOTAL","WHITE","BLACK / AFRICAN-AMERICAN", "HISPANIC / LATINO", "ASIAN", "TWO OR MORE RACES", "AMERICAN INDIAN / ALASKA NATIVE", "NATIVE HAWAIIAN / PACIFIC ISLANDER", "NO RACE REPORTED"];

  const raceColors = ['#000000','#00aeef', '#8531BA', '#E4C16F', '#E46F88','#6FE4CF', '#e9651b','#52b033', 'grey'];
  let rectangles = globalRacePool.map(function(race) {
    
    let averageGrad = datafile[3][`${race}GradPct`]['rate']
    
    return {
      label: race,
      value: averageGrad
    };
  })

  const svg = d3.select('#grad-rates-chart')
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom);

var group = svg.selectAll('g')
  .data(rectangles)
  .enter().append("g")
  .attr("transform", (d, i) => {
    return "translate(" + margin.left + "," + ((i * 45) + margin.top) + ")"
  })
  .attr("class", (d, i) => { return d.label })

group.append("rect")
        .attr("class", "dummy-bar")
        .attr("width", chartWidth)
        .attr("y", 0)
        .attr("x", 0)
        .attr("height", barWidth + 20)
        .attr("fill", "white");

group.append("rect")
        .attr("class", "backBar")
        .attr("width", chartWidth)
        .attr("y", 0)
        .attr("x", 0)
        .attr("height", barWidth)
        .attr("fill", "#ebebeb");

group.append("rect")
        .attr("class", "bar-fill")
        .attr("width", 0)
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", barWidth)
        .attr("fill", function (d, i) { return d3.rgb(raceColors[i]).darker(.5)})
        .transition()
        .delay(function (d, i) { 
          return i*40; })
        .attr("width", function (d, i) { 
          return x(d.value); 
        })
group.append("text")
        .attr("class", "bar-label")
        .attr("x", 0)
        .attr("y", 17)
        .text(function(d, i) { 
          if (d.value == null || isNaN(d.value)) {
            return "N/A"
          } else {
            return Math.round(d.value) + "%"}
          })
          
        .attr("fill", function (d, i) { 
          if (d.value == null || isNaN(d.value)) {
            return "#c4c4c4"
          }
          else if (d.value < 90){
            return "black"; 
          } else {
            return "white"; 
          }
        })
        .attr("opacity", 0)
        .transition()
        .delay(function (d, i) { 
          return i*40 + 80; })
        .attr("opacity", 1)
        .attr("x", function (d, i) { 
          if (d.value == null || isNaN(d.value)) {
            return x(50)
          } 
          else if (d.value < 90){
            return x(d.value) + 5; 
          } else {
            return x(d.value) - 40; 
          }
        })
group.append("text")
        .classed("label", true)
        .attr("height", 70)
        .attr("x", 0)
        .attr("y", 38)
        .attr("dy", 0)
        .text((d, i) => { 
          return globalReadableRaces[i]})
        .attr("opacity", 0)
        .transition()
        .delay(function (d, i) { 
          return i*40 + 500; })
        .attr("opacity", 1)

    
group.append("path")
        .attr("class", "triangle")
      .attr("transform", function(d, i) { return "translate(" + 0 + "," + -10 + ")"; })
      .attr("d", d3.symbol().size(30).type(d3.symbolTriangle))
      .attr("pointer-events", "none")
      .attr("opacity", 0)
        .transition()
        .duration(1050)
        .ease(d3.easeElastic)
        .delay(function (d, i) { 
          return i*40 + 1000; })
        .attr("opacity", function(d, i) {
          if (i < 1) {
            return 1
          } else {
            return 0
          }
        })
        .attr("transform", function(d, i) { 
          return "translate(" + x(nationalAverage[datafile[0].sector][i]) + "," + -10 + ") rotate(-60)"; })

    group.append("text")
        .attr("class", "triangle-label")
              .attr("height", 70)
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", chartWidth)
        .attr("pointer-events", "none")
        .attr("transform", function(d, i) { return "translate(" + 10 + "," + -7 + ")"; })
        .attr("dy", 0)
        .text((d, i) => { 
          return "NAT'L AVERAGE"})
        .attr("font-size", 12)
        .attr("opacity", 0)
        .transition()
        .duration(1050)
        .ease(d3.easeElastic)
        .delay(function (d, i) { 
          return i*40 + 1000; })
        .attr("opacity", function(d, i) {
          if (i < 1) {
            return 1
          } else {
            return 0
          }
        })
        .attr("text-anchor", "beginning")
        .attr("transform", function(d, i) { 
          if (nationalAverage[datafile[0].sector][i] > 50) {
            return "translate(" + (x(nationalAverage[datafile[0].sector][i]) - 105) + "," + -4 + ")";
          } else {
            return "translate(" + (x(nationalAverage[datafile[0].sector][i]) + 10) + "," + -4 + ")";
          }
        })

   setTimeout(function() {
    group.on("mouseover", function(d, i) {
        d3.select(".all").selectAll(".triangle-label,.triangle")
          .transition()
          .duration(250)
          .attr("opacity", 0)
        d3.select(this).selectAll(".triangle-label,.triangle")
          .transition()
          .delay(60)
          .duration(250)
          .attr("opacity", 1)
      })
        .on("mouseout", function(d, i) {
          d3.select(".all").selectAll(".triangle-label,.triangle")
            .transition()
            .duration(250)
            .delay(60)
            .attr("opacity", 1)
          d3.select(this).selectAll(".triangle-label,.triangle")
            .transition()
            .duration(250)
            .attr("opacity", 0)
        })
      }, 1500)
 } // end rundata

 export default {findData, runData}
