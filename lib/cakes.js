
/**
 * Global define
 */

(function(global, cakes) {
    'use strict';

    var toString = Object.prototype.toString;
    var fnToString = Function.prototype.toString;
    // is native array support
    var nativeIsArray = (function() {
        var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g;
        var reHostCtor = /^\[object .+?Constructor\]$/;
        var reNative = RegExp('^' + escapeRegExp(toString).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
        var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;

        function isNative(value) {
            var type = typeof value;
            return type == 'function' ? reNative.test(fnToString.call(value)) : (value && type == 'object' && reHostCtor.test(toString.call(value))) || false;
        }

        function escapeRegExp(string) {
            string = string == null ? '' : String(string);
            return (reRegExpChars.lastIndex = 0, reRegExpChars.test(string)) ?
                    string.replace(reRegExpChars, '\\$&') : string;
        }

        return nativeIsArray;
    })();

    /**
     * Create a class construct function.
     * @param  {Function} prop       Custom properties of class
     * @param  {Function} superClass Super class
     * @return {Function}            New class construct function
     */
    function Class(prop, superClass) {
        var ClassType = function() {
            function F(args) {
                for (var name in ClassType.__prop) {
                    var val = ClassType.__prop[name];
                    this[name] = isObject(val) ? extend({}, val) : val;
                }

                if (isFunction(this.__construct)) {
                    this.__construct.apply(this, [].slice.call(args));
                }

                return this;
            }

            F.prototype = ClassType.prototype;
            F.constructor = ClassType;
            return new F(arguments);
        };

        ClassType.extend = function(prop) {
            if (isFunction(prop)) {
                prop = prop();
            }

            if (isObject(prop)) {
                for (var name in prop) {
                    var val = prop[name];

                    if (name === 'parent') {
                        throw new Error("'parent' method must not be override wrote.");
                    }

                    if (isFunction(val)) {
                        ClassType.prototype[name] = val;
                    } else {
                        ClassType.__prop[name] = isObject(val) ? extend({}, val) : val;
                    }
                }
            }

            return this;
        };

        ClassType.inherits = function(superClass) {
            inherits(ClassType, superClass);
            extend(ClassType.__prop, superClass.__prop);

            return this;
        };

        ClassType.prototype.parent = function(methodName, args) {
            var super_ = this.constructor.super_;
            if (!isFunction(this[methodName])
                || !isFunction(super_.prototype[methodName])) {
                throw new Error("parent has not method '" + methodName + "'.");
            }

            if (arguments.length === 1) {
                args = [];
            } else if (!isArray(args)) {
                args = [].slice.call(arguments, 1);
            }

            while ((this[methodName] === super_.prototype[methodName])
                   && super_.super_) {
                super_ = super_.super_;
            }

            var method = super_.prototype[methodName];
            delete super_.prototype[methodName];
            var retResult = method.apply(this, args);
            super_.prototype[methodName] = method;

            return retResult;
        };

        ClassType.__prop = {};
        if (superClass === true && isFunction(prop)) {
            superClass = prop;
            prop = undefined;
        }

        if (isFunction(superClass)) {
            ClassType.inherits(superClass);
        }

        if (prop) {
            ClassType.extend(prop);
        }

        return ClassType;
    }

    /**
     * Extends object properties，from jQuery.
     * @param  {Boolean} deep   Whether or not to deep copy
     * @param  {Object}  target Target object
     * @param  {Object}  copy   Copy from this object
     * @return {Object}         Object has been completed copied.
     */
    function extend() {
        var target = arguments[0] || {};
        var i = 1;
        var length = arguments.length;
        var deep = false;
        var options, name, src, copy, copyIsArray, clone;

        if (isBoolean(target)) {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }

        if (!isObject(target) && !isFunction(target)) {
            target = {};
        }

        for (; i < length; i++) {
            options = arguments[i];
            if (options != null) {
                if (isString(options)) {
                    options = options.split('');
                }

                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && (isObject(copy) || (copyIsArray = isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];
                        } else {
                            clone = src && isObject(src) ? src : {};
                        }

                        target[name] = extend(deep, clone, copy);
                    } else if (typeof copy !== 'undefined') {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    }

    /**
     * Inherits prototype from super class
     * @param  {Function} ctor      Subclass constructor
     * @param  {Function} superCtor Superclass constructor
     * @return
     */
    function inherits(ctor, superCtor) {
        if ((!ctor || !isFunction(ctor))
            || (!superCtor || !isFunction(superCtor))) {
            return ;
        }

        ctor.super_ = superCtor;
        if (isFunction(Object.create)) {
            ctor.prototype = Object.create(superCtor.prototype, {
                constructor: {
                    value: ctor,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
        } else {
            var TempCtor = function () {};
            TempCtor.prototype = superCtor.prototype;
            ctor.prototype = new TempCtor();
            ctor.prototype.constructor = ctor;
        }
    }

    function isBoolean(value) {
        return (value === true
                || value === false
                || value && typeof value == 'object'
                && toString.call(value) == '[object Boolean]') || false;
    }

    function isString(value) {
        return typeof value == 'string'
                || (value && typeof value == 'object'
                    && toString.call(value) == '[object String]')
                || false;
    }

    function isArray(value) {
        if (nativeIsArray) {
            return nativeIsArray(value);
        }

        return (value && typeof value == 'object' && typeof value.length == 'number' && toString.call(value) == '[object Array]') || false;
    }

    function isObject(value) {
        var type = typeof value;
        return type == 'function' || (value && type == 'object') || false;
    }

    function isFunction(value) {
        return typeof value == 'function' || false;
    }

    // Add to cakes
    cakes.extend = extend;
    cakes.inherits = inherits;
    cakes.Class = Class;

    // AMD
    if (typeof define !== 'undefined' && define.amd) {
        define([], function() {
            return cakes;
        });
    // CommonJS
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = cakes;
    // Browser or Rhino
    } else {
        global.cakes = cakes;
    }
})(this, {});
