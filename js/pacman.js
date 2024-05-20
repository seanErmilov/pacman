'use strict'

const PACMAN = '😀'
var gPacman

function createPacman(board) {
  // initialize gPacman...
  gPacman = {
    location: {
      i: 6,
      j: 6,
    },
    isSuper: false,
  }
  gfoodBoardCounter-- //the food in start pos pcman
  board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function onMovePacman(ev) {
  if (!gGame.isOn) return

  // use getNextLocation(), nextCell
  var nextLocation = getNextLocation(ev)
  // console.log('nextLocation:', nextLocation)

  var nextCell = gBoard[nextLocation.i][nextLocation.j]
  // console.log('nextCell:', nextCell)

  //  return if cannot move
  if (nextCell === WALL) return
  //  hitting a ghost? call gameOver
  if (nextCell === GHOST) {
    if (gIsPacManSuper) {
      eatingGhost(nextLocation)
    } else {
      gameOver(false)
      return
    }
  }

  if (nextCell === FOOD) {
    updateScore(1)
    gfoodBoardCounter--
    if (gfoodBoardCounter === 0) gameOver(true)
    console.log('gfoodBoardCounter :', gfoodBoardCounter)
  } else if (nextCell === SUPER_FOOD) {
    if (gIsPacManSuper) return
    gIsPacManSuper = true
    changeGhostColor(true)
    setTimeout(() => {
      gIsPacManSuper = false
      makeDeadGhostsAlive()
      changeGhostColor(false)
    }, 5000)
  } else if (nextCell === CHERRY) {
    updateScore(10)
  }

  // moving from current location:
  // update the model
  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
  // update the DOM
  renderCell(gPacman.location, EMPTY)

  // Move the pacman to new location:
  // update the model
  gPacman.location = nextLocation
  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN
  // update the DOM
  renderCell(gPacman.location, PACMAN)
}

function eatingGhost(pos) {
  var ghostIdx = getGhostIDXByPos(pos)
  var curghost = gGhosts.splice(ghostIdx, 1)[0]
  gDeadGhosts.push(curghost)
  if (curghost.currCellContent === FOOD) gfoodBoardCounter--
  playSound()
}

function makeDeadGhostsAlive() {
  var len = gDeadGhosts.length
  for (var i = 0; i < len; i++) {
    var curGhost = gDeadGhosts.pop()
    curGhost.currCellContent = EMPTY
    gGhosts.push(curGhost)
  }
}

function getNextLocation(eventKeyboard) {
  // figure out nextLocation
  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j,
  }

  switch (eventKeyboard.code) {
    case 'ArrowUp':
      nextLocation.i--
      break
    case 'ArrowDown':
      nextLocation.i++
      break
    case 'ArrowLeft':
      nextLocation.j--
      break
    case 'ArrowRight':
      nextLocation.j++
      break
    default:
      return null
  }
  return nextLocation
}
