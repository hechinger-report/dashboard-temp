import $ from 'jquery';
import * as d3 from 'd3';
import tooltip from './tooltip';


export function findData(aid, radioValue){
// Determine which variable to port in from the school's JSON file
let aidData;
let chartableAid = aid.yearly_data.slice(2, 9).reverse();

if (radioValue === 'aid_amt'){
  aidData = chartableAid.map(year => {
    $('#aid-placeholder').hide();
    const thisYear = {
      'timescale': year.year,
      'otherGrants': year.avg_amount_other_grant_aid_first_time_full_time_undergrad,
      'pellGrants': year.avg_amount_pell_grants_first_time_full_time_undergrad,
      'fedLoans': year.avg_amount_federal_loans_first_time_full_time_undergrad

    }
    return thisYear;
  });

} else {

  aidData = chartableAid.map(year => {
    $('#aid-placeholder').hide();
    const thisYear = {
      'timescale': year.year,
      'otherGrants': year.perc_first_time_full_time_undergrad_other_grant_aid,
      'pellGrants': year.perc_pell_grants_first_time_full_time_undergrad,
      'fedLoans': year.perc_federal_loans_first_time_full_time_undergrad

    }
    return thisYear;
  });

  }

  return aidData;
}

function isitChartable(data){
  for (let d of data){
    if (d.fedLoans || d.otherGrants || d.pellGrants){
        return true;
      };
  }
}

export function runData(datafile, radioValue) {

  const chartable = isitChartable(datafile);

  if (!chartable) {
    $('#aid-container').hide();
    $('#aid-placeholder').show();
  }

 // responsiveness
 let window_width = $(window).width();
 let fullWidth;
 let fullHeight;

 if (window_width >= 650){
   fullWidth = 600;
   fullHeight = 400;
 } else if (window_width <= 350) {
   fullWidth = 300;
   fullHeight = 290;
 } else {
   fullWidth = window_width - 50;
   fullHeight = fullWidth - 150;
 }

 const commas = d3.format(',');

 // set the dimensions and margins of the graph
 const margin = { top: 20, right: 20, bottom: 30, left: 50 };
 const svg = d3.select('#aid-chart');
 const width = fullWidth - margin.left - margin.right;
 // const height = fullHeight - margin.top - margin.bottom;
 const height = $('#retention-chart').height() - margin.top - margin.bottom;
 const g = svg.append("g")
   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 // set the ranges
 const x = d3.scaleBand().rangeRound([0, width]).padding(1),
     y = d3.scaleLinear().rangeRound([height, 0]),
     z = d3.scaleOrdinal(['#036888','#D2392A','#DAA520']);

 // define the line
 const line = d3.line()
   .x(function(d) { return x(d.timescale); })
   .y(function(d) { return y(d.total); });

 // scale the range of the aidData
 z.domain(d3.keys(datafile[0]).filter(function(key) {
   return key !== "timescale";
 }));

 const trends = z.domain().map(function(name) {
   return {
     name: name,
     values: datafile.map(function(d) {
       return {
         timescale: d.timescale,
         total: +d[name]
       };
     })
   };
 });

 x.domain(datafile.map(d => d.timescale));
 y.domain([0, d3.max(trends, function(c) {
                               return d3.max(c.values, function(v) {return v.total;});
                             })
          ]).nice();

  const newTrends = trends.map((rate) => {
    rate.values = rate.values.filter(item => !(isNaN(item.total)));
    return rate;
  });

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
       if (d.values[i].total){
         keepValues.push(d.values[i]);
       }
     }
     return line(keepValues);
   })


 // Draw the empty value for every point
 const points = g.selectAll('.points')
   .data(trends)
   .enter()
   .append('g')
   .attr('class', 'points')
   .append('text');

 // Draw the circle
 trend
   .style("fill", "#FFF")
   .style("stroke", function(d) { return z(d.name); })
   .selectAll("circle.line")
   .data(function(d){
     let keepValues = [];
     for(var i = 0; i < d.values.length; i++){
       if (isNaN(d.values[i].total) !== false || d.values[i].total !== 0){
         keepValues.push(d.values[i]);
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
           .ticks(5)
           .tickFormat(function(d){
            if (radioValue === 'aid_amt') {
              return `$${commas(d)}`
            } else {
              return `${d}%`
            }})
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


 const timeScales = datafile.map(function(name) { return x(name.timescale); });

 function mouseover() {
   focus.style("display", null);
   d3.selectAll('#aid-chart .points text').style("display", null);
 }
 function mouseout() {
   focus.style("display", "none");
   d3.selectAll('#aid-chart .points text').style("display", "none");
 }
 // TOOLTIP
 function mousemove() {
   tooltip('#aid-chart', this, timeScales, datafile, x, y, z, focus, radioValue !== 'aid_amt');
 }

 } // end rundata

 export default {findData, runData}
