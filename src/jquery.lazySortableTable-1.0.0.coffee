###*
Lazy Sortable Table

Frontend sorting of tables
###
(($, window, document) ->
  
  # Set some defaults
  
  # Set the name of the plugin
  
  ###*
  Constructor
  ###
  LazySortableTable = (element, options) ->
    
    # Set the current DOM node being acted upon
    @element = element
    
    # Set the current jQuery object being acted upon
    @$element = $(element)
    
    # Set the current DOM node tag name being acted upon (e.g. "select" or "a")
    if @$element.prop("tagName") and typeof (@$element.prop("tagName")) is "string"
      @htmlTag = @$element.prop("tagName").toLowerCase()
    else
      @htmlTag = ""
    
    # Determind if the selector is a <table>
    @isTable = (@htmlTag is "table")
    
    # Determine if the <table> has an explcit <thead> child
    @hasTableHead = (@$element.children("thead").length is 1)
    
    # Determine if the <table> has an explicit <tbody> child
    @hasTableBody = (@$element.children("tbody").length is 1)
    
    # Set the initial sort direction
    @sortDirection = "asc"
    
    # Set allowed events
    @allowedEvents = [
      "keydown"
      "keypress"
      "keyup"
      "mousedown"
      "mouseenter"
      "mouseleave"
      "mousemove"
      "mouseout"
      "mouseover"
      "mouseup"
      "hover"
      "click"
      "dblclick"
      "focus"
      "blur"
      "focusin"
      "focusout"
      "change"
      "select"
    ]
    
    # Merge the options into the defaults
    @options = $.extend(true, {}, defaults, options)
    
    # Set a reference to the original, un-merged defaults
    @_defaults = defaults
    
    # Set a reference to the name of the plugin
    @_name = pluginName
    
    # Away we go!
    @init()
    return
  defaults =
    firstRowAsHeader: false
    onBeforeSort: false
    onAfterSort: false
    onBeforePopulate: false
    onAfterPopulate: false
    data: false
    event: "click"

  pluginName = "lazySortableTable"
  
  ###*
  Public methods
  ###
  LazySortableTable::init = ->
    self = this
    @getData = ->
      if @options.data and typeof (@options.data) is "object"
        @data = @options.data
      else
        @data = []
        @$tableRows = @$element.find("tr")
        r = 0

        while r < @$tableRows.length
          $tableRow = @$tableRows.eq(r)
          $tableRowCells = $tableRow.find("td, th")
          cells = []
          c = 0

          while c < $tableRowCells.length
            $tableRowCell = $tableRowCells.eq(c)
            cells.push $tableRowCell.text().replace(/^\s+|\s+$|\r|\n|\t/g, "")
            c++
          @data.push cells
          r++
        @data.shift()  if @options.firstRowAsHeader or @hasTableHead
      return

    @getTableHeader = ->
      @$headerRow = @$element.find("tr:first")
      @$headerCells = @$headerRow.find("td, th")
      @$headerLinks = @$headerCells.find("a")
      return

    @sort = (columnIndex) ->
      @onBeforeSort()
      @data.sort (a, b) ->
        return 0  if a[columnIndex] is b[columnIndex]
        (if a[columnIndex] < b[columnIndex] then -1 else 1)

      if @sortDirection is "desc"
        @data.reverse()
        @sortDirection = "asc"
      else
        @sortDirection = "desc"
      @onAfterSort()
      @populateTable()
      return

    @populateTable = ->
      @onBeforePopulate()
      r = 0

      while r < @data.length
        c = 0

        while c < @data[r].length
          if @options.firstRowAsHeader or @hasTableHead
            @$tableRows.not(":first").eq(r).children("td").eq(c).text @data[r][c]
          else
            @$tableRows.eq(r).children("td").eq(c).text @data[r][c]
          c++
        r++
      @onAfterPopulate()
      return

    @onBeforeSort = ->
      @options.onBeforeSort @data  if @options.onBeforeSort and typeof (@options.onBeforeSort) is "function"
      return

    @onAfterSort = ->
      @options.onAfterSort @data  if @options.onAfterSort and typeof (@options.onAfterSort) is "function"
      return

    @onBeforePopulate = ->
      @options.onBeforePopulate @data  if @options.onBeforePopulate and typeof (@options.onBeforePopulate) is "function"
      return

    @onAfterPopulate = ->
      @options.onAfterPopulate @data  if @options.onAfterPopulate and typeof (@options.onAfterPopulate) is "function"
      return

    @checkValidBindEvents = ->
      if $.isArray(@options.event)
        validEvents = []
        for e of @options.event
          validEvents.push e  if $.inArray(e, self.allowedEvents) > -1
        @options.event = validEvents.join(" ")
        @bindEvents()
      else @bindEvents()  if $.inArray(@options.event, @allowedEvents) > -1
      return

    @bindEvents = ->
      if @$headerLinks.length is 0
        @$headerCells.on @options.event, (event) ->
          self.sort $(this).index()
          return

      else
        @$headerLinks.on @options.event, (event) ->
          self.sort()
          return

      return

    @exec = ->
      if @isTable
        @getTableHeader()
        @getData()
        @checkValidBindEvents()
      return

    @exec()
    return

  
  #
  #   * Plugin wrapper
  #   
  $.fn[pluginName] = (options) ->
    
    # For every matched selector found...
    @each ->
      
      # Set some jQuery data if it doesn't already exist
      $.data this, "plugin_" + pluginName, new LazySortableTable(this, options)  unless $.data(this, "plugin_" + pluginName)
      return


  return
) jQuery, window, document
