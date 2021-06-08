import * as d3 from 'd3';
import { commas, clampIndex } from './utils';


// Method to call when a numeric tooltip should be added
function tooltip(selector, chart, timeScales, chartData, x, y, z, focus, usePct) {
  // Since we are using the point to the left of the mouse, we subtract 1 to get the index
  // of the desired datum
  const i = d3.bisect(timeScales, d3.mouse(chart)[0], 1) - 1;
  const di = chartData[i];
  focus.attr("transform", "translate(" + x(di.timescale) + ",0)");
  d3.selectAll(`${selector} .points text`)
    .each(function (d, index) {
        d3.select(this)
            .attr('transform', 'translate(0,0)')
            .attr('x', x(di.timescale) + 5)
            .attr('y', function(d) {
              // Since the value of i comes from timeScales and we are using it to get a datum from
              // d.values, we must make sure we keep our index within the bounds of d.values
              const iClamped = clampIndex(i, d.values);
              const nextDatumIndexClamped = clampIndex(i + 1, d.values);
              // Create a default yOffset for the tooltip (note positive y is lower on the page)
              let yOffset = 17;

              // Calculate the difference between the current point and the next point
              const delta = d.values[nextDatumIndexClamped].total - d.values[iClamped].total;

              // If we find that the chart goes down, we change the direction of the offset
              if (delta < 0) {
                yOffset = -7;
              }
              if (d.values[iClamped].total == 100) {
                yOffset = 24
              }

              yOffset += index*2
              // console.log(y(d.values[iClamped].total), d3.select(selector).node().getBoundingClientRect().height)
              // In case where stacks get too close to the top, adjust the yOffset
              if (y(d.values[iClamped].total) < 25 ) {
                yOffset += 10
              }
              // set the y value of the tooltip to be the position of the current point plus our offset
              return y(d.values[iClamped].total) + yOffset;
            })
            .attr('text-anchor', (d) =>{
              if (di.timescale == '17-18') {
                return 'middle'
              } else {
                return 'start'
              }
            })
            .text(function(d) {
              // sometimes, there will be no value for the index position given, so we check that it exists first
              let value;
              if (d.values[i] === undefined || d.values[i].total == 0) {
                // if it's undefined, we'll set value to an empty string
                value = '';
              } else {
                // else, we set it to the value listed
                value = commas(Math.round(d.values[i].total));
              }

              if (usePct && value.length > 0) {
                return `${value}%`;
              } else if (value.length > 0) {
                return `$${value}`;
              } else {
                return value;
              }
            })
            .style('fill', function(d) { return d3.rgb(z(d.name)).darker(.5); })
            .style('font-weight','bold');
      });
  arrangeLabels(selector);
}

function arrangeLabels(selektor) {
  var move = 1;
  while (move > 0) {
    move = 0;
    d3.selectAll(`${selektor} .points text`)
       .each(function() {
         var that = this,
             a = this.getBoundingClientRect();
         d3.selectAll(`${selektor} .points text`)
            .each(function() {
              if(this != that) {
                var b = this.getBoundingClientRect();
                if((Math.abs(a.left - b.left) * 2 < (a.width + b.width)) &&
                   (Math.abs(a.top - b.top) * 2 < (a.height + b.height))) {
                  // overlap, move labels
                  var dx = (Math.max(0, a.right - b.left) +
                           Math.min(0, a.left - b.right)) * 0.01,
                      dy = (Math.max(0, a.bottom - b.top) +
                           Math.min(0, a.top - b.bottom)) * 0.02,
                      tt = getTranslation(d3.select(this).attr("transform")),
                      to = getTranslation(d3.select(that).attr("transform"));
                  move += Math.abs(dx) + Math.abs(dy);
                  to.translate = [ to[0] + dx, to[1] + dy ];
                  tt.translate = [ tt[0] - dx, tt[1] - dy ];
                  d3.select(this).attr("transform", "translate(" + tt.translate + ")");
                  d3.select(that).attr("transform", "translate(" + to.translate + ")");
                  a = this.getBoundingClientRect();
                }
              }
            });
       });
  }
}

function getTranslation(transform) {
  // Create a dummy g for calculation purposes only. This will never
  // be appended to the DOM and will be discarded once this function 
  // returns.
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  
  // Set the transform attribute to the provided string value.
  g.setAttributeNS(null, "transform", transform);
  
  // consolidate the SVGTransformList containing all transformations
  // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
  // its SVGMatrix. 
  var matrix = g.transform.baseVal.consolidate().matrix;
  
  // As per definition values e and f are the ones for the translation.
  return [matrix.e, matrix.f];
}

module.exports = tooltip;
