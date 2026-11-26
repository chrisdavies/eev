(function (Eev) {
  describe('Eev', function () {

    it('Handles emits', function (done) {
      var e = new Eev();

      e.on('wut', function (data) {
        expect(data).toEqual('hi');
        done();
      });

      e.emit('wut', 'hi');
    });

    it('Allows multiple handlers', function () {
      var e = new Eev();
      var c = 0;

      for (var i = 0; i < 3; ++i) {
        e.on('wut', function (data) {
          expect(data).toEqual('hoi');
          ++c;
        });
      }

      e.emit('wut', 'hoi');
      expect(c).toEqual(3);
    });

    it('Handles large listener lists without overflowing the stack', function () {
      var e = new Eev();
      var data = {};
      var actual = [];
      var expected = [];
      var payloadsMatch = true;

      function register(index) {
        e.on('go', function (received) {
          payloadsMatch = payloadsMatch && received === data;
          actual.push(index);
        });
      }

      for (var i = 0; i < 20000; ++i) {
        expected.push(i);
        register(i);
      }

      e.emit('go', data);

      expect(actual).toEqual(expected);
      expect(payloadsMatch).toEqual(true);
    });

    it('Preserves listener changes made during emit', function () {
      var e = new Eev();
      var calls = [];

      function second() { calls.push('second'); }
      function last() { calls.push('last'); }

      e.on('go', function () {
        calls.push('first');
        e.off('go', second);
        e.on('go', last);
      });
      e.on('go', second);
      e.on('go', function () { calls.push('third'); });

      e.emit('go');
      expect(calls).toEqual(['first', 'third', 'last']);

      calls = [];
      e.emit('go');
      expect(calls).toEqual(['first', 'third', 'last']);
    });

    it('Allows removal of handlers', function () {
      var e = new Eev();

      e.on('go', function (data) {
        expect(data).toEqual('hi');
      });

      function nope () {
        throw new Error('Should not have run');
      }

      e.on('go there', nope);
      e.off('go there', nope);

      e.emit('go', 'hi');

    });

    it('Allows removal of invalid handlers', function () {
      var e = new Eev();

      e.on('go', function (data) {
        expect(data).toEqual('hi');
      });

      function nope () {
        throw new Error('Should not have run');
      }

      e.off('go there', nope);

      e.on('go there', nope);

      e.off('go there', nope);
      e.off('go there', nope);
      e.off('go there');

      e.emit('go', 'hi');

    });

    it('Allows multiple registrations in one statement', function () {
      var e = new Eev();
      var c = 0;
      e.on('one two', function () {
        ++c;
      });

      e.emit('one');
      expect(c).toEqual(1);
      e.emit('two');
      expect(c).toEqual(2);
    });

    it('Disallows duplicated registrations', function () {
      var e = new Eev();
      var c = 0;

      function nope () {
        ++c;
      }

      e.on('go', nope);
      e.on('go', nope);
      e.emit('go', 'hi');

      expect(c).toEqual(1);
    });

    it('Off works even if called multiple times', function () {
      var e = new Eev();
      var c = 0;

      function nope () {
        ++c;
      }

      e.on('go', nope);
      e.off('go', nope);
      e.off('go', nope);
      e.emit('go', 'hi');

      expect(c).toEqual(0);
    });

    it('Allows the same fn to handle more than one event', function () {
      var e1 = new Eev();
      var e2 = new Eev();
      var c = 0;
      var handler = function () { c++ };

      e1.on('foo', handler);
      e2.on('foo', handler);

      e1.emit('foo');
      e2.emit('foo');

      expect(c).toEqual(2);

      e1.off('foo', handler);
      e2.emit('foo', handler);

      expect(c).toEqual(3);

    });

    it('Is isolated to instances', function () {
      var e1 = new Eev();
      var e2 = new Eev();
      var c1 = 0;
      var c2 = 0;

      e1.on('foo', function () { ++c1; });
      e2.on('foo', function () { ++c2; });

      e1.emit('foo');

      expect(c1).toEqual(1);
      expect(c2).toEqual(0);

      e2.emit('foo');

      expect(c1).toEqual(1);
      expect(c2).toEqual(1);
    });

    it('Works with dash-ed names', function (done) {
      var e = new Eev()
      function myHandler (data) {
        expect(data.foo).toEqual('Bar');
        done();
      }

      e.on('some-event', myHandler);
      e.emit('some-event', { foo: 'Bar' });
    })

    it('Allows a one-time registration', function () {
      var e = new Eev();
      var c = 0;

      e.on('go', function (data) {
        ++c;
      });

      e.on('go', function uno (data) {
        ++c;
        e.off('go', uno);
      });

      e.on('go', function (data) {
        ++c;
      });

      e.emit('go', 'hi');
      e.emit('go', 'again');

      expect(c).toEqual(5);

    });
  });
})(this.Eev || require('../eev'));
