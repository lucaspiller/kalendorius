(function($){
  $.fn.calendar = function(options) {
    var options = options || {};

    var table = $('<table>').addClass('table').addClass('table-bordered');

    // add table header
    var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    var head = $('<thead>');
    table.append(head);
    for (var day = 0; day < 7; day++) {
      var column = $('<th>').text(days[day]);
      head.append(column);
    }

    var today = new Date();

    var startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // get the previous sunday before the start of this month
    // we pass this to new Date(y, m, d) to get the actual date this corresponds to
    //var firstDay = -(5 - startOfMonth.getDay())
    var firstDay = startOfMonth.getDate() - startOfMonth.getDay();

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

      var currentDate = new Date(today.getFullYear(), today.getMonth(), firstDay + day);

      var formattedMonth = (currentDate.getMonth() + 1) < 10 ? "0" + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1);
      var formattedDay = currentDate.getDate() < 10 ? "0" + currentDate.getDate() : currentDate.getDate();

      var formattedDate = currentDate.getFullYear() + "-" + formattedMonth + "-" + formattedDay;
      var currentElement = $('<td>').attr('data-date', formattedDate).text(currentDate.getDate());

      if (currentDate.getMonth() < startOfMonth.getMonth()) {
        currentElement.addClass('date-prev-month');
      } else if (currentDate.getMonth() > startOfMonth.getMonth()) {
        currentElement.addClass('date-next-month');
      }
      tr.append(currentElement);
    }

    var clickStart = undefined;
    table.find('td').click(function() {
      if (clickStart === undefined) {
        $(this).addClass('clicked');
        clickStart = $(this);
      } else {
        var elements = getDatesBetween(clickStart, $(this));
        elements.toggleClass('selected').removeClass('mouse').removeClass('clicked');
        clickStart = undefined;
      }
    });

    var getDatesBetween = function(start, end) {
      var within = false;
      var elements = [];

      table.find('td').each(function(i) {
        var td = $(this);
        if (within == false) {
          if (td.attr('data-date') == start.attr('data-date')) {
            elements.push(start.get(0));
            within = true;
          } else if (td.attr('data-date') == end.attr('data-date')) {
            elements.push(end.get(0));
            within = true;
          } else {
            td.removeClass('mouse');
          }
        } else {
          if (td.attr('data-date') == end.attr('data-date')) {
            elements.push(end.get(0));
            within = false;
          } else if (td.attr('data-date') == start.attr('data-date')) {
            td.addClass('mouse');
            elements.push(start.get(0));
            within = false;
          } else {
            td.addClass('mouse');
            elements.push(this);
          }
        }
      });

      return $(elements);
    };

    table.find('td').mouseover(function() {
      if (clickStart) {
        getDatesBetween(clickStart, $(this));
      }
    });

    this.append(table);
    return true;
  };
})( jQuery );
