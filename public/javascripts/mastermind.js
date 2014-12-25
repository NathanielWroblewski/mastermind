$(document).ready(function() {
  var COLORS = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'black'
  ]

  var game = new Mastermind.Views.Game({
    el: '.board',
    colors: COLORS,
    rowCount: 8,
    width: 4
  })

  game.initialize()
  game.render()
})
