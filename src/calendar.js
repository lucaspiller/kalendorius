(function($){
  var c = undefined,
      k = undefined;

  var _renderMonth = function(renderDate, options) {
    var startOfMonth = new Date(renderDate.getFullYear(), renderDate.getMonth(), 1);

    var table = $('<table>')
                  .attr('data-month', _toYMD(startOfMonth))
                  .addClass(options.tableClass);

    // add table header
    var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    var head = $('<thead>');
    table.append(head);
    for (var day = 0; day < 7; day++) {
      var column = $('<th>').text(days[day]);
      head.append(column);
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
      var currentElement = $('<td>').attr('data-date', _toYMD(currentDate)).text(currentDate.getDate());

      if (currentDate.getMonth() < startOfMonth.getMonth()) {
        currentElement.addClass('date-prev-month');
      } else if (currentDate.getMonth() > startOfMonth.getMonth()) {
        currentElement.addClass('date-next-month');
      } else {
        currentElement.addClass('date-current-month');
      }
      tr.append(currentElement);
    }

    return table;
  };

  var _toggleSelected = function(selection) {
    var unselected = c.find('td.date-selected');
    for(var i = 0; i < unselected.length; i++) {
      var date = $(unselected[i]).attr('data-date');
      k.selected[date] = false;
    }

    selection.each(function() {
      var date = $(this).attr('data-date');
      c.find('td[data-date=' + date + ']').toggleClass('date-selected')
    });

    var selected = c.find('td.date-selected');
    for(var i = 0; i < selected.length; i++) {
      var date = $(selected[i]).attr('data-date');
      k.selected[date] = true;
    }
  };

  var _toggleRange = function(selection) {
    selection.each(function() {
      var date = $(this).attr('data-date');
      c.find('td[data-date=' + date + ']').toggleClass('date-range')
    });
  };

  var _render = function(options) {
    c.html('');

    for (var month = 0; month < options.months; month++) {
      var currentMonth = new Date(options.date.getFullYear(), options.date.getMonth() + month, 1);
      var table = _renderMonth(currentMonth, options);
      c.append(table);
    }

    for (var date in k.selected) {
      if (k.selected[date] === true) {
        c.find('td[data-date=' + date + ']').addClass('date-selected')
      }
    }

    var rangeStart = undefined;

    c.find('td')
      .mouseenter(function() {
        var $this = $(this);
        if ($this.hasClass('date-current-month')) {
          $this.addClass('date-hover');
          if (rangeStart !== undefined) {
            c.find('td').removeClass('date-range');
            _toggleRange(_between(c.find('td.date-current-month'), rangeStart, $this));
          }
        }
      }).mouseleave(function() {
        var $this = $(this);
        $this.removeClass('date-hover');
      }).click(function() {
        var $this = $(this);
        if ($this.hasClass('date-range-start')) {
          rangeStart = undefined;
          c.find('td').removeClass('date-range');
          $this.removeClass('date-range-start');
          _toggleSelected($this);
        } else if (rangeStart) {
          rangeStart = undefined;
          _toggleSelected(c.find('td.date-range.date-current-month'));
          c.find('td.date-range')
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
  }

  //
  // extensions
  //

  // returns the elements in the jquery
  // selection between elm0 and elm1
  var _between = function (selection, elm0, elm1) {
    var index0 = selection.index(elm0);
    var index1 = selection.index(elm1);

    if (index0 <= index1)
      return selection.slice(index0, index1 + 1);
    else
      return selection.slice(index1, index0 + 1);
  };

  // formats a date in YYYY-MM-DD format
  // (including leading zeros)
  var _toYMD = function(date) {
    var y = date.getFullYear();

    var m = date.getMonth() + 1; // WHY??!?!??!?!?!?
    m = (m < 10) ? "0" + m : m;

    var d = date.getDate();
    d = (d < 10) ? "0" + d : d;

    return y + "-" + m + "-" + d;
  };

  $.fn.kalendorius = function(options) {
    c = this;
    if (options == "next") {
      k.options.date = new Date(k.options.date.getFullYear(), k.options.date.getMonth() + 1, 1);
      _render(k.options);
    } else if (options === "prev") {
      k.options.date = new Date(k.options.date.getFullYear(), k.options.date.getMonth() - 1, 1);
      _render(k.options);
    } else if (options === "today") {
      k.options.date = new Date();
      _render(k.options);
    } else {
      k = {};
      k.selected = {};
      k.options = options || {};
      k.options.months = typeof k.options.months !== "undefined" && k.options.months !== null ? k.options.months : 1;
      k.options.date = typeof k.options.date !== "undefined" && k.options.date !== null ? k.options.date : new Date();

      _render(k.options);
    }

    return true;
  };
})( jQuery );
