'use strict';

var will = require('willy').will;
var thatDepends = require('../app.js');

describe('sanity', function () {
    it('should load', function () {
        will(thatDepends).beDefined();
    });
});