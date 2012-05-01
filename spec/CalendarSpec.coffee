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
