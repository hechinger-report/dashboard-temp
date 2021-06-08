import * as d3 from 'd3';

// File for utility methods that are used in different places

// Formatter for number => string
const commas = d3.format(',');

// Helper method to make sure a number stays within bounds of an array
function clampIndex(index, array) {
  return Math.min(Math.max(index, 0), array.length - 1);
}

module.exports = {
  clampIndex,
  commas,
}
