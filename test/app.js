'use strict';

var will = require('willy').will;
var thatDepends = require('../app.js');

describe('sanity', function () {
    it('should load', function () {
        will(thatDepends).beDefined();
    });

    it('should expose method to get a clear path', function () {
        will(thatDepends).have('getClearPath');
    });
});

describe('getting a clear path', function () {

    var foos = [];
    var a;
    var b;
    var c;
    var poo;
    var bar;
    var baz;
    var quux;

    before(function () {
        a = { blockers: [] };
        poo = { blockers: [] };
        b = { blockers: [poo] };
        c = { blockers: [a, b] };
        bar = { blockers: [poo] };
        quux = { blockers: [bar] };
        baz = { blockers: [bar, quux] };

        foos = [a, b, c, poo, bar, baz, quux];
    });

    it('should work out a path without blockers', function () {
        var path = thatDepends.getClearPath(foos, function (foo) {
            return foo.blockers;
        });

        will(path).beLike([a, poo, b, bar, quux, c, baz]);
    });

    it('should work with alternate methodologies for determining blockers', function () {
        var path = thatDepends.getClearPath(foos, function (foo) {
            if (foo === quux) {
                return [a, b, c, bar, baz];
            } else {
                return [];
            }
        });

        will(path[path.length - 1]).be(quux);
    });
});