
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
     *
     */
    function Class() {

    }

    /**
     * 扩展对象，来自jQuery
     * @param  {Boolean} deep   是否深拷贝
     * @param  {Object}  target 目标对象
     * @param  {Object}  copy   复制源对象
     * @return {Object}         返回复制后的目标对象
     */
    function extend() {
        var deep = true;
        var args = [].slice.call(arguments);
        var target = args.shift();
        var options, name, src, copy, copyIsArray, clone;

        if (isBoolean(target)) {
            deep = target;
            target = args.shift();
        }

        if (!isObject(target) && !isFunction(target)) {
            target = {};
        }

        var length = args.length;
        for (var i = 0; i < length; i++) {
            options = args[i] || {};

            if (isFunction(options)) {
                options = options();
            }

            for (name in options) {
                src = target[name];
                copy = options[name];

                if (src === copy) {
                    continue ;
                }

                if (deep
                    && copy
                    && (isObject(copy) || (copyIsArray = isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && isArray(src) ? src : [];
                    } else {
                        clone = src && isObject(src) ? src : {};
                    }
                    target[name] = extend(deep, clone, copy);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }

        return target;
    }

    function isBoolean(value) {
        return (value === true
                || value === false
                || value && typeof value == 'object'
                && toString.call(value) == '[object Boolean]') || false;
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
