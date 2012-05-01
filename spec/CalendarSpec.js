// Generated by CoffeeScript 1.3.1
(function() {

  describe("CalendarSpec", function() {
    var container;
    container = void 0;
    beforeEach(function() {
      Timecop.install();
      Timecop.freeze(new Date(2012, 4, 1, 10, 48));
      return container = $("<div>");
    });
    afterEach(function() {
      return Timecop.uninstall();
    });
    describe("arguments", function() {
      it("should accept zero arguments", function() {
        return container.calendar();
      });
      return it("should accept an options hash", function() {
        return container.calendar({});
      });
    });
    describe("basic rendering", function() {
      beforeEach(function() {
        return container.calendar();
      });
      it("should contain day headers", function() {
        var header;
        return expect((function() {
          var _i, _len, _ref, _results;
          _ref = container.find("th");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            header = _ref[_i];
            _results.push($(header).text());
          }
          return _results;
        })()).toEqual(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
      });
      it("should contain an element for each day of the month", function() {
        var date, formattedDate, _i, _results;
        _results = [];
        for (date = _i = 1; _i <= 31; date = ++_i) {
          if (date < 10) {
            formattedDate = "0" + date;
          } else {
            formattedDate = date;
          }
          _results.push(expect(container).toContain("td[data-date=2012-05-" + formattedDate + "].date-current-month"));
        }
        return _results;
      });
      it("should contain the days of the last month in the first week", function() {
        expect(container).not.toContain("td[data-date=2012-04-29].date-prev-month");
        return expect(container).toContain("td[data-date=2012-04-30].date-prev-month");
      });
      return it("should contain the days of the next month in the last weeks", function() {
        expect(container).toContain("td[data-date=2012-06-01].date-next-month");
        expect(container).toContain("td[data-date=2012-06-02].date-next-month");
        expect(container).toContain("td[data-date=2012-06-03].date-next-month");
        expect(container).toContain("td[data-date=2012-06-04].date-next-month");
        expect(container).toContain("td[data-date=2012-06-05].date-next-month");
        expect(container).toContain("td[data-date=2012-06-06].date-next-month");
        expect(container).toContain("td[data-date=2012-06-07].date-next-month");
        expect(container).toContain("td[data-date=2012-06-08].date-next-month");
        expect(container).toContain("td[data-date=2012-06-09].date-next-month");
        expect(container).toContain("td[data-date=2012-06-10].date-next-month");
        return expect(container).not.toContain("td[data-date=2012-06-11][class=date-next-month]");
      });
    });
    describe("highlighting", function() {
      var startDate;
      startDate = void 0;
      beforeEach(function() {
        container.calendar();
        return startDate = container.find('td[data-date=2012-05-11]');
      });
      describe("unselected dates", function() {
        it("should add the date-hover class to dates on mouse over", function() {
          startDate.mouseenter();
          expect(container).toContain("td[data-date=2012-05-11].date-hover");
          startDate.mouseleave();
          return expect(container).not.toContain("td[data-date=2012-05-11].date-hover");
        });
        it("should add the date-range-start class to dates when clicked once", function() {
          startDate.click();
          return expect(container).toContain("td[data-date=2012-05-11].date-range-start");
        });
        return it("should add the date-selected class to dates when clicked twice", function() {
          startDate.click();
          startDate.click();
          expect(container).not.toContain("td[data-date=2012-05-11].date-range-start");
          return expect(container).toContain("td[data-date=2012-05-11].date-selected");
        });
      });
      describe("selected dates", function() {
        beforeEach(function() {
          return startDate.addClass('date-selected');
        });
        it("should add the date-hover class to dates on mouse over", function() {
          expect(container).toContain("td[data-date=2012-05-11].date-selected");
          startDate.mouseenter();
          expect(container).toContain("td[data-date=2012-05-11].date-selected.date-hover");
          startDate.mouseleave();
          expect(container).not.toContain("td[data-date=2012-05-11].date-hover.date-selected");
          return expect(container).toContain("td[data-date=2012-05-11].date-selected");
        });
        it("should add the date-range-start class to dates when clicked once", function() {
          startDate.click();
          return expect(container).toContain("td[data-date=2012-05-11].date-selected.date-range-start");
        });
        it("should remove the date-selected class to dates when clicked twice", function() {
          startDate.click();
          startDate.click();
          expect(container).not.toContain("td[data-date=2012-05-11].date-range-start");
          return expect(container).not.toContain("td[data-date=2012-05-11].date-selected");
        });
        it("should not add the date-hover or date-selected class to dates in the last month", function() {
          var date;
          expect(container).toContain("td[data-date=2012-04-30].date-prev-month");
          date = container.find("td[data-date=2012-04-30].date-prev-month");
          date.mouseenter();
          expect(container).not.toContain("td[data-date=2012-04-30].date-prev-month.date-hover");
          date.click();
          return expect(container).not.toContain("td[data-date=2012-04-30].date-prev-month.date-range-start");
        });
        return it("should not add the date-hover or date-selected class to dates in the next month", function() {
          var date;
          expect(container).toContain("td[data-date=2012-06-01].date-next-month");
          date = container.find("td[data-date=2012-06-01].date-next-month");
          date.mouseenter();
          expect(container).not.toContain("td[data-date=2012-06-01].date-next-month.date-hover");
          date.click();
          return expect(container).not.toContain("td[data-date=2012-06-01].date-next-month.date-range-start");
        });
      });
      describe("range selection", function() {
        var endDate;
        endDate = void 0;
        beforeEach(function() {
          return startDate.click();
        });
        describe("forward on the same week", function() {
          beforeEach(function() {
            return endDate = container.find('td[data-date=2012-05-13]');
          });
          it("should add the date-range class to all dates between that and the hovered date", function() {
            endDate.mouseenter();
            expect(container).toContain("td[data-date=2012-05-11].date-range-start.date-range");
            expect(container).toContain("td[data-date=2012-05-12].date-range");
            return expect(container).toContain("td[data-date=2012-05-13].date-range.date-hover");
          });
          return it("should add the date-selected class to all dates between that and the clicked date", function() {
            endDate.mouseenter();
            endDate.click();
            expect(container).toContain("td[data-date=2012-05-11].date-selected");
            expect(container).toContain("td[data-date=2012-05-12].date-selected");
            return expect(container).toContain("td[data-date=2012-05-13].date-selected.date-hover");
          });
        });
        describe("forward on a different week", function() {
          beforeEach(function() {
            return endDate = container.find('td[data-date=2012-05-15]');
          });
          it("should add the date-range class to all dates between that and the hovered date", function() {
            endDate.mouseenter();
            expect(container).toContain("td[data-date=2012-05-11].date-range-start.date-range");
            expect(container).toContain("td[data-date=2012-05-12].date-range");
            expect(container).toContain("td[data-date=2012-05-13].date-range");
            expect(container).toContain("td[data-date=2012-05-14].date-range");
            return expect(container).toContain("td[data-date=2012-05-15].date-range.date-hover");
          });
          return it("should add the date-selected class to all dates between that and the clicked date", function() {
            endDate.mouseenter();
            endDate.click();
            expect(container).toContain("td[data-date=2012-05-11].date-selected");
            expect(container).toContain("td[data-date=2012-05-12].date-selected");
            expect(container).toContain("td[data-date=2012-05-13].date-selected");
            expect(container).toContain("td[data-date=2012-05-14].date-selected");
            return expect(container).toContain("td[data-date=2012-05-15].date-selected.date-hover");
          });
        });
        describe("backward on the same week", function() {
          beforeEach(function() {
            return endDate = container.find('td[data-date=2012-05-09]');
          });
          it("should add the date-range class to all dates between that and the hovered date", function() {
            endDate.mouseenter();
            expect(container).toContain("td[data-date=2012-05-11].date-range-start.date-range");
            expect(container).toContain("td[data-date=2012-05-10].date-range");
            return expect(container).toContain("td[data-date=2012-05-09].date-range.date-hover");
          });
          return it("should add the date-selected class to all dates between that and the clicked date", function() {
            endDate.mouseenter();
            endDate.click();
            expect(container).toContain("td[data-date=2012-05-11].date-selected");
            expect(container).toContain("td[data-date=2012-05-10].date-selected");
            return expect(container).toContain("td[data-date=2012-05-09].date-selected.date-hover");
          });
        });
        return describe("backward on a different week", function() {
          beforeEach(function() {
            return endDate = container.find('td[data-date=2012-05-05]');
          });
          it("should add the date-range class to all dates between that and the hovered date", function() {
            endDate.mouseenter();
            expect(container).toContain("td[data-date=2012-05-11].date-range-start.date-range");
            expect(container).toContain("td[data-date=2012-05-10].date-range");
            expect(container).toContain("td[data-date=2012-05-09].date-range");
            expect(container).toContain("td[data-date=2012-05-08].date-range");
            expect(container).toContain("td[data-date=2012-05-07].date-range");
            expect(container).toContain("td[data-date=2012-05-06].date-range");
            return expect(container).toContain("td[data-date=2012-05-05].date-range.date-hover");
          });
          return it("should add the date-selected class to all dates between that and the clicked date", function() {
            endDate.mouseenter();
            endDate.click();
            expect(container).toContain("td[data-date=2012-05-11].date-selected");
            expect(container).toContain("td[data-date=2012-05-10].date-selected");
            expect(container).toContain("td[data-date=2012-05-09].date-selected");
            expect(container).toContain("td[data-date=2012-05-08].date-selected");
            expect(container).toContain("td[data-date=2012-05-07].date-selected");
            expect(container).toContain("td[data-date=2012-05-06].date-selected");
            return expect(container).toContain("td[data-date=2012-05-05].date-selected.date-hover");
          });
        });
      });
      return describe("range unselection", function() {
        var endDate;
        endDate = void 0;
        beforeEach(function() {
          return endDate = container.find('td[data-date=2012-05-13]');
        });
        return describe("forward on the same week", function() {
          it("should remove the date-selected class to all dates between that and the clicked date", function() {
            startDate.click();
            endDate.mouseenter();
            endDate.click();
            expect(container).toContain("td[data-date=2012-05-11].date-selected");
            expect(container).toContain("td[data-date=2012-05-12].date-selected");
            expect(container).toContain("td[data-date=2012-05-13].date-selected.date-hover");
            startDate.click();
            endDate.mouseenter();
            endDate.click();
            expect(container).not.toContain("td[data-date=2012-05-11].date-selected");
            expect(container).not.toContain("td[data-date=2012-05-12].date-selected");
            expect(container).not.toContain("td[data-date=2012-05-13].date-selected");
            return expect(container).toContain("td[data-date=2012-05-13].date-hover");
          });
          return it("should toggle the date-selected class to all dates between that and the clicked date", function() {
            var midDate;
            startDate.click();
            endDate.mouseenter();
            endDate.click();
            expect(container).toContain("td[data-date=2012-05-11].date-selected");
            expect(container).toContain("td[data-date=2012-05-12].date-selected");
            expect(container).toContain("td[data-date=2012-05-13].date-selected.date-hover");
            midDate = container.find('td[data-date=2012-05-12]');
            midDate.click();
            midDate.click();
            expect(container).not.toContain("td[data-date=2012-05-12].date-selected");
            startDate.click();
            endDate.mouseenter();
            endDate.click();
            expect(container).not.toContain("td[data-date=2012-05-11].date-selected");
            expect(container).toContain("td[data-date=2012-05-12].date-selected");
            expect(container).not.toContain("td[data-date=2012-05-13].date-selected");
            return expect(container).toContain("td[data-date=2012-05-13].date-hover");
          });
        });
      });
    });
    return describe("multi-month view", function() {
      beforeEach(function() {
        return container.calendar({
          months: 3
        });
      });
      it("should render three months of data", function() {
        expect(container.find('table').length).toEqual(3);
        expect(container).toContain("table[data-month=2012-05-01]");
        expect(container).toContain("table[data-month=2012-06-01]");
        return expect(container).toContain("table[data-month=2012-07-01]");
      });
      return describe("duplicated dates", function() {
        var date1, date2;
        date1 = void 0;
        date2 = void 0;
        beforeEach(function() {
          date1 = container.find("table[data-month=2012-05-01] td[data-date=2012-06-03]");
          return date2 = container.find("table[data-month=2012-06-01] td[data-date=2012-06-03]");
        });
        return it("should keep selected dates in sync", function() {
          date2.click();
          date2.click();
          expect(container).toContain("table[data-month=2012-05-01] td[data-date=2012-06-03].date-selected");
          expect(container).toContain("table[data-month=2012-06-01] td[data-date=2012-06-03].date-selected");
          date2.click();
          date2.click();
          expect(container).not.toContain("table[data-month=2012-05-01] td[data-date=2012-06-03].date-selected");
          return expect(container).not.toContain("table[data-month=2012-06-01] td[data-date=2012-06-03].date-selected");
        });
      });
    });
  });

}).call(this);
