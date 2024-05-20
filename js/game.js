'use strict'

const WALL = '#'
const FOOD = '.'
const EMPTY = ' '
const CHERRY = '🍒'
const SUPER_FOOD = '💫'

const gGame = {
  score: 0,
  isOn: false,
}
var gBoard
var gfoodBoardCounter
var gIsPacManSuper
const ADD_CHERRY_TIME = 5000

function onInit() {
  gBoard = buildBoard()
  createPacman(gBoard)
  createGhosts(gBoard)

  document.querySelector('.modal').style.display = 'none'
  renderBoard(gBoard)
  gGame.isOn = true
}

function buildBoard() {
  const size = 10
  const board = []
  gfoodBoardCounter = 0

  for (var i = 0; i < size; i++) {
    board.push([])

    for (var j = 0; j < size; j++) {
      board[i][j] = FOOD
      gfoodBoardCounter++
      if (
        i === 0 ||
        i === size - 1 ||
        j === 0 ||
        j === size - 1 ||
        (j === 3 && i > 4 && i < size - 2)
      ) {
        board[i][j] = WALL
        gfoodBoardCounter--
      }
      if (
        (i === 1 && j === 1) ||
        (i === 1 && j === size - 1 - 1) ||
        (i === size - 1 - 1 && j === size - 1 - 1) ||
        (i === size - 1 - 1 && j === 1)
      ) {
        board[i][j] = SUPER_FOOD
        gfoodBoardCounter--
      }
    }
  }
  setInterval(addCherry, ADD_CHERRY_TIME)
  console.log('board:', board)
  return board
}

function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      const cell = board[i][j]
      const className = `cell cell-${i}-${j}`

      strHTML += `<td class="${className}">${cell}</td>`
    }
    strHTML += '</tr>'
  }
  const elContainer = document.querySelector('.board')
  elContainer.innerHTML = strHTML
}

// location is an object like this - { i: 2, j: 7 } , ''
function renderCell(location, value) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.innerHTML = value
}

function updateScore(diff) {
  // update model and dom
  gGame.score += diff
  document.querySelector('h2 span').innerText = gGame.score
}

function gameOver(isVictory) {
  console.log('Game Over')
  gGame.isOn = false
  clearInterval(gIntervalGhosts)
  renderCell(gPacman.location, EMPTY)
  gameOverMSG(isVictory)
}

function gameOverMSG(isVictory) {
  var elModal = document.querySelector('.modal')
  var elModalMsg = elModal.querySelector('.modal-msg')
  if (isVictory) {
    elModalMsg.innerText = 'you lucky son of a gun'
  } else {
    elModalMsg.innerText = 'you suck'
  }
  elModal.style.display = 'block'
}

function addCherry() {
  var emptyLoc = getEmptyLocation(gBoard)
  if (!emptyLoc) return
  var cell = gBoard[emptyLoc.i][emptyLoc.j]
  console.log('empt :', emptyLoc)
  if (cell === FOOD) gfoodBoardCounter--
  cell = CHERRY
  renderCell(emptyLoc, CHERRY)
}

function playSound() {
  const sound = new Audio('sound/super-sound.mp3')
  sound.volume = 0.4
  sound.play()
}
