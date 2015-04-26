# Eev

A tiny, fast, zero-dependency event emitter for JavaScript.

## Usage

Create an Eev instance.

    var e = new Eev();

Then, add handlers as you see fit.

    e.on('some-event', function (data) {
      alert('got ' + data);
    });

    e.on('some-event', function (data) {
      console.log('got ' + data);
    });

Remove handlers using `off`.

    function myHandler (data) { console.log(data); }

    e.on('some-event', myHandler);
    e.off('some-event', myHandler);

Trigger events using `emit`.

    // The second parameter here is the data you wish to
    // pass to the event handlers
    e.emit('some-event', { foo: 'Bar' });

If you want a handler to only run once, you can do this:

    e.on('some-event', function foo () {
      e.off('some-event', foo);

      // Do stuff
    });

## Installation

Just download eev.min.js, or use bower:

    bower install eev

Or use npm: https://www.npmjs.com/package/eev

    npm install --save eev

## License MIT

Copyright (c) 2015 Chris Davies

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
