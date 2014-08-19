
var assert = require('chai').assert;

var extend = require('../').extend;
var inherits = require('../').inherits;
var Class = require('../').Class;

describe('Cakes', function () {
    describe('Class', function() {
        var val1 = 'val1';
        var val2 = 'val2';
        var val3 = val1 + val1;

        var A = Class({
            __construct: function(isCall, done) {
                assert.deepEqual(isCall, 'called', 'call construct');
                done();
            }
        });

        var B = Class(function() {
            return {
            }
        }, A);

        var C = Class(function() {
            return {
                attrC: 'attrc'
            }
        });

        var D = Class({
            val1: function() {
                return val1;
            },

            val2: function() {
                return val2;
            }
        });

        var E = Class({
            val2: function() {
                return val1;
            },

            val3: function() {
                return this.parent('val1') + this.val1();
            }
        }, D);

        it('Class return a function', function() {
            assert.deepEqual(typeof A, 'function', 'Class should return a function');
        });

        describe('missing arguments', function() {
            it('without arguments', function() {
                var Without = Class();
                var without = new Without();

                assert.deepEqual(typeof Without, 'function', 'Without should a function');
                assert.deepEqual(typeof without.parent, 'function', 'Without should a function');
            });

            it('missing second argument', function() {
                var One = Class({
                    attr: 'test'
                });
                var one = new One();

                assert.deepEqual(typeof One, 'function', 'One should a function');
                assert.equal(one.attr, 'test', 'one has a attr property');
            });

            it('function as first argument', function() {
                var c = new C();

                assert.equal(c.attrC, 'attrc', 'value of attrC must equal attrc');
            });
        });

        describe('__construct', function() {
            it('__construct should be called', function(done) {
                var a = new A('called', done);
            });

            it('invoke __construct from a', function(done) {
                var b = new B('called', done);
            });
        });

        describe('inherits', function() {
            var d = new D();
            var e = new E();
            it('invoke method of super class', function() {
                var val = d.val1();

                assert.equal(val, val1, 'val should be equal val1');
            });

            it('override write method of super class', function() {
                assert.equal(d.val2(), val2, 'val should be equal val2');
                assert.equal(e.val2(), val1, 'val should be equal val1');
            });
        });

        describe('parent', function() {
            var e = new E();
            it('invoke method of parent', function() {
                assert.equal(e.val3(), val3, 'val should be equal val3');
            });
        });
    });

    describe('inherits', function() {
        function Parent() {}

        function Child() {
            Parent.call(this);
        }

        inherits(Child, Parent);

        var c = new Child();

        it('constructor', function() {
            assert.deepEqual(c.constructor, Child, 'constructor of Child shouled deep equal to c.constructor');
        });

        it('super_', function() {
            assert.deepEqual(c.constructor.super_, Parent, 'super_ of Child shouled deep equal to Parent');
        });

        it('prototype', function() {
            assert.deepEqual(Object.getPrototypeOf(c), Child.prototype, 'prototype should be deep equal Child.prototype');
        });

        it('prototype of parent', function() {
            assert.deepEqual(Object.getPrototypeOf(Object.getPrototypeOf(c)), Parent.prototype, 'prototype should be deep equal Parent.prototype');
        });

        it('instance of Child', function() {
            assert.equal(c instanceof Child, true, 'c should be instance of Child');
        });

        it('instance of Parent', function() {
            assert.equal(c instanceof Parent, true, 'c should be instance of Parent');
        });
    });

    describe('extend', function() {
        var str = 'me a test';
        var integer = 10;
        var arr = [1, 'what', new Date(81, 8, 4)];
        var date = new Date(81, 4, 13);

        var obj = {
            str: str,
            integer: integer,
            arr: arr,
            date: date
        };

        describe('missing arguments', function() {
            it('missing first argument', function() {
                assert.deepEqual(extend(undefined, { a: 1 }), { a: 1 }, 'missing first argument is second argument');
            });

            it('missing second argument', function() {
                assert.deepEqual(extend({ a: 1 }), { a: 1 }, 'missing second argument is first argument');
            });

            it('deep: missing first argument', function() {
                assert.deepEqual(extend(true, undefined, { a: 1 }), { a: 1 }, 'deep: missing first argument is second argument');
            });

            it('deep: missing second argument', function() {
                assert.deepEqual(extend(true, { a: 1 }), { a: 1 }, 'deep: missing first argument is second argument');
            });

            it('no arguments', function() {
                assert.deepEqual(extend(), {}, 'no arguments is object');
            });
        });

        describe('merge data', function() {
            it('merge object with object', function() {
                var ori = {
                    str: 'no shit',
                    integer: 76,
                    arr: [1, 2, 3, 4],
                    date: new Date(81, 7, 26),
                    foo: 'bar'
                };
                var target = extend(ori, obj);
                var expectedObj = {
                    str: 'me a test',
                    integer: 10,
                    arr: [1, 'what', new Date(81, 8, 4)],
                    date: new Date(81, 4, 13)
                };
                var expectedTarget = {
                    str: 'me a test',
                    integer: 10,
                    arr: [1, 'what', new Date(81, 8, 4)],
                    date: new Date(81, 4, 13),
                    foo: 'bar'
                };

                assert.deepEqual(obj, expectedObj, 'obj is unchanged');
                assert.deepEqual(ori, expectedTarget, 'original has been merged');
                assert.deepEqual(target, expectedTarget, 'object + object is merged object');
            });

            it('merge object with array', function() {
                var ori = {
                    str: 'no shit',
                    integer: 76,
                    arr: [1, 2, 3, 4],
                    date: new Date(81, 7, 26)
                };
                var target = extend(ori, arr);
                var testObject = {
                    0: 1,
                    1: 'what',
                    2: new Date(81, 8, 4),
                    str: 'no shit',
                    integer: 76,
                    arr: [1, 2, 3, 4],
                    date: new Date(81, 7, 26)
                };

                assert.deepEqual(ori, testObject, 'original object is merged');
                assert.deepEqual(arr, [1, 'what', testObject[2]], 'array is unchanged');
                assert.deepEqual(target, testObject, 'object + array is merged object');
            });

            it('merge array with array', function() {
                var ori = [1, 2, 3, 4, 5, 6];
                var target = extend(ori, arr);
                var testDate = new Date(81, 8, 4);
                var expectedTarget = [1, 'what', testDate, 4, 5, 6];

                assert.deepEqual(ori, expectedTarget, 'array + array merges arrays; changes first array');
                assert.deepEqual(arr, [1, 'what', testDate], 'second array is unchanged');
                assert.deepEqual(target, expectedTarget, 'array + array is merged array');
            });

            it('merge array with object', function() {
                var ori = [1, 2, 3, 4, 5, 6];
                var target = extend(ori, obj);
                var testObject = {
                    str: 'me a test',
                    integer: 10,
                    arr: [1, 'what', new Date(81, 8, 4)],
                    date: new Date(81, 4, 13)
                };

                assert.deepEqual(obj, testObject, 'obj is unchanged');
                assert.equal(ori.length, 6, 'array has proper length');
                assert.equal(ori.str, obj.str, 'array has obj.str property');
                assert.equal(ori.integer, obj.integer, 'array has obj.int property');
                assert.deepEqual(ori.arr, obj.arr, 'array has obj.arr property');
                assert.equal(ori.date, obj.date, 'array has obj.date property');

                assert.equal(target.length, 6, 'target has proper length');
                assert.equal(target.str, obj.str, 'target has obj.str property');
                assert.equal(target.integer, obj.integer, 'target has obj.int property');
                assert.deepEqual(target.arr, obj.arr, 'target has obj.arr property');
                assert.equal(target.date, obj.date, 'target has obj.date property');
            });
        });
    });
});
