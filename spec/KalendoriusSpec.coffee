describe "KalendoriusSpec", ->
  container = undefined
  instance = undefined

  beforeEach ->
    Timecop.install()
    Timecop.freeze new Date(2012, 4, 1, 10, 48) # 1st May 2012
    container = $("<div>")

  afterEach ->
    Timecop.uninstall()

  describe "arguments", ->
    it "should accept zero arguments", ->
      container.kalendorius()

    it "should accept an options hash", ->
      container.kalendorius {}

  describe "basic rendering", ->
    beforeEach ->
      container.kalendorius()

    it "should contain the month header", ->
      expect(container.find('div[data-month=2012-05-01] div.month-header').text()).toEqual('May')

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
        expect(container).toContain("td[data-date=2012-05-#{formattedDate}].date-current-month")

    it "should contain the days of the last month in the first week", ->
      expect(container).not.toContain("td[data-date=2012-04-29].date-prev-month")

      expect(container).toContain("td[data-date=2012-04-30].date-prev-month")

    it "should contain the days of the next month in the last weeks", ->
      expect(container).toContain("td[data-date=2012-06-01].date-next-month")
      expect(container).toContain("td[data-date=2012-06-02].date-next-month")
      expect(container).toContain("td[data-date=2012-06-03].date-next-month")

      # we always display six weeks
      expect(container).toContain("td[data-date=2012-06-04].date-next-month")
      expect(container).toContain("td[data-date=2012-06-05].date-next-month")
      expect(container).toContain("td[data-date=2012-06-06].date-next-month")
      expect(container).toContain("td[data-date=2012-06-07].date-next-month")
      expect(container).toContain("td[data-date=2012-06-08].date-next-month")
      expect(container).toContain("td[data-date=2012-06-09].date-next-month")
      expect(container).toContain("td[data-date=2012-06-10].date-next-month")

      expect(container).not.toContain("td[data-date=2012-06-11][class=date-next-month]")

    it "should add the class date-today for today", ->
      expect(container).toContain("td[data-date=2012-05-01].date-today")

    it "should fire the kalendorius:ready event", ->
      spyOnEvent(container, 'kalendorius:ready')
      container.kalendorius()
      expect('kalendorius:ready').toHaveBeenTriggeredOn(container)

  describe "highlighting", ->
    startDate = undefined

    beforeEach ->
      container.kalendorius()
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

      it "should fire the kalendorius:selected event when clicked twice", ->
        spyOnEvent(container, 'kalendorius:selected')

        startDate.click()
        startDate.click()

        expect('kalendorius:selected').toHaveBeenTriggeredOn(container)

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

      it "should remove the date-selected class to dates when clicked twice", ->
        startDate.click()
        startDate.click()

        expect(container).not.toContain("td[data-date=2012-05-11].date-range-start")
        expect(container).not.toContain("td[data-date=2012-05-11].date-selected")

      it "should fire the kalendorius:unselected event when clicked twice", ->
        spyOnEvent(container, 'kalendorius:unselected')

        startDate.click()
        startDate.click()

        expect('kalendorius:unselected').toHaveBeenTriggeredOn(container)

      it "should not add the date-hover or date-selected class to dates in the last month", ->
        expect(container).toContain("td[data-date=2012-04-30].date-prev-month")
        date = container.find("td[data-date=2012-04-30].date-prev-month")

        date.mouseenter()
        expect(container).not.toContain("td[data-date=2012-04-30].date-prev-month.date-hover")

        date.click()
        expect(container).not.toContain("td[data-date=2012-04-30].date-prev-month.date-range-start")

      it "should not add the date-hover or date-selected class to dates in the next month", ->
        expect(container).toContain("td[data-date=2012-06-01].date-next-month")
        date = container.find("td[data-date=2012-06-01].date-next-month")

        date.mouseenter()
        expect(container).not.toContain("td[data-date=2012-06-01].date-next-month.date-hover")

        date.click()
        expect(container).not.toContain("td[data-date=2012-06-01].date-next-month.date-range-start")

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

        it "should fire the kalendorius:selected event", ->
          spyOnEvent(container, 'kalendorius:selected')

          endDate.mouseenter()
          endDate.click()

          expect('kalendorius:selected').toHaveBeenTriggeredOn(container)

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

        it "should fire the kalendorius:selected event", ->
          spyOnEvent(container, 'kalendorius:selected')

          endDate.mouseenter()
          endDate.click()

          expect('kalendorius:selected').toHaveBeenTriggeredOn(container)

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

        it "should fire the kalendorius:selected event", ->
          spyOnEvent(container, 'kalendorius:selected')

          endDate.mouseenter()
          endDate.click()

          expect('kalendorius:selected').toHaveBeenTriggeredOn(container)

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

        it "should fire the kalendorius:selected event", ->
          spyOnEvent(container, 'kalendorius:selected')

          endDate.mouseenter()
          endDate.click()

          expect('kalendorius:selected').toHaveBeenTriggeredOn(container)

    describe "range unselection", ->
      endDate = undefined

      beforeEach ->
        endDate = container.find('td[data-date=2012-05-13]')

        # select everything
        startDate.click()
        endDate.mouseenter()
        endDate.click()

        expect(container).toContain("td[data-date=2012-05-11].date-selected")
        expect(container).toContain("td[data-date=2012-05-12].date-selected")
        expect(container).toContain("td[data-date=2012-05-13].date-selected.date-hover")

        startDate.click()


      describe "forward on the same week", ->
        it "should remove the date-selected class to all dates between that and the clicked date when none are selected", ->
          endDate.mouseenter()
          endDate.click()

          expect(container).not.toContain("td[data-date=2012-05-11].date-selected")
          expect(container).not.toContain("td[data-date=2012-05-12].date-selected")
          expect(container).not.toContain("td[data-date=2012-05-13].date-selected")
          expect(container).toContain("td[data-date=2012-05-13].date-hover")

        it "should fire the kalendorius:unselected event", ->
          spyOnEvent(container, 'kalendorius:unselected')

          endDate.mouseenter()
          endDate.click()

          expect('kalendorius:unselected').toHaveBeenTriggeredOn(container)

    describe "range partial selection", ->
      endDate = undefined

      beforeEach ->
        endDate = container.find('td[data-date=2012-05-13]')

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

        startDate.click()

      it "should set add the date-selected class to all dates between that and the clicked date when some are selected", ->
        endDate.mouseenter()
        endDate.click()

        expect(container).toContain("td[data-date=2012-05-11].date-selected")
        expect(container).toContain("td[data-date=2012-05-12].date-selected")
        expect(container).toContain("td[data-date=2012-05-13].date-selected")
        expect(container).toContain("td[data-date=2012-05-13].date-hover")

      it "should fire the kalendorius:selected event", ->
        spyOnEvent(container, 'kalendorius:selected')

        endDate.mouseenter()
        endDate.click()

        expect('kalendorius:selected').toHaveBeenTriggeredOn(container)


  describe "multi-month view", ->
    beforeEach ->
      container.kalendorius({
        months: 3
      })

    it "should render three months of data", ->
      expect(container.find('table').length).toEqual(3)

      expect(container).toContain("div[data-month=2012-05-01] td[data-date=2012-04-30]")
      expect(container).toContain("div[data-month=2012-05-01] td[data-date=2012-05-01]")
      expect(container).toContain("div[data-month=2012-05-01] td[data-date=2012-05-31]")
      expect(container).toContain("div[data-month=2012-05-01] td[data-date=2012-06-10]")

      expect(container).toContain("div[data-month=2012-06-01] td[data-date=2012-05-28]")
      expect(container).toContain("div[data-month=2012-06-01] td[data-date=2012-06-01]")
      expect(container).toContain("div[data-month=2012-06-01] td[data-date=2012-06-30]")
      expect(container).toContain("div[data-month=2012-06-01] td[data-date=2012-07-08]")

      expect(container).toContain("div[data-month=2012-07-01] td[data-date=2012-06-25]")
      expect(container).toContain("div[data-month=2012-07-01] td[data-date=2012-07-01]")
      expect(container).toContain("div[data-month=2012-07-01] td[data-date=2012-07-31]")
      expect(container).toContain("div[data-month=2012-07-01] td[data-date=2012-08-05]")

    it "should contain the month header for each month", ->
      expect(container.find('div[data-month=2012-05-01] div.month-header').text()).toEqual('May')
      expect(container.find('div[data-month=2012-06-01] div.month-header').text()).toEqual('June')
      expect(container.find('div[data-month=2012-07-01] div.month-header').text()).toEqual('July')

    describe "duplicated dates across a month boundary", ->
      it "should be kept in sync", ->
        date1 = container.find("div[data-month=2012-05-01] td[data-date=2012-06-03]")
        date2 = container.find("div[data-month=2012-06-01] td[data-date=2012-06-03]")

        # date1 is not clickable
        date2.click()
        date2.click()

        expect(container).toContain("div[data-month=2012-05-01] td[data-date=2012-06-03].date-selected")
        expect(container).toContain("div[data-month=2012-06-01] td[data-date=2012-06-03].date-selected")

        date2.click()
        date2.click()

        expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-03].date-selected")
        expect(container).not.toContain("div[data-month=2012-06-01] td[data-date=2012-06-03].date-selected")

      it "should be selected by ranges correctly", ->
        date1 = container.find("div[data-month=2012-05-01] td[data-date=2012-05-31]")
        date2 = container.find("div[data-month=2012-06-01] td[data-date=2012-06-01]")

        date1.click()
        date2.mouseenter()

        expect(container).toContain("div[data-month=2012-05-01] td[data-date=2012-05-31].date-range-start.date-range")
        expect(container).toContain("div[data-month=2012-05-01] td[data-date=2012-06-01].date-range")
        expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-02].date-range")
        expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-03].date-range")
        expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-04].date-range")
        expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-05].date-range")
        expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-06].date-range")
        expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-07].date-range")
        expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-08].date-range")
        expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-09].date-range")
        expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-10].date-range")

        expect(container).not.toContain("div[data-month=2012-06-01] td[data-date=2012-05-28].date-range")
        expect(container).not.toContain("div[data-month=2012-06-01] td[data-date=2012-05-29].date-range")
        expect(container).not.toContain("div[data-month=2012-06-01] td[data-date=2012-05-30].date-range")
        expect(container).toContain("div[data-month=2012-06-01] td[data-date=2012-05-31].date-range")
        expect(container).toContain("div[data-month=2012-06-01] td[data-date=2012-06-01].date-range.date-hover")

        date2.click()

        expect(container).toContain("div[data-month=2012-05-01] td[data-date=2012-05-31].date-selected")
        expect(container).toContain("div[data-month=2012-05-01] td[data-date=2012-06-01].date-selected")
        expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-02].date-selected")
        expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-03].date-selected")
        expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-04].date-selected")
        expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-05].date-selected")
        expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-06].date-selected")
        expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-07].date-selected")
        expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-08].date-selected")
        expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-09].date-selected")
        expect(container).not.toContain("div[data-month=2012-05-01] td[data-date=2012-06-10].date-selected")

        expect(container).not.toContain("div[data-month=2012-06-01] td[data-date=2012-05-28].date-selected")
        expect(container).not.toContain("div[data-month=2012-06-01] td[data-date=2012-05-29].date-selected")
        expect(container).not.toContain("div[data-month=2012-06-01] td[data-date=2012-05-30].date-selected")
        expect(container).toContain("div[data-month=2012-06-01] td[data-date=2012-05-31].date-selected")
        expect(container).toContain("div[data-month=2012-06-01] td[data-date=2012-06-01].date-selected.date-hover")

  describe "options", ->
    it "should allow adding classes to the tables", ->
      container.kalendorius({
        tableClass: 'table table-bordered'
      })
      expect(container).toContain("div[data-month=2012-05-01] table.table.table-bordered")

    it "should allow adding classes to the months", ->
      container.kalendorius({
        monthClass: 'month'
      })
      expect(container).toContain("div[data-month=2012-05-01].month")

    it "should allow starting from a custom month", ->
      container.kalendorius({
        date: new Date(2012, 8, 23) # 23rd September 2012
      })
      expect(container).toContain("div[data-month=2012-09-01]")

    it "should allow custom days names to be passed in", ->
      days = [
        'pirmadienis',
        'antradienis',
        'trečiadienis',
        'ketvirtadienis',
        'penktadienis',
        'šeštadienis',
        'sekmadienis'
      ]
      container.kalendorius({
        days: days
      })
      expect(
          $(header).text() for header in container.find("th")
        ).toEqual days

  describe "moving between months", ->
    beforeEach ->
      container.kalendorius()

    it "should move to the next month", ->
      expect(container).toContain("div[data-month=2012-05-01]")
      container.kalendorius('next')
      expect(container).toContain("div[data-month=2012-06-01]")
      expect(container.find('div[data-month=2012-06-01] div.month-header').text()).toEqual('June')

    it "should fire the kalendorius:change event when moving to the next month", ->
      spyOnEvent(container, 'kalendorius:change')
      container.kalendorius('next')
      expect('kalendorius:change').toHaveBeenTriggeredOn(container)

    it "should move to the previous month", ->
      expect(container).toContain("div[data-month=2012-05-01]")
      container.kalendorius('prev')
      expect(container).toContain("div[data-month=2012-04-01]")
      expect(container.find('div[data-month=2012-04-01] div.month-header').text()).toEqual('April')

    it "should fire the kalendorius:change event when moving to the next month", ->
      spyOnEvent(container, 'kalendorius:change')
      container.kalendorius('prev')
      expect('kalendorius:change').toHaveBeenTriggeredOn(container)

    it "should move to today", ->
      expect(container).toContain("div[data-month=2012-05-01]")

      Timecop.freeze new Date(2012, 6, 1, 10, 48) # 1st July 2012
      container.kalendorius('today')
      expect(container).toContain("div[data-month=2012-07-01]")
      expect(container.find('div[data-month=2012-07-01] div.month-header').text()).toEqual('July')

    it "should fire the kalendorius:change event when moving to the next month", ->
      spyOnEvent(container, 'kalendorius:change')
      container.kalendorius('today')
      expect('kalendorius:change').toHaveBeenTriggeredOn(container)

    it "should maintain selected dates when moving between months", ->
      date = container.find('td[data-date=2012-05-11]')
      date.click()
      date.click()
      expect(container).toContain("td[data-date=2012-05-11].date-selected")

      container.kalendorius('next')
      expect(container).not.toContain("td[data-date=2012-05-11].date-selected")

      container.kalendorius('prev')
      expect(container).toContain("td[data-date=2012-05-11].date-selected")

    it "should allow dates to be selected after moving between months", ->
      container.kalendorius('next')
      expect(container).not.toContain("td[data-date=2012-05-11]")

      container.kalendorius('prev')
      expect(container).toContain("td[data-date=2012-05-11]")

      date = container.find('td[data-date=2012-05-11]')
      date.click()
      date.click()
      expect(container).toContain("td[data-date=2012-05-11].date-selected")

  describe "multiple instances", ->
    container2 = undefined

    beforeEach ->
      container2 = $("<div>")
      container.kalendorius()
      container2.kalendorius()

    it "should allow them to be changed between independently", ->
      expect(container).toContain("div[data-month=2012-05-01]")
      expect(container2).toContain("div[data-month=2012-05-01]")
      container.kalendorius('next')
      expect(container).toContain("div[data-month=2012-06-01]")
      expect(container2).toContain("div[data-month=2012-05-01]")

    it "should maintain a seperate state of selected dates", ->
      date = container.find('td[data-date=2012-05-11]')
      date.click()
      date.click()
      expect(container).toContain("td[data-date=2012-05-11].date-selected")
      expect(container2).not.toContain("td[data-date=2012-05-11].date-selected")

  describe "#getSelected", ->
    beforeEach ->
      instance = container.kalendorius()

    it "should return an empty list when nothing is selected", ->
      expect(instance.getSelected()).toEqual([])

    it "should return a one element list when one date is selected", ->
      startDate = container.find('td[data-date=2012-05-11]')
      startDate.click()
      startDate.click()

      expect(instance.getSelected()).toEqual(['2012-05-11'])

    it "should return multi elements list when a range is selected", ->
      startDate = container.find('td[data-date=2012-05-11]')
      startDate.click()

      endDate = container.find('td[data-date=2012-05-13]')
      endDate.mouseover()
      endDate.click()

      expect(instance.getSelected()).toEqual(['2012-05-11', '2012-05-12', '2012-05-13'])

    it "should return all selected dates in ascending order", ->
      # select a range
      startDate = container.find('td[data-date=2012-05-11]')
      startDate.click()

      endDate = container.find('td[data-date=2012-05-13]')
      endDate.mouseover()
      endDate.click()

      # select some other dates
      date1 = container.find('td[data-date=2012-05-20]')
      date1.click()
      date1.click()

      date2 = container.find('td[data-date=2012-05-02]')
      date2.click()
      date2.click()

      expect(instance.getSelected()).toEqual(['2012-05-02', '2012-05-11', '2012-05-12', '2012-05-13', '2012-05-20'])
