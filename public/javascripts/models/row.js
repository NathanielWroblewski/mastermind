namespace('Mastermind.Models')

Mastermind.Models.Row = function(options) {
  this.width    = options.width || 4
  this.cells    = []

  this.initialize = function() {
    this.cells = []
    _.times(options.width, function() {
      this.cells.push('')
    }.bind(this))
  },

  this.populate = function(colors) {
    this.cells = colors
  },

  this.setColor = function(options) {
    this.cells[options.at] = options.to
  },

  this.equals = function(row) {
    var all = true
    for (var i = 0; i < this.width; ++i) {
      if (this.cells[i] !== row[i]) all = false
    }
    return all
  }

  this.initialize()
}
