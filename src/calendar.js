(function($){
  var c = undefined;

  var _renderMonth = function(renderDate) {
    var startOfMonth = new Date(renderDate.getFullYear(), renderDate.getMonth(), 1);

    var table = $('<table>')
                  .attr('data-month', _toYMD(startOfMonth))
                  .addClass('table') // TODO move to options
                  .addClass('table-bordered');

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

  var _toggleDateClass = function(selection, className) {
    selection.each(function() {
      var date = $(this).attr('data-date');
      c.find('td[data-date=' + date + ']').toggleClass(className);
    });
  };

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

  $.fn.calendar = function(options) {
    c = $(this);

    var options = options || {};
    options.months = typeof options.months !== "undefined" && options.months !== null ? options.months : 1;

    var startDate = new Date();

    for (var month = 0; month < options.months; month++) {
      var currentMonth = new Date(startDate.getFullYear(), startDate.getMonth() + month, 1);

      var table = _renderMonth(currentMonth);
      c.append(table);
    }

    var rangeStart = undefined;

    c.find('td')
      .mouseenter(function() {
        var $this = $(this);
        if ($this.hasClass('date-current-month')) {
          $this.addClass('date-hover');
          if (rangeStart !== undefined) {
            c.find('td').removeClass('date-range');
            _toggleDateClass(_between(c.find('td.date-current-month'), rangeStart, $this), 'date-range');
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
          _toggleDateClass($this, 'date-selected');
        } else if (rangeStart) {
          rangeStart = undefined;
          _toggleDateClass(c.find('td.date-range.date-current-month'), 'date-selected');
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

    //var clickStart = undefined;
    //table.find('td').click(function() {
    //  if (clickStart === undefined) {
    //    $(this).addClass('clicked');
    //    clickStart = $(this);
    //  } else {
    //    var elements = getDatesBetween(clickStart, $(this));
    //    elements.toggleClass('selected').removeClass('mouse').removeClass('clicked');
    //    clickStart = undefined;
    //  }
    //});

    //var getDatesBetween = function(start, end) {
    //  var within = false;
    //  var elements = [];

    //  table.find('td').each(function(i) {
    //    var td = $(this);
    //    if (within == false) {
    //      if (td.attr('data-date') == start.attr('data-date')) {
    //        elements.push(start.get(0));
    //        within = true;
    //      } else if (td.attr('data-date') == end.attr('data-date')) {
    //        elements.push(end.get(0));
    //        within = true;
    //      } else {
    //        td.removeClass('mouse');
    //      }
    //    } else {
    //      if (td.attr('data-date') == end.attr('data-date')) {
    //        elements.push(end.get(0));
    //        within = false;
    //      } else if (td.attr('data-date') == start.attr('data-date')) {
    //        td.addClass('mouse');
    //        elements.push(start.get(0));
    //        within = false;
    //      } else {
    //        td.addClass('mouse');
    //        elements.push(this);
    //      }
    //    }
    //  });

    //  return $(elements);
    //};

    //table.find('td').mouseover(function() {
    //  if (clickStart) {
    //    getDatesBetween(clickStart, $(this));
    //  }
    //});
    return true;
  };
})( jQuery );
