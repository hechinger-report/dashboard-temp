import $ from 'jquery';
import * as d3 from 'd3';
import tooltip from './tooltip';


export function findData(price, selectedNetPrice){
  // Determine which variable to port in from the school's JSON file
  let chartablePrice = price.yearly_data.slice(0, 11).reverse();

  let schoolString;
  let schoolPrice;
  let campusLiving;
  let schoolPrices

  // const { schoolNyetPriceA, schoolNyetPriceB, schoolNyetPriceC, schoolNyetPriceD, schoolNyetPriceE } = schoolPrices;

    schoolString = "public"


  if (selectedNetPrice === 1){
    schoolPrice = "0_30000"
  } else if (selectedNetPrice === 2){
    schoolPrice = "30001_48000"
  } else if (selectedNetPrice === 3){
    schoolPrice = "48001_75000"
  } else if (selectedNetPrice === 4){
    schoolPrice = "75001_110000"
  } else {
    schoolPrice = "110001"
  }

  const priceData = chartablePrice.map(year => {
      // Determine most complete trend between on- and off-campus
      let stickerPriceType = 'price_instate_oncampus';
      let onCampusCount = 0;
      let offCampusCount = 0;
      for (let priceYear in chartablePrice) {
        if (chartablePrice[priceYear].price_instate_oncampus > 1) {
          onCampusCount += 1;
        }
        if (chartablePrice[priceYear].price_instate_offcampus_nofamily > 1) {
          offCampusCount += 1;
        }
      }
      if (offCampusCount > onCampusCount) {
        stickerPriceType = 'price_instate_offcampus_nofamily'
      } 

      const thisYear = {
        'timescale': year.year,
        'stickerPrice': year[`${stickerPriceType}`],
        'stickerPriceType': stickerPriceType,
        'nyetPriceA': year[`avg_net_price_0_30000_titleiv_privateforprofit`],
        'nyetPriceB': year[`avg_net_price_30001_48000_titleiv_privateforprofit`],
        'nyetPriceC': year[`avg_net_price_48001_75000_titleiv_privateforprofit`],
        'nyetPriceD': year[`avg_net_price_75001_110000_titleiv_privateforprofit`],
        'nyetPriceE': year[`avg_net_price_110001_titleiv_privateforprofit`],
        'netPrice': year[`avg_net_price_${schoolPrice}_titleiv_privateforprofit`]
      }
      return thisYear;
  });
  return priceData;
}


function isitChartable(data){
  for (let d of data){
    if ((d.stickerPriceOnCampus || d.stickerPriceOffCampus) && d.netPrice){
        return true;
      };
  }
}


export function runData(datafile) {
  const chartable = isitChartable(datafile);

  if (!chartable) {
    $('#sticker-price-container').hide();
  }


 // responsiveness
 let window_width = $(window).width();
 let fullWidth;
 let fullHeight;

 if (window_width >= 650){
   fullWidth = 600;
   fullHeight = 400;
 } else if (window_width <= 350) {
   fullWidth = 200;
   fullHeight = 290;
 } else {
   fullWidth = window_width - 180;
   fullHeight = fullWidth - 150;
 }

 const commas = d3.format(',');

 // set the dimensions and margins of the graph
 const margin = { top: 20, right: 20, bottom: 30, left: 50 };
 const svg = d3.select('#sticker-price-chart');
 const width = fullWidth - margin.left - margin.right;
 const height = $('#sticker-price-chart').height() - margin.top - margin.bottom;

  // set the ranges
 const x = d3.scaleBand().rangeRound([0, width]).padding(1),
     y = d3.scaleLinear().rangeRound([height, 0]),
     z = d3.scaleOrdinal(['#036888','#D2392A','#D2392A','#D2392A']);

 const nx = d3.scaleBand().rangeRound([0, width]).padding(1),
     ny = d3.scaleLinear().rangeRound([height, 0]);

 var svgDefs = svg.append('defs');

 var mainGradient = svgDefs.append('linearGradient')
    .attr('id', 'mainGradient');

// Create the stops of the main gradient. Each stop will be assigned
// a class to style the stop using CSS.
 mainGradient.append('stop')
    .attr('class', 'stop-left')
    .attr('offset', '0');

 mainGradient.append('stop')
    .attr('class', 'stop-right')
    .attr('offset', '.1');

// Use the gradient to set the shape fill, via CSS.
 var filled = svg.append('rect')
    .classed('filled', true);

 const g = svg.append("g")
   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 // define the line
 const line = d3.line()
   .x(function(d) { return x(d.timescale); })
   .y(function(d) { return y(d.total); });

 // scale the range of the priceData
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

 nx.domain(datafile.map(d => d.timescale));

 ny.domain([0, d3.max(trends, function(c) {
                               return d3.max(c.values, function(v) {return v.total;});
                             }) + 500
          ]).nice();

  const newTrends = trends.map((rate) => {
    rate.values = rate.values.filter(item => !(isNaN(item.total)));
    return rate;
  });

  x.domain(newTrends[0].values.map(d => d.timescale));
  y.domain([0, d3.max(newTrends, function(c) {
    return d3.max(c.values, function(v) {
      return v.total * 1.1;
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
   .style("stroke-dasharray", (d) => {
        if (d.name.includes('nyet')) {
          return 3;
        }
      })


 // Draw the empty value for every point
 const points = g.selectAll('.points')
   .data(trends)
   .enter()
   .append('g')
   .attr('class', (d)=>{
    if (d.name == 'netPrice' || d.name == 'stickerPrice') {
      return 'points'
    } 
   })
   .append('text');

 // Update the colors then draw the circle
 trend
   .style("fill", "#FFF")
   .style("stroke", function(d) { 
    if (d.name == "stickerPrice") {
      return '#036888';
    } else {
      return '#D2392A';
    }
  })
   .attr("opacity", (d) => {
    if (d.name.includes('nyet')) {
      return .3;
    }
   })
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
   .attr("opacity", function() { 
      if ($(window).width() <= 360) {
        return 0;
      } else {
        return 1;
      } 
    })
   .style("stroke-width", 3)
   .attr("cx", function(d) { 
    return x(d.timescale); })
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
             return `$${commas(d)}`
            })
         );
 g.append("text")
  .classed("label-projected", true)
  .attr("y", height - 10)
  .attr("x", width - 10)
  .attr("text-anchor", "end")
  .text("Projected")

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

 filled
    .attr("transform", "translate(" + margin.left + "," + 0 + ")")
    .attr('x', x("16-17"))
    .attr('y', margin.top)
    .attr('width', width - x("16-17"))
    .attr('opacity', .3)
    .attr('height', height);

 const timeScales = datafile.map(function(name) { return x(name.timescale); });

 function mouseover() {
   focus.style("display", null);
   d3.selectAll('#sticker-price-chart .points text').style("display", null);
 }
 function mouseout() {
   focus.style("display", "none");
   d3.selectAll('#sticker-price-chart .points text').style("display", "none");
 }
 // TOOLTIP
 function mousemove() {
   tooltip('#sticker-price-chart', this, timeScales, datafile, x, y, z, focus);
 }

 } // end rundata

 export default {findData, runData}
