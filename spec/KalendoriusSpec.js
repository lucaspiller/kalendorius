// Generated by CoffeeScript 1.3.1
(function() {

  describe("KalendoriusSpec", function() {
    var container, instance;
    container = void 0;
    instance = void 0;
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
        return container.kalendorius();
      });
      return it("should accept an options hash", function() {
        return container.kalendorius({});
      });
    });
    describe("basic rendering", function() {
      beforeEach(function() {
        return instance = container.kalendorius();
      });
      it("should contain the month header", function() {
        return expect(container.find('div[data-month=2012-05-01] div.month-header').text()).toEqual('May');
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
      it("should contain the days of the next month in the last weeks", function() {
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
      return it("should add the class date-today for today", function() {
        return expect(container).toContain("td[data-date=2012-05-01].date-today");
      });
    });
    describe("highlighting", function() {
      var startDate;
      startDate = void 0;
      beforeEach(function() {
        instance = container.kalendorius();
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
        it("should add the date-selected class to dates when clicked twice", function() {
          startDate.click();
          startDate.click();
          expect(container).not.toContain("td[data-date=2012-05-11].date-range-start");
          return expect(container).toContain("td[data-date=2012-05-11].date-selected");
        });
        return it("should fire the selected event when clicked twice", function() {
          var triggered;
          triggered = false;
          instance.onSelected = function() {
            expect(instance.getSelected()).toEqual(['2012-05-11']);
            return triggered = true;
          };
          startDate.click();
          startDate.click();
          return expect(triggered).toEqual(true);
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
        it("should remove the date-selected class to dates when clicked twice", function() {
          startDate.click();
          startDate.click();
          expect(container).not.toContain("td[data-date=2012-05-11].date-range-start");
          return expect(container).not.toContain("td[data-date=2012-05-11].date-selected");
        });
        it("should fire the unselected event when clicked twice", function() {
          var triggered;
          triggered = false;
          instance.onUnselected = function() {
            return triggered = true;
          };
          startDate.click();
          startDate.click();
          return expect(triggered).toEqual(true);
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
          it("should add the date-selected class to all dates between that and the clicked date", function() {
            endDate.mouseenter();
            endDate.click();
            expect(container).toContain("td[data-date=2012-05-11].date-selected");
            expect(container).toContain("td[data-date=2012-05-12].date-selected");
            return expect(container).toContain("td[data-date=2012-05-13].date-selected.date-hover");
          });
          return it("should fire the selected event", function() {
            var triggered;
            triggered = false;
            instance.onSelected = function() {
              expect(instance.getSelected()).toEqual(['2012-05-11', '2012-05-12', '2012-05-13']);
              return triggered = true;
            };
            endDate.mouseenter();
            endDate.click();
            return expect(triggered).toEqual(true);
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
          it("should add the date-selected class to all dates between that and the clicked date", function() {
            endDate.mouseenter();
            endDate.click();
            expect(container).toContain("td[data-date=2012-05-11].date-selected");
            expect(container).toContain("td[data-date=2012-05-12].date-selected");
            expect(container).toContain("td[data-date=2012-05-13].date-selected");
            expect(container).toContain("td[data-date=2012-05-14].date-selected");
            return expect(container).toContain("td[data-date=2012-05-15].date-selected.date-hover");
          });
          return it("should fire the selected event", function() {
            var triggered;
            triggered = false;
            instance.onSelected = function() {
              expect(instance.getSelected()).toEqual(['2012-05-11', '2012-05-12', '2012-05-13', '2012-05-14', '2012-05-15']);
              return triggered = true;
            };
            endDate.mouseenter();
            endDate.click();
            return expect(triggered).toEqual(true);
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
          it("should add the date-selected class to all dates between that and the clicked date", function() {
            endDate.mouseenter();
            endDate.click();
            expect(container).toContain("td[data-date=2012-05-11].date-selected");
            expect(container).toContain("td[data-date=2012-05-10].date-selected");
            return expect(container).toContain("td[data-date=2012-05-09].date-selected.date-hover");
          });
          return it("should fire the selected event", function() {
            var triggered;
            triggered = false;
            instance.onSelected = function() {
              expect(instance.getSelected()).toEqual(['2012-05-09', '2012-05-10', '2012-05-11']);
              return triggered = true;
            };
            endDate.mouseenter();
            endDate.click();
            return expect(triggered).toEqual(true);
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
          it("should add the date-selected class to all dates between that and the clicked date", function() {
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
          return it("should fire the selected event", function() {
            var triggered;
            triggered = false;
            instance.onSelected = function() {
              expect(instance.getSelected()).toEqual(['2012-05-05', '2012-05-06', '2012-05-07', '2012-05-08', '2012-05-09', '2012-05-10', '2012-05-11']);
              return triggered = true;
            };
            endDate.mouseenter();
            endDate.click();
            return expect(triggered).toEqual(true);
          });
        });
      });
      describe("range unselection", function() {
        var endDate;
        endDate = void 0;
        beforeEach(function() {
          endDate = container.find('td[data-date=2012-05-13]');
          startDate.click();
          endDate.mouseenter();
          endDate.click();
          expect(container).toContain("td[data-date=2012-05-11].date-selected");
          expect(container).toContain("td[data-date=2012-05-12].date-selected");
          expect(container).toContain("td[data-date=2012-05-13].date-selected.date-hover");
          return startDate.click();
        });
        return describe("forward on the same week", function() {
          it("should remove the date-selected class to all dates between that and the clicked date when none are selected", function() {
            endDate.mouseenter();
            endDate.click();
            expect(container).not.toContain("td[data-date=2012-05-11].date-selected");
            expect(container).not.toContain("td[data-date=2012-05-12].date-selected");
            expect(container).not.toContain("td[data-date=2012-05-13].date-selected");
            return expect(container).toContain("td[data-date=2012-05-13].date-hover");
          });
          return it("should fire the unselected event", function() {
            var triggered;
            triggered = false;
            instance.onUnselected = function() {
              return triggered = true;
            };
            endDate.mouseenter();
            endDate.click();
            return expect(triggered).toEqual(true);
          });
        });
      });
      return describe("range partial selection", function() {
        var endDate;
        endDate = void 0;
        beforeEach(function() {
          var midDate;
          endDate = container.find('td[data-date=2012-05-13]');
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
          return startDate.click();
        });
        it("should set add the date-selected class to all dates between that and the clicked date when some are selected", function() {
          endDate.mouseenter();
          endDate.click();
          expect(container).toContain("td[data-date=2012-05-11].date-selected");
          expect(container).toContain("td[data-date=2012-05-12].date-selected");
          expect(container).toContain("td[data-date=2012-05-13].date-selected");
          return expect(container).toContain("td[data-date=2012-05-13].date-hover");
        });
        return it("should fire the selected event", function() {
          var triggered;
          triggered = false;
          instance.onSelected = function() {
            expect(instance.getSelected()).toEqual(['2012-05-11', '2012-05-12', '2012-05-13']);
            return triggered = true;
          };
          endDate.mouseenter();
          endDate.click();
          return expect(triggered).toEqual(true);
        });
      });
    });
    describe("multi-month view", function() {
      beforeEach(function() {
        return instance = container.kalendorius({
          months: 3
        });
      });
      it("should render three months of data", function() {
        expect(container.find('table').length).toEqual(3);
        expect(container).toContain("div[data-month=2012-05-01] td[data-date=2012-04-30]");
        expect(container).toContain("div[data-month=2012-05-01] td[data-date=2012-05-01]");
        expect(container).toContain("div[data-month=2012-05-01] td[data-date=2012-05-31]");
        expect(container).toContain("div[data-month=2012-05-01] td[data-date=2012-06-10]");
        expect(container).toContain("div[data-month=2012-06-01] td[data-date=2012-05-28]");
        expect(container).toContain("div[data-month=2012-06-01] td[data-date=2012-06-01]");
        expect(container).toContain("div[data-month=2012-06-01] td[data-date=2012-06-30]");
        expect(container).toContain("div[data-month=2012-06-01] td[data-date=2012-07-08]");
        expect(container).toContain("div[data-month=2012-07-01] td[data-date=2012-06-25]");
        expect(container).toContain("div[data-month=2012-07-01] td[data-date=2012-07-01]");
        expect(container).toContain("div[data-month=2012-07-01] td[data-date=2012-07-31]");
        return expect(container).toContain("div[data-month=2012-07-01] td[data-date=2012-08-05]");
      });
      it("should contain the month header for each month", function() {
        expect(container.find('div[data-month=2012-05-01] div.month-header').text()).toEqual('May');
        expect(container.find('div[data-month=2012-06-01] div.month-header').text()).toEqual('June');
        return expect(container.find('div[data-month=2012-07-01] div.month-header').text()).toEqual('July');
      });
      return describe("duplicated dates across a month boundary", function() {
        it("should be kept in sync", function() {
          var date1, date2;
          date1 = container.find("div[data-month=2012-05-01] td[data-date=2012-06-03]");
          date2 = container.find("div[data-month=2012-06-01] td[data-date=2012-06-03]");
          date2.click();
          date2.click();
          expect(container).toContain("div[data-month=2012-05-01] td[data-date=2012-06-03].date-selected");
          expect(container).toContain("div[data-month=2012-06-01] td[data-date=2012-06-03].date-selected");
          date2.click();
          date2.click();
          expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-03].date-selected");
          return expect(container).not.toContain("div[data-month=2012-06-01] td[data-date=2012-06-03].date-selected");
        });
        return it("should be selected by ranges correctly", function() {
          var date1, date2;
          date1 = container.find("div[data-month=2012-05-01] td[data-date=2012-05-31]");
          date2 = container.find("div[data-month=2012-06-01] td[data-date=2012-06-01]");
          date1.click();
          date2.mouseenter();
          expect(container).toContain("div[data-month=2012-05-01] td[data-date=2012-05-31].date-range-start.date-range");
          expect(container).toContain("div[data-month=2012-05-01] td[data-date=2012-06-01].date-range");
          expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-02].date-range");
          expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-03].date-range");
          expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-04].date-range");
          expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-05].date-range");
          expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-06].date-range");
          expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-07].date-range");
          expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-08].date-range");
          expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-09].date-range");
          expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-10].date-range");
          expect(container).not.toContain("div[data-month=2012-06-01] td[data-date=2012-05-28].date-range");
          expect(container).not.toContain("div[data-month=2012-06-01] td[data-date=2012-05-29].date-range");
          expect(container).not.toContain("div[data-month=2012-06-01] td[data-date=2012-05-30].date-range");
          expect(container).toContain("div[data-month=2012-06-01] td[data-date=2012-05-31].date-range");
          expect(container).toContain("div[data-month=2012-06-01] td[data-date=2012-06-01].date-range.date-hover");
          date2.click();
          expect(container).toContain("div[data-month=2012-05-01] td[data-date=2012-05-31].date-selected");
          expect(container).toContain("div[data-month=2012-05-01] td[data-date=2012-06-01].date-selected");
          expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-02].date-selected");
          expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-03].date-selected");
          expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-04].date-selected");
          expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-05].date-selected");
          expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-06].date-selected");
          expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-07].date-selected");
          expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-08].date-selected");
          expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-09].date-selected");
          expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-10].date-selected");
          expect(container).not.toContain("div[data-month=2012-06-01] td[data-date=2012-05-28].date-selected");
          expect(container).not.toContain("div[data-month=2012-06-01] td[data-date=2012-05-29].date-selected");
          expect(container).not.toContain("div[data-month=2012-06-01] td[data-date=2012-05-30].date-selected");
          expect(container).toContain("div[data-month=2012-06-01] td[data-date=2012-05-31].date-selected");
          return expect(container).toContain("div[data-month=2012-06-01] td[data-date=2012-06-01].date-selected.date-hover");
        });
      });
    });
    describe("options", function() {
      it("should allow adding classes to the tables", function() {
        container.kalendorius({
          tableClass: 'table table-bordered'
        });
        return expect(container).toContain("div[data-month=2012-05-01] table.table.table-bordered");
      });
      it("should allow adding classes to the months", function() {
        container.kalendorius({
          monthClass: 'month'
        });
        return expect(container).toContain("div[data-month=2012-05-01].month");
      });
      it("should allow starting from a custom month", function() {
        container.kalendorius({
          date: new Date(2012, 8, 23)
        });
        return expect(container).toContain("div[data-month=2012-09-01]");
      });
      it("should allow custom days names to be passed in", function() {
        var days, header;
        days = ['pirmadienis', 'antradienis', 'trečiadienis', 'ketvirtadienis', 'penktadienis', 'šeštadienis', 'sekmadienis'];
        container.kalendorius({
          dayNames: days
        });
        return expect((function() {
          var _i, _len, _ref, _results;
          _ref = container.find("th");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            header = _ref[_i];
            _results.push($(header).text());
          }
          return _results;
        })()).toEqual(days);
      });
      return it("should allow custom months names to be passed in", function() {
        var months;
        months = ['sausio', 'vasario', 'kovo', 'balandzio', 'geguzes', 'birzelio', 'liepos', 'rugpjucio', 'rugsejo', 'spalio', 'lapkricio', 'gruodis'];
        container.kalendorius({
          monthNames: months
        });
        return expect(container.find('div[data-month=2012-05-01] div.month-header').text()).toEqual('geguzes');
      });
    });
    describe("moving between months", function() {
      beforeEach(function() {
        var instace;
        return instace = instance = container.kalendorius();
      });
      it("should move to the next month", function() {
        expect(container).toContain("div[data-month=2012-05-01]");
        container.kalendorius('next');
        expect(container).toContain("div[data-month=2012-06-01]");
        return expect(container.find('div[data-month=2012-06-01] div.month-header').text()).toEqual('June');
      });
      it("should fire the change event when moving to the next month", function() {
        var triggered;
        triggered = false;
        instance.onChange = function() {
          return triggered = true;
        };
        container.kalendorius('next');
        return expect(triggered).toEqual(true);
      });
      it("should move to the previous month", function() {
        expect(container).toContain("div[data-month=2012-05-01]");
        container.kalendorius('prev');
        expect(container).toContain("div[data-month=2012-04-01]");
        return expect(container.find('div[data-month=2012-04-01] div.month-header').text()).toEqual('April');
      });
      it("should fire the change event when moving to the previous month", function() {
        var triggered;
        triggered = false;
        instance.onChange = function() {
          return triggered = true;
        };
        container.kalendorius('prev');
        return expect(triggered).toEqual(true);
      });
      it("should move to today", function() {
        expect(container).toContain("div[data-month=2012-05-01]");
        Timecop.freeze(new Date(2012, 6, 1, 10, 48));
        container.kalendorius('today');
        expect(container).toContain("div[data-month=2012-07-01]");
        return expect(container.find('div[data-month=2012-07-01] div.month-header').text()).toEqual('July');
      });
      it("should fire the change event when moving to today", function() {
        var triggered;
        triggered = false;
        instance.onChange = function() {
          return triggered = true;
        };
        container.kalendorius('tody');
        return expect(triggered).toEqual(true);
      });
      it("should maintain selected dates when moving between months", function() {
        var date;
        date = container.find('td[data-date=2012-05-11]');
        date.click();
        date.click();
        expect(container).toContain("td[data-date=2012-05-11].date-selected");
        container.kalendorius('next');
        expect(container).not.toContain("td[data-date=2012-05-11].date-selected");
        container.kalendorius('prev');
        return expect(container).toContain("td[data-date=2012-05-11].date-selected");
      });
      return it("should allow dates to be selected after moving between months", function() {
        var date;
        container.kalendorius('next');
        expect(container).not.toContain("td[data-date=2012-05-11]");
        container.kalendorius('prev');
        expect(container).toContain("td[data-date=2012-05-11]");
        date = container.find('td[data-date=2012-05-11]');
        date.click();
        date.click();
        return expect(container).toContain("td[data-date=2012-05-11].date-selected");
      });
    });
    describe("multiple instances", function() {
      var container2;
      container2 = void 0;
      beforeEach(function() {
        container2 = $("<div>");
        container.kalendorius();
        return container2.kalendorius();
      });
      it("should allow them to be changed between independently", function() {
        expect(container).toContain("div[data-month=2012-05-01]");
        expect(container2).toContain("div[data-month=2012-05-01]");
        container.kalendorius('next');
        expect(container).toContain("div[data-month=2012-06-01]");
        return expect(container2).toContain("div[data-month=2012-05-01]");
      });
      return it("should maintain a seperate state of selected dates", function() {
        var date;
        date = container.find('td[data-date=2012-05-11]');
        date.click();
        date.click();
        expect(container).toContain("td[data-date=2012-05-11].date-selected");
        return expect(container2).not.toContain("td[data-date=2012-05-11].date-selected");
      });
    });
    return describe("#getSelected", function() {
      beforeEach(function() {
        return instance = container.kalendorius();
      });
      it("should return an empty list when nothing is selected", function() {
        return expect(instance.getSelected()).toEqual([]);
      });
      it("should return a one element list when one date is selected", function() {
        var startDate;
        startDate = container.find('td[data-date=2012-05-11]');
        startDate.click();
        startDate.click();
        return expect(instance.getSelected()).toEqual(['2012-05-11']);
      });
      it("should return multi elements list when a range is selected", function() {
        var endDate, startDate;
        startDate = container.find('td[data-date=2012-05-11]');
        startDate.click();
        endDate = container.find('td[data-date=2012-05-13]');
        endDate.mouseover();
        endDate.click();
        return expect(instance.getSelected()).toEqual(['2012-05-11', '2012-05-12', '2012-05-13']);
      });
      return it("should return all selected dates in ascending order", function() {
        var date1, date2, endDate, startDate;
        startDate = container.find('td[data-date=2012-05-11]');
        startDate.click();
        endDate = container.find('td[data-date=2012-05-13]');
        endDate.mouseover();
        endDate.click();
        date1 = container.find('td[data-date=2012-05-20]');
        date1.click();
        date1.click();
        date2 = container.find('td[data-date=2012-05-02]');
        date2.click();
        date2.click();
        return expect(instance.getSelected()).toEqual(['2012-05-02', '2012-05-11', '2012-05-12', '2012-05-13', '2012-05-20']);
      });
    });
  });

}).call(this);
