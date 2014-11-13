'use strict';

function Foo(name) {
  this.name = name;
}

Foo.prototype.deps = function (blockers) {
  this.blockers = blockers;
};

Foo.prototype.getBlockers = function () {
  return this.blockers;
};

Foo.prototype.getAllBlockers = function () {
  var blockers = this.allBlockers;
  var i = 0;
  var length;
  var subBlockers = [];

  if (!blockers) {
    blockers = [];
    blockers = copyArray(this.getBlockers());
    length = blockers.length;

    while (i < length) {
      subBlockers = subBlockers.concat(blockers[i].getAllBlockers());
      i++;
    }

    blockers = blockers.concat(subBlockers);
  }

  this.allBlockers = unique(blockers);
  return this.allBlockers;
};


var foos = [];

var a = new Foo('a');
var b = new Foo('b');
var c = new Foo('c');
var poo = new Foo('poo');
var bar = new Foo('bar');
var baz = new Foo('baz');
var quux = new Foo('quux');



a.deps([]);
b.deps([poo]);
c.deps([a, b]);
poo.deps([]);
bar.deps([poo]);
baz.deps([bar, quux]);
quux.deps([bar]);

foos = [a, b, c, poo, bar, baz, quux];

// ================================================




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

var getClearPath = function (items) {
  var cleared = copyArray(items);
  
  cleared.sort(function (a, b) {
    var aBlockers = a.getAllBlockers().length;
    var bBlockers = b.getAllBlockers().length;

    return aBlockers - bBlockers;
  });

  return cleared;
};

console.log(getClearPath(foos));