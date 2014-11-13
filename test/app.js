'use strict';

var will = require('willy').will;
var thatDepends = require('../app.js');
var util = require('util');

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
        a = { needs: [] };
        poo = { needs: [] };
        b = { needs: [poo] };
        c = { needs: [a, b] };
        bar = { needs: [poo] };
        quux = { needs: [bar] };
        baz = { needs: [bar, quux] };

        foos = [a, b, c, poo, bar, baz, quux];
    });

    it('should work out a path without blockers', function () {
        var path = thatDepends.getClearPath(foos, function (foo) {
            return foo.needs;
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

describe('circular dependencies', function () {
    it('should throw', function () {
        function Foo(name, needs) {
            this.name = name;
            this.needs = needs;
        }

        // Foo.prototype.inspect = function (depth) {
        //     return this.name + ':' + util.inspect(this.needs, --depth);
        // };

        var foo = new Foo('foo', []);
        var bar = new Foo('bar', [foo]);
        var baz = new Foo('baz', [bar]);

        foo.needs = [baz];

        will(function () {
            var path = thatDepends.getClearPath([foo, bar, baz], function (item) {
                return item.needs;
            });

            console.log(path);

        }).throw('circular dependency');
    });
});
