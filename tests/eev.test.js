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

  it('Allows removal of handlers', function () {
    var e = new Eev();

    e.on('go', function (data) {
      expect(data).toEqual('hi');
    });

    function nope () {
      throw new Error('Should not have run');
    }

    e.on('go', nope);
    e.off('go', nope);

    e.emit('go', 'hi');

  });

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
