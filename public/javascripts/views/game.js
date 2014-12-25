namespace('Mastermind.Views')

Mastermind.Views.Game = function(options) {
  this.el         = options.el
  this.$el        = $(this.el)
  this.rowCount   = options.rowCount || 8
  this.width      = options.width    || 4
  this.solution   = options.solution || []
  this.rows       = []
  this.clues      = []
  this.colors     = options.colors
  this.gameOver   = false
  this.currentRow = 0

  this.initialize = function() {
    this.rows = []
    for (var i = 0; i < this.rowCount; ++i) {
      var row = new Mastermind.Models.Row({width: this.width})
      this.rows.push(row)
      this.clues.push('')
    }
    this.populateSolution()
    this.initialGuess()
    this.setListeners()
  },

  this.setListeners = function() {
    this.$el.on('click', 'li', function(e) {
      this.changeColor(e.target)
    }.bind(this))

    $('#mastermind').on('click', '.button', function() {
      this.submitGuess()
    }.bind(this))
  },

  this.populateSolution = function() {
    this.solution = []
    _.times(this.width, function() {
      this.solution.push(_.sample(this.colors))
    }.bind(this))
  },

  this.initialGuess = function() {
    var row    = this.rows[this.currentRow]
      , colors = _.sample(this.colors, this.width)

    row.populate(colors)
  },

  this.changeColor = function(node) {
    var clickedRow = this.rowCount - this.$el.find('ul').index($(node).parent())
    if (clickedRow === this.currentRow) {
      var currentColor = $(node).attr('class')
        , nextColor    = this.nextColor(currentColor)
      $(node).removeClass(currentColor)
      $(node).addClass(nextColor)
      var newColors    = _.map($(node).parent().find('li'), function(sibling) {
        return $(sibling).attr('class')
      })
      this.rows[this.currentRow].cells = newColors
    }
  },

  this.nextColor = function(color) {
    var currentIndex = _.indexOf(this.colors, color)
    if (currentIndex < this.colors.length - 1) {
      return this.colors[currentIndex + 1]
    } else {
      return this.colors[0]
    }
  },

  this.submitGuess = function() {
    if (this.gameOver) {
      window.location.href = '/'
    } else if (this.correctGuess()) {
      this.win()
    } else if (this.currentRow === this.rowCount - 1) {
      this.lose()
    } else {
      this.guess()
    }
  },

  this.correctGuess = function() {
    var guess = this.rows[this.currentRow]
    return guess.equals(this.solution)
  },

  this.win = function() {
    this.gameOver = true
    $('.button h2').html('YOU WIN')
    this.revealSolution()
  },

  this.lose = function() {
    this.gameOver = true
    $('.button h2').html('TRY AGAIN')
    this.revealSolution()
  },

  this.revealSolution = function() {
    var solutionCells = this.$el.find('.solution li')

    for (var i = 0; i < this.solution.length; ++i) {
      $(solutionCells[i]).addClass(this.solution[i])
      $(solutionCells[i]).html('')
    }
  },

  this.guess = function() {
    var thisRow = this.rows[this.currentRow]
      , nextRow = this.rows[this.currentRow + 1]
    nextRow.populate(thisRow.cells)
    this.giveClues()
    this.currentRow += 1
    this.render()
  },

  this.giveClues = function(attrs) {
    var clues      = ''
      , solution   = _.clone(this.solution)
      , currentRow = _.clone(this.rows[this.currentRow].cells)

    for (var i = 0; i < solution.length; ++i) {
      if (currentRow[i] === solution[i]) {
        clues += '!'
        solution.splice(i, 1)
        currentRow.splice(i, 1)
      }
    }
    for (var i = 0; i < solution.length; ++i) {
      if (_.find(solution, function(color) { return currentRow[i] === color})) {
        clues += '?'
        solution.splice(_.indexOf(currentRow[i]), 1)
        currentRow.splice(i, 1)
      }
    }
    this.clues[this.currentRow] = clues
  },

  this.template = function(rows, clues) {
    var row = null
    var template = '<ul class="solution">'
    for (cells of this.solution) {
      template += '<li><h4>?</h4></li>'
    }
    template += '</ul><hr/>'
    for (var i = 0; i < rows.length; ++i) {
      var row = rows[(rows.length - 1) - i]
      template += '<ul>'
      for (cell of row.cells) {
        template += '<li class="' + cell + '"></li>'
      }
      template += '</ul>'
      template += '<div class="clues"><h4>' + clues[(rows.length - 1) - i] + '</h4></div>'
    }
    return template
  },

  this.render = function() {
    this.$el.html(this.template(this.rows, this.clues))
    return this
  }
}
