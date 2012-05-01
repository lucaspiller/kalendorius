describe "CalendarSpec", ->
  container = undefined

  beforeEach ->
    Timecop.install()
    Timecop.freeze new Date(2012, 4, 1, 10, 48) # 1st May 2012
    container = $("<div>")

  afterEach ->
    Timecop.uninstall()

  describe "arguments", ->
    it "should accept zero arguments", ->
      container.calendar()

    it "should accept an options hash", ->
      container.calendar {}

  describe "basic rendering", ->
    beforeEach ->
      container.calendar()

    it "should contain day headers", ->
      expect(
          $(header).text() for header in container.find("th")
        ).toEqual [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ]

    it "should contain an element for each day of the month", ->
      for date in [1..31]
        if date < 10
          formattedDate = "0#{date}"
        else
          formattedDate = date
        expect(container).toContain("td[data-date=2012-05-#{formattedDate}]")

    it "should contain the days of the last month in the first week", ->
      expect(container).not.toContain("td[data-date=2012-04-29][class=date-prev-month]")

      expect(container).toContain("td[data-date=2012-04-30][class=date-prev-month]")

    it "should contain the days of the next month in the last weeks", ->
      expect(container).toContain("td[data-date=2012-06-01][class=date-next-month]")
      expect(container).toContain("td[data-date=2012-06-02][class=date-next-month]")
      expect(container).toContain("td[data-date=2012-06-03][class=date-next-month]")

      # we always display six weeks
      expect(container).toContain("td[data-date=2012-06-04][class=date-next-month]")
      expect(container).toContain("td[data-date=2012-06-05][class=date-next-month]")
      expect(container).toContain("td[data-date=2012-06-06][class=date-next-month]")
      expect(container).toContain("td[data-date=2012-06-07][class=date-next-month]")
      expect(container).toContain("td[data-date=2012-06-08][class=date-next-month]")
      expect(container).toContain("td[data-date=2012-06-09][class=date-next-month]")
      expect(container).toContain("td[data-date=2012-06-10][class=date-next-month]")

      expect(container).not.toContain("td[data-date=2012-06-11][class=date-next-month]")

  describe "highlighting", ->
    startDate = undefined

    beforeEach ->
      container.calendar()
      startDate = container.find('td[data-date=2012-05-11]')

    describe "unselected dates", ->
      it "should add the date-hover class to dates on mouse over", ->
        startDate.mouseenter()
        expect(container).toContain("td[data-date=2012-05-11].date-hover")

        startDate.mouseleave()
        expect(container).not.toContain("td[data-date=2012-05-11].date-hover")

      it "should add the date-range-start class to dates when clicked once", ->
        startDate.click()
        expect(container).toContain("td[data-date=2012-05-11].date-range-start")

      it "should add the date-selected class to dates when clicked twice", ->
        startDate.click()
        startDate.click()

        expect(container).not.toContain("td[data-date=2012-05-11].date-range-start")
        expect(container).toContain("td[data-date=2012-05-11].date-selected")

    describe "selected dates", ->
      beforeEach ->
        startDate.addClass 'date-selected'

      it "should add the date-hover class to dates on mouse over", ->
        expect(container).toContain("td[data-date=2012-05-11].date-selected")

        startDate.mouseenter()
        expect(container).toContain("td[data-date=2012-05-11].date-selected.date-hover")

        startDate.mouseleave()
        expect(container).not.toContain("td[data-date=2012-05-11].date-hover.date-selected")
        expect(container).toContain("td[data-date=2012-05-11].date-selected")

      it "should add the date-range-start class to dates when clicked once", ->
        startDate.click()
        expect(container).toContain("td[data-date=2012-05-11].date-selected.date-range-start")

      it "should remove the date-selected class to dates when clicked twice", ->
        startDate.click()
        startDate.click()

        expect(container).not.toContain("td[data-date=2012-05-11].date-range-start")
        expect(container).not.toContain("td[data-date=2012-05-11].date-selected")

    describe "range selection", ->
      endDate = undefined

      beforeEach ->
        startDate.click()

      describe "forward on the same week", ->
        beforeEach ->
          endDate = container.find('td[data-date=2012-05-13]')

        it "should add the date-range class to all dates between that and the hovered date", ->
          endDate.mouseenter()

          expect(container).toContain("td[data-date=2012-05-11].date-range-start.date-range")
          expect(container).toContain("td[data-date=2012-05-12].date-range")
          expect(container).toContain("td[data-date=2012-05-13].date-range.date-hover")

        it "should add the date-selected class to all dates between that and the clicked date", ->
          endDate.mouseenter()
          endDate.click()

          expect(container).toContain("td[data-date=2012-05-11].date-selected")
          expect(container).toContain("td[data-date=2012-05-12].date-selected")
          expect(container).toContain("td[data-date=2012-05-13].date-selected.date-hover")

      describe "forward on a different week", ->
        beforeEach ->
          endDate = container.find('td[data-date=2012-05-15]')

        it "should add the date-range class to all dates between that and the hovered date", ->
          endDate.mouseenter()

          expect(container).toContain("td[data-date=2012-05-11].date-range-start.date-range")
          expect(container).toContain("td[data-date=2012-05-12].date-range")
          expect(container).toContain("td[data-date=2012-05-13].date-range")
          expect(container).toContain("td[data-date=2012-05-14].date-range")
          expect(container).toContain("td[data-date=2012-05-15].date-range.date-hover")

        it "should add the date-selected class to all dates between that and the clicked date", ->
          endDate.mouseenter()
          endDate.click()

          expect(container).toContain("td[data-date=2012-05-11].date-selected")
          expect(container).toContain("td[data-date=2012-05-12].date-selected")
          expect(container).toContain("td[data-date=2012-05-13].date-selected")
          expect(container).toContain("td[data-date=2012-05-14].date-selected")
          expect(container).toContain("td[data-date=2012-05-15].date-selected.date-hover")

      describe "backward on the same week", ->
        beforeEach ->
          endDate = container.find('td[data-date=2012-05-09]')

        it "should add the date-range class to all dates between that and the hovered date", ->
          endDate.mouseenter()

          expect(container).toContain("td[data-date=2012-05-11].date-range-start.date-range")
          expect(container).toContain("td[data-date=2012-05-10].date-range")
          expect(container).toContain("td[data-date=2012-05-09].date-range.date-hover")

        it "should add the date-selected class to all dates between that and the clicked date", ->
          endDate.mouseenter()
          endDate.click()

          expect(container).toContain("td[data-date=2012-05-11].date-selected")
          expect(container).toContain("td[data-date=2012-05-10].date-selected")
          expect(container).toContain("td[data-date=2012-05-09].date-selected.date-hover")

      describe "backward on a different week", ->
        beforeEach ->
          endDate = container.find('td[data-date=2012-05-05]')

        it "should add the date-range class to all dates between that and the hovered date", ->
          endDate.mouseenter()

          expect(container).toContain("td[data-date=2012-05-11].date-range-start.date-range")
          expect(container).toContain("td[data-date=2012-05-10].date-range")
          expect(container).toContain("td[data-date=2012-05-09].date-range")
          expect(container).toContain("td[data-date=2012-05-08].date-range")
          expect(container).toContain("td[data-date=2012-05-07].date-range")
          expect(container).toContain("td[data-date=2012-05-06].date-range")
          expect(container).toContain("td[data-date=2012-05-05].date-range.date-hover")

        it "should add the date-selected class to all dates between that and the clicked date", ->
          endDate.mouseenter()
          endDate.click()

          expect(container).toContain("td[data-date=2012-05-11].date-selected")
          expect(container).toContain("td[data-date=2012-05-10].date-selected")
          expect(container).toContain("td[data-date=2012-05-09].date-selected")
          expect(container).toContain("td[data-date=2012-05-08].date-selected")
          expect(container).toContain("td[data-date=2012-05-07].date-selected")
          expect(container).toContain("td[data-date=2012-05-06].date-selected")
          expect(container).toContain("td[data-date=2012-05-05].date-selected.date-hover")

    describe "range unselection", ->
      endDate = undefined

      beforeEach ->
        endDate = container.find('td[data-date=2012-05-13]')

      describe "forward on the same week", ->
        it "should remove the date-selected class to all dates between that and the clicked date", ->
          # select everything
          startDate.click()
          endDate.mouseenter()
          endDate.click()

          expect(container).toContain("td[data-date=2012-05-11].date-selected")
          expect(container).toContain("td[data-date=2012-05-12].date-selected")
          expect(container).toContain("td[data-date=2012-05-13].date-selected.date-hover")

          # unselect everything
          startDate.click()
          endDate.mouseenter()
          endDate.click()

          expect(container).not.toContain("td[data-date=2012-05-11].date-selected")
          expect(container).not.toContain("td[data-date=2012-05-12].date-selected")
          expect(container).not.toContain("td[data-date=2012-05-13].date-selected")
          expect(container).toContain("td[data-date=2012-05-13].date-hover")

        it "should toggle the date-selected class to all dates between that and the clicked date", ->
          # select everything
          startDate.click()
          endDate.mouseenter()
          endDate.click()

          expect(container).toContain("td[data-date=2012-05-11].date-selected")
          expect(container).toContain("td[data-date=2012-05-12].date-selected")
          expect(container).toContain("td[data-date=2012-05-13].date-selected.date-hover")

          # toggle one
          midDate = container.find('td[data-date=2012-05-12]')
          midDate.click()
          midDate.click()

          expect(container).not.toContain("td[data-date=2012-05-12].date-selected")

          # unselect everything
          startDate.click()
          endDate.mouseenter()
          endDate.click()

          expect(container).not.toContain("td[data-date=2012-05-11].date-selected")
          expect(container).toContain("td[data-date=2012-05-12].date-selected")
          expect(container).not.toContain("td[data-date=2012-05-13].date-selected")
          expect(container).toContain("td[data-date=2012-05-13].date-hover")