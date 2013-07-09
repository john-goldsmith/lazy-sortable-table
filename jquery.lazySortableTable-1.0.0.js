/**
 * Lazy Sortable Table
 *
 * Frontend sorting of tables
 *
 */

;(function ($, window, document) {

  var

    // Set some defaults
    defaults = {
      firstRowAsHeader : false,
      onBeforeSort : false,
      onAfterSort : false,
      onBeforePopulate : false,
      onAfterPopulate : false,
      data : false,
      event : 'click'
    },

    // Set the name of the plugin
    pluginName = 'lazySortableTable';

  /**
   * Constructor
   */

  function LazySortableTable (element, options) {

    // Set the current DOM node being acted upon
    this.element = element;

    // Set the current jQuery object being acted upon
    this.$element = $(element);

    // Set the current DOM node tag name being acted upon (e.g. "select" or "a")
    if ( this.$element.prop('tagName') && typeof( this.$element.prop('tagName') ) == 'string' ) {
      this.htmlTag = this.$element.prop('tagName').toLowerCase();
    } else {
      this.htmlTag = '';
    }

    // Determind if the selector is a <table>
    this.isTable = ( this.htmlTag == 'table' );

    // Determine if the <table> has an explcit <thead> child
    this.hasTableHead = ( this.$element.children('thead').length == 1 );

    // Determine if the <table> has an explicit <tbody> child
    this.hasTableBody = ( this.$element.children('tbody').length == 1 );

    // Set the initial sort direction
    this.sortDirection = 'asc';

    // Set allowed events
    this.allowedEvents = [
      'keydown', 'keypress', 'keyup',
      'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'hover', 'click', 'dblclick',
      'focus', 'blur', 'focusin', 'focusout', 'change', 'select'
    ];

    // Merge the options into the defaults
    this.options = $.extend( true, {}, defaults, options );

    // Set a reference to the original, un-merged defaults
    this._defaults = defaults;

    // Set a reference to the name of the plugin
    this._name = pluginName;

    // Away we go!
    this.init();

  };

  /**
   * Public methods
   */

  LazySortableTable.prototype.init = function () {
    var self = this;

    this.getData = function () {
      if ( this.options.data && typeof( this.options.data ) == 'object' ) {
        this.data = this.options.data;
      } else {
        this.data = [];
        this.$tableRows = this.$element.find('tr');
        for ( var r = 0; r < this.$tableRows.length; r++ ) {
          var $tableRow = this.$tableRows.eq( r ),
              $tableRowCells = $tableRow.find('td, th'),
              cells = [];
          for ( var c = 0; c < $tableRowCells.length; c++ ) {
            var $tableRowCell = $tableRowCells.eq( c );
            cells.push( $tableRowCell.text().replace(/^\s+|\s+$|\r|\n|\t/g, '') );
          };
          this.data.push( cells );
        };
        if ( this.options.firstRowAsHeader || this.hasTableHead ) {
          this.data.shift();
        };
      };
    };

    this.getTableHeader = function () {
      this.$headerRow = this.$element.find('tr:first');
      this.$headerCells = this.$headerRow.find('td, th');
      this.$headerLinks = this.$headerCells.find('a');
    };

    this.sort = function (columnIndex) {
      this.onBeforeSort();
      this.data.sort( function (a, b) {
        if ( a[ columnIndex ] == b[ columnIndex ] ) return 0;
        return a[ columnIndex ] < b[ columnIndex ] ? -1 : 1;
      });
      if ( this.sortDirection == 'desc') {
        this.data.reverse();
        this.sortDirection = 'asc'
      } else {
        this.sortDirection = 'desc';
      };
      this.onAfterSort();
      this.populateTable();
    };

    this.populateTable = function () {
      this.onBeforePopulate();
      for ( var r = 0; r < this.data.length; r++ ) {
        for ( var c = 0; c < this.data[ r ].length; c++ ) {
          if ( this.options.firstRowAsHeader || this.hasTableHead ) {
            this.$tableRows.not(':first').eq( r ).children('td').eq( c ).text( this.data[ r ][ c ] );
          } else {
            this.$tableRows.eq( r ).children('td').eq( c ).text( this.data[ r ][ c ] );
          };
        };
      };
      this.onAfterPopulate();
    };

    this.onBeforeSort = function () {
      if ( this.options.onBeforeSort && typeof( this.options.onBeforeSort ) == 'function' ) {
        this.options.onBeforeSort( this.data );
      };
    };

    this.onAfterSort = function () {
      if ( this.options.onAfterSort && typeof( this.options.onAfterSort ) == 'function' ) {
        this.options.onAfterSort( this.data );
      };
    };

    this.onBeforePopulate = function () {
      if ( this.options.onBeforePopulate && typeof( this.options.onBeforePopulate ) == 'function' ) {
        this.options.onBeforePopulate( this.data );
      };
    };

    this.onAfterPopulate = function () {
      if ( this.options.onAfterPopulate && typeof( this.options.onAfterPopulate ) == 'function' ) {
        this.options.onAfterPopulate( this.data );
      };
    };

    this.checkValidBindEvents = function () {
      if ( $.isArray( this.options.event ) ) {
        var validEvents = [];
        for ( var e in this.options.event ) {
          if ( $.inArray( e, self.allowedEvents ) > -1 ) {
            validEvents.push(e);
          };
        };
        this.options.event = validEvents.join(' ');
        this.bindEvents();
      } else if ( $.inArray( this.options.event, this.allowedEvents ) > -1 ) {
        this.bindEvents();
      };
    };

    this.bindEvents = function () {
      if ( this.$headerLinks.length == 0 ) {
        this.$headerCells.on( this.options.event, function (event) {
          self.sort( $(this).index() );
        });
      } else {
        this.$headerLinks.on( this.options.event, function (event) {
          self.sort();
        });
      };
    };

    this.exec = function () {
      if ( this.isTable ) {
        this.getTableHeader();
        this.getData();
        this.checkValidBindEvents();
      };
    };

    this.exec();

  };

  /*
   * Plugin wrapper
   */

$.fn[pluginName] = function (options) {

  // For every matched selector found...
  return this.each( function () {

    // Set some jQuery data if it doesn't already exist
    if ( !$.data( this, 'plugin_' + pluginName ) ) {
      $.data( this, 'plugin_' + pluginName, new LazySortableTable( this, options ) );
    };

  });

};

})(jQuery, window, document);
