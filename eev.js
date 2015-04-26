// Eev
// improve perf
// improve minification
// test
// document how to do a "once"
//

var Eev = (function () {
  function noop() {}

  function Link(cb) {
    this.cb = cb;
    this.prev = undefined;
    this.next = undefined;
  }

  Link.prototype = {
    run: function (data) {
      this.cb(data);
      this.next.run(data);
    }
  };

  function Evt() {
    var head = new Link(noop),
        tail = (head.next = new Link());

    tail.prev = head;
    tail.run = noop;

    this.head = head;
    this.tail = tail;
  }

  function Eev () {
    this.events = {};
  };

  Eev.prototype = {
    on: function (name, handler) {
      var evt = this.evt(name);

      var link = (handler['_evt' + name] = new Link(handler)),
          tail = evt.tail;
      link.next = tail;
      link.prev = tail.prev;
      link.prev.next = link;
      link.next.prev = link;
      return link;
    },

    off: function (name, handler) {
      var link = handler['_evt' + name];
      link.next.prev = link.prev;
      link.prev.next = link.next;
    },

    evt: function (name) {
      return this.events[name] || (this.events[name] = new Evt());
    },

    emit: function (name, data) {
      this.evt(name).head.run(data);
    }
  };

  return Eev;
})();
