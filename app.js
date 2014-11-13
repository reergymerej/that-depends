'use strict';



var itemsRef = [];
var itemsBlockers = {};

var getAllBlockers = function (item, getItemBlockerFn) {
  var blockers;
  var subBlockers = [];
  var i = 0;
  var length;

  blockers = getFromCache(item);

  // no cached value
  if (blockers === undefined) {
    blockers = [];
    blockers = copyArray(getItemBlockerFn(item));
    length = blockers.length;

    // recurse
    while (i < length) {
      subBlockers = subBlockers.concat(getItemBlockerFn(blockers[i]));
      i++;
    }

    // combine with recursive blockers
    blockers = blockers.concat(subBlockers);

    // remember list of blockers
    blockers = unique(blockers);
    cacheResult(item, blockers);
  }

  return blockers;
};

var getFromCache = function (item) {
  return itemsBlockers[itemsRef.indexOf(item)];
};

var cacheResult = function (item, result) {
  itemsBlockers[itemsRef.push(item) - 1] = result;
};

var clearCache = function () {
  itemsRef = [];
  itemsBlockers = {};
};

var copyArray = function (arr) {
  var copy = [];
  var length = arr.length;
  var i = 0;

  while (i < length) {
    copy[i] = arr[i];
    i++;
  }

  return copy;
};

var unique = function (arr) {
  var lastIndex;
  var i;

  arr = copyArray(arr);

  for (i = 0; i < arr.length; i++) {
    while ((lastIndex = arr.lastIndexOf(arr[i])) > i) {
      arr.splice(lastIndex, 1);
    }
  }

  return arr;
};
  
/**
* Given an array of items and a method to determine what an item's blockers are,
* get an array of the items sorted so in a way so that you can go down the list
* without being blocked.
* @param {Class[]} items
* @param {Function} getItemBlockerFn - passed a {Class} item,
* should return an array of 0 or more {Class} items 
* @return {Class[]}
*/
var getClearPath = function (items, getItemBlockerFn) {
  var cleared = copyArray(items);
  clearCache();
  
  cleared.sort(function (a, b) {
    var aBlockers = getAllBlockers(a, getItemBlockerFn).length;
    var bBlockers = getAllBlockers(b, getItemBlockerFn).length;

    return aBlockers - bBlockers;
  });

  return cleared;
};

exports.getClearPath = getClearPath;