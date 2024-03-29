(function($){
  var Kalendorius = (function() {
    function Kalendorius() {
    }

    Kalendorius.prototype._renderMonth = function(renderDate) {
      var today = this._today();
      var startOfMonth = new Date(renderDate.getFullYear(), renderDate.getMonth(), 1);

      var month = $('<div>')
                    .addClass(this.options.monthClass)
                    .attr('data-month', this._toYMD(startOfMonth));

      var monthHeader = $('<div>')
                    .addClass('month-header')
                    .text(this.options.monthNames[renderDate.getMonth()]);
      month.append(monthHeader);

      var table = $('<table>')
                    .addClass(this.options.tableClass);


      var head = $('<thead>');
      table.append(head);
      var row = $('<tr>');
      head.append(row);
      for (var day = 0; day < 7; day++) {
        var column = $('<th>').text(this.options.dayNames[day]);
        row.append(column);
      }

      // get the previous sunday before the start of this month
      // we pass this to new Date(y, m, d) to get the actual date this corresponds to
      var firstDay = startOfMonth.getDate() - startOfMonth.getDay();
      if (startOfMonth.getDay() == 0) {
        firstDay -= 7;
      }

      // be sane, start the week on monday
      firstDay = firstDay + 1;

      var body = $('<tbody>');
      table.append(body);

      var tr = undefined;
      for (var day = 0; day < 42; day++) {
        if (day % 7 == 0) {
          tr = $('<tr>');
          body.append(tr);
        }

        var currentDate = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), firstDay + day);
        var currentElement = $('<td>').attr('data-date', this._toYMD(currentDate)).append($('<span>').text(currentDate.getDate()));

        if (currentDate.getMonth() < startOfMonth.getMonth()) {
          currentElement.addClass('date-prev-month');
        } else if (currentDate.getMonth() > startOfMonth.getMonth()) {
          currentElement.addClass('date-next-month');
        } else {
          currentElement.addClass('date-current-month');
          if (currentDate.getDate() == today.getDate() && currentDate.getMonth() == today.getMonth() && currentDate.getFullYear() == today.getFullYear()) {
            currentElement.addClass('date-today');
          } else if (currentDate < today) {
            currentElement.addClass('date-past');
          }
        }
        tr.append(currentElement);
      }

      month.append(table);
      return month;
    };

    Kalendorius.prototype._toggleSelected = function(selection) {
      var _this = this;
      if (selection.length == 1) {
        // toggle if only one selected
        var date = selection.attr('data-date');
        if (selection.hasClass('date-selected')) {
          _this.element.find('td[data-date=' + date + ']').removeClass('date-selected')
          _this._updateSelected();
          if (typeof _this.onUnselected !== 'undefined') {
            _this.onUnselected([date]);
          }
          if (typeof _this.onChange !== 'undefined') {
            _this.onChange();
          }
        } else {
          _this.element.find('td[data-date=' + date + ']').addClass('date-selected')
          _this._updateSelected();
          if (typeof _this.onSelected !== 'undefined') {
            _this.onSelected([date]);
          }
          if (typeof _this.onChange !== 'undefined') {
            _this.onChange();
          }
        }
      } else if (selection.length == selection.filter('.date-selected').length) {
        // if all selected, set all as unselected
        var dates = [];
        selection.each(function() {
          var date = $(this).attr('data-date');
          dates.push(date);
          _this.element.find('td[data-date=' + date + ']').removeClass('date-selected')
        });
        _this._updateSelected();
        if (typeof _this.onUnselected !== 'undefined') {
          _this.onUnselected(dates);
        }
        if (typeof _this.onChange !== 'undefined') {
          _this.onChange();
        }
      } else {
        // if some or none selected, set all as selected
        var dates = [];
        selection.each(function() {
          var date = $(this).attr('data-date');
          dates.push(date);
          _this.element.find('td[data-date=' + date + ']').addClass('date-selected')
        });
        _this._updateSelected();
        if (typeof _this.onSelected !== 'undefined') {
          _this.onSelected(dates);
        }
        if (typeof _this.onChange !== 'undefined') {
          _this.onChange();
        }
      }
    };

    Kalendorius.prototype._updateSelected = function() {
      var dates = this.element.find('td.date-current-month');
      for(var i = 0; i < dates.length; i++) {
        var date = $(dates[i]).attr('data-date');
        if ($(dates[i]).hasClass('date-selected')) {
          this.selected[date] = true;
        } else {
          delete this.selected[date];
        }
      }
    }

    Kalendorius.prototype._toggleRange = function(selection) {
      var _this = this;
      selection.each(function() {
        var date = $(this).attr('data-date');
        _this.element.find('td[data-date=' + date + ']').toggleClass('date-range')
      });
    };

    Kalendorius.prototype.getSelected = function() {
      var dates = [];
      for (var date in this.selected) {
        dates.push(date);
      }
      return dates.sort();
    };

    Kalendorius.prototype.getMonth = function() {
      return this.options.monthNames[this.options.date.getMonth()];
    };

    Kalendorius.prototype.setSelected = function(dates, selected) {
      var today = this._today();

      if (selected == undefined) {
        selected = true;
      }

      for (var i = 0; i < dates.length; i++) {
        var date = dates[i];

        // ignore dates in the past
        if (this.options.disablePast) {
          var currentDate = new Date(date);
          if (currentDate < today) {
            continue;
          }
        }

        if (selected) {
          this.selected[date] = true;
          this.element.find('td[data-date=' + date + ']').addClass('date-selected')
        } else {
          delete this.selected[date];
          this.element.find('td[data-date=' + date + ']').removeClass('date-selected')
        }
      }

      if (typeof this.onChange !== 'undefined') {
        this.onChange();
      }
    };

    Kalendorius.prototype.render = function() {
      var _this = this;
      this.element.html('');

      for (var month = 0; month < this.options.months; month++) {
        var currentMonth = new Date(this.options.date.getFullYear(), this.options.date.getMonth() + month, 1);
        var table = this._renderMonth(currentMonth);
        this.element.append(table);
      }

      for (var date in this.selected) {
        if (this.selected[date] === true) {
          this.element.find('td[data-date=' + date + ']').addClass('date-selected')
        }
      }

      var rangeStart = undefined;

      this.element.find('td')
        .mouseenter(function() {
          var $this = $(this);
          if ($this.hasClass('date-current-month')) {
            // don't hover for dates in the past
            if (_this.options.disablePast) {
              var currentDate = new Date($this.attr('data-date'));
              if (currentDate < _this._today()) {
                return;
              }
            }
            $this.addClass('date-hover');
            if (rangeStart !== undefined) {
              _this.element.find('td').removeClass('date-range');
              _this._toggleRange(_this._between(_this.element.find('td.date-current-month'), rangeStart, $this));
            }
          }
        }).mouseleave(function() {
          var $this = $(this);
          $this.removeClass('date-hover');
        }).click(function() {
          var $this = $(this);
          // don't click for dates in the past
          if (_this.options.disablePast) {
            var currentDate = new Date($this.attr('data-date'));
            if (currentDate < _this._today()) {
              return;
            }
          }
          if ($this.hasClass('date-range-start')) {
            rangeStart = undefined;
            _this.element.find('td').removeClass('date-range');
            $this.removeClass('date-range-start');
            _this._toggleSelected($this);
          } else if (rangeStart) {
            rangeStart = undefined;
            _this._toggleSelected(_this.element.find('td.date-range.date-current-month'));
            _this.element.find('td.date-range')
              .removeClass('date-range-start')
              .removeClass('date-range');
          } else {
            if ($this.hasClass('date-current-month')) {
              $this.addClass('date-range-start');
              rangeStart = $this;
            }
          }
          this.blur();
        });

        if (typeof _this.onViewChange !== 'undefined') {
          _this.onViewChange();
        }
    };

    Kalendorius.prototype._today = function() {
      var date = new Date();
      date.setHours(0,0,0,0);
      return date;
    };

    //
    // extensions
    //

    // returns the elements in the jquery
    // selection between elm0 and elm1
    Kalendorius.prototype._between = function (selection, elm0, elm1) {
      var index0 = selection.index(elm0);
      var index1 = selection.index(elm1);

      if (index0 <= index1)
        return selection.slice(index0, index1 + 1);
      else
        return selection.slice(index1, index0 + 1);
    };

    // formats a date in YYYY-MM-DD format
    // (including leading zeros)
    Kalendorius.prototype._toYMD = function(date) {
      var y = date.getFullYear();

      var m = date.getMonth() + 1; // WHY??!?!??!?!?!?
      m = (m < 10) ? "0" + m : m;

      var d = date.getDate();
      d = (d < 10) ? "0" + d : d;

      return y + "-" + m + "-" + d;
    };

    return Kalendorius;
  })();

  $.fn.kalendorius = function(options, arg1, arg2) {
    this.each(function(_, element) {
      var element = $(element);
      var k = element.data('kalendorius');
      if (typeof k === 'undefined') {
        k = new Kalendorius();
        k.element = element;
        k.options = {};
        element.data('kalendorius', k);
      }
      if (options == "next") {
        k.options.date = new Date(k.options.date.getFullYear(), k.options.date.getMonth() + 1, 1);
        k.render();
      } else if (options === "prev") {
        k.options.date = new Date(k.options.date.getFullYear(), k.options.date.getMonth() - 1, 1);
        k.render();
      } else if (options === "today") {
        k.options.date = new Date();
        k.render();
      } else if (options == "setSelected") {
        k.setSelected(arg1, arg2);
      } else {
        k.selected = {};
        k.options = options || {};
        k.options.months = typeof k.options.months !== "undefined" && k.options.months !== null ? k.options.months : 1;
        k.options.date = typeof k.options.date !== "undefined" && k.options.date !== null ? k.options.date : new Date();
        k.options.dayNames = typeof k.options.dayNames !== "undefined" && k.options.dayNames !== null ? k.options.dayNames : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        k.options.monthNames = typeof k.options.monthNames !== "undefined" && k.options.monthNames !== null ? k.options.monthNames : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        k.options.disablePast = typeof k.options.disablePast !== "undefined" && k.options.disablePast !== null ? k.options.disablePast : false;

        if (typeof k.options.selected !== "undefined" && k.options.selected !== null) {
          k.setSelected(k.options.selected);
        }

        k.render();
      }
    });

    if (this.length == 1) {
      return this.data('kalendorius');
    } else {
      return true;
    }
  };
})( jQuery );
