Cakes [![Build Status](https://api.travis-ci.org/repositories/happen-zhang/cakes.png)](https://travis-ci.org/happen-zhang/cakes) [![NPM version](https://badge.fury.io/js/cakes.png)](http://badge.fury.io/js/cakes)
======

[![NPM](https://nodei.co/npm/cakes.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/cakes/)

Cakes is an extremely simple class-like interface to JavaScript prototypal inheritance, it like implementation of PHP or Java.

## Getting Started ##

### For Node.js ###

You can use Cakes on the server side with [Node.js](http://nodejs.org/) and npm:

```
$ npm install cakes
```

### For browser ###

You can use Cakes on browser, you can also download [resource file](https://github.com/happen-zhang/cakes/blob/master/lib/cakes.js) to your own project.In order to use Cakes, you can just insert the script tag into HTML page:

```
<script src="path/to/lib/cakes.js"></script>

<script>

// window.cakes
var Class = cakes.Class;

// ...

</script>
```

### Test ###

```
npm test
```

## Usage ##

```Javascript
var Class = require('cakes').Class;

// Defind a Preson class
var Preson = Class({
    __construct: function(name, age, gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    },

    getName: function() {
        return this.name;
    }
});

// Defind a Man class, and inherits Preson
var Man = Class({

    __construct: function(name, age) {
        // invoke __construct function of super class
        this.parent('__construct', name, age, 'male');
    },

    intro: function() {
        // invoke getName method
        console.log('My name is ' + this.getName());
    }

}, Preson);

var m = new Man('Emilly', 18);

m.intro(); // My name is Emilly

console.log(m); // { name: 'Emilly', age: 18, gender: 'male' }
```

### __construct ###

If you create a `__construct()` function (it is your choice,), it will automatically call the `__construct()` method/function when you create an object from your class. This feature like as PHP `__construct()`.

### parent ###

You may find yourself writing code that refers to variables and functions in base classes, this is particularly true if you want to make your code DRY.Now, you should be using the special name `parent` which refers to the name of your base class as given in `Class` function as the second argument.You can use the `parent` method as follow:

```
// parent(methodName, args...)
// after the name of method, others arguments will be passed into method

this.parent('__construct', name)
```

### extend ###

`extend` method From jQuery.

```
var extend = require('cakes').extend;
```

### inherits ###

`inherits` method From Node.js.

```
// inherits = require('util').inherits;
var inherits = require('cakes').inherits;
```

## License ##

(The MIT License)

Copyright (c) 2014 happen-zhang <zhanghaipeng404@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
