var Eev = (function () {
  function Eev () {
    this.events = {};
  };

  Eev.prototype = {
    on: function (name, handler) {
      var prop = evtProp(name);

      if (handler[prop]) return;

      var evt = this.evt(name),
          link = (handler[prop] = new Link(handler)),
          tail = evt.tail;

      link.next = tail;
      link.prev = tail.prev;
      link.prev.next = link.next.prev = link;
    },

    off: function (name, handler) {
      var prop = evtProp(name),
          link = handler[prop];

      if (link) {
        link.next.prev = link.prev;
        link.prev.next = link.next;
        handler[prop] = undefined;
      }
    },

    evt: function (name) {
      return this.events[name] || (this.events[name] = new LinkedList());
    },

    emit: function (name, data) {
      this.evt(name).head.run(data);
    }
  };

  function noop() {}

  function LinkedList() {
    var head = new Link(noop),
        tail = (head.next = new Link());

    tail.prev = head;
    tail.run = noop;

    this.head = head;
    this.tail = tail;
  }

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

  function evtProp(name) {
    return '_evt' + name;
  }

  return Eev;
})();
