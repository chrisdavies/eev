var Eev = (function () {

  // The Eev constructor
  function PubSub () {
    this.events = {};
  }

  PubSub.prototype = {
    on: function (name, fn) {
      this.isRegistered(name, fn) || this.register(name, fn);
    },

    off: function (name, fn) {
      this.isRegistered(name, fn) && this.unregister(name, fn);
    },

    emit: function (name, data) {
      var evt = this.events[name];
      evt && evt.head.run(data);
    },

    isRegistered: function (name, fn) {
      return fn._eev && fn._eev[name];
    },

    register: function (name, fn) {
      var link = this.insertLinkInList(name, fn);

      this.insertLinkInFn(name, link, fn);
    },

    insertLinkInList: function (name, fn) {
      var list = this.events[name] || (this.events[name] = new LinkedList());

      return list.insert(fn);
    },

    insertLinkInFn: function (name, link, fn) {
      var eev = fn._eev || (fn._eev = {});
      eev[name] = link;
    },

    unregister: function (name, fn) {
      var link = this.removeLinkFromFn(name, fn);

      this.removeLinkFromList(name, link);
    },

    removeLinkFromFn: function (name, fn) {
      var link = fn._eev[name];

      fn._eev[name] = undefined;
      return link;
    },

    removeLinkFromList: function (name, link) {
      var list = this.events[name];

      list && list.remove(link);
    }
  };

  // A relatively generic LinkedList impl
  function LinkedList(linkConstructor) {
    this.head = new RunnableLink();
    this.tail = new RunnableLink(this.head);
    this.head.next = this.tail;
    this.linkConstructor = linkConstructor;
  }

  LinkedList.prototype = {
    insert: function (data) {
      var link = new RunnableLink(this.tail.prev, this.tail, data);
      link.next.prev = link.prev.next = link;
      return link;
    },

    remove: function (link) {
      link.prev.next = link.next;
      link.next.prev = link.prev;
    }
  };

  // A link in the linked list which allows
  // for efficient execution of the callbacks
  function RunnableLink(prev, next, fn) {
    this.prev = prev;
    this.next = next;
    this.fn = fn || noop;
  }

  RunnableLink.prototype.run = function (data) {
    this.fn(data);
    this.next && this.next.run(data);
  };

  function noop () { }

  return PubSub;
}());

// AMD/CommonJS support
(function (root, factory) {
  var define = root.define;

  if (define && define.amd) {
    define([], factory);
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  }
}(this, function () { return Eev; }));
