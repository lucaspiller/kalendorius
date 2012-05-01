describe("CalendarSpec", function() {
  var container;

  beforeEach(function() {
    container = $('<div>');
  });

  describe("arguments", function() {
    it("should accept zero arguments", function() {
      container.calendar();
    });

    it("should accept an options hash", function() {
      options = {};
      container.calendar(options);
    });
  });
});
