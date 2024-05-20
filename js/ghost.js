'use strict'

const GHOST = '👻'
var gGhosts
var gIntervalGhosts
var gDeadGhosts = []
function createGhost(board) {
  var ghost = {
    location: getEmptyLocation(gBoard, true),
    currCellContent: FOOD,
    color: getRandomColor(),
  }
  gGhosts.push(ghost)
  board[ghost.location.i][ghost.location.j] = GHOST
}

function getEmptyLocation(board, isFoodIncluded) {
  // const emptyLocations = [{i:1,j:1},{i:1,j:2}];
  const emptyLocations = []

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      const currCell = board[i][j]
      if (currCell === EMPTY || (isFoodIncluded && currCell === FOOD)) {
        emptyLocations.push({ i, j })
      }
    }
  }

  if (!emptyLocations.length) return null

  const randomIdx = getRandomInt(0, emptyLocations.length)
  return emptyLocations[randomIdx]
}

function createGhosts(board) {
  // 3 ghosts and an interval
  gGhosts = []

  for (var i = 0; i < 3; i++) {
    createGhost(board)
  }

  gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
  // loop through ghosts
  for (var i = 0; i < gGhosts.length; i++) {
    var ghost = gGhosts[i]
    moveGhost(ghost)
  }
}

function moveGhost(ghost) {
  // console.log('ghost:', ghost)
  // figure out moveDiff, nextLocation, nextCell

  var moveDiff = getMoveDiff()
  // console.log('moveDiff:', moveDiff)

  var nextLocation = {
    i: ghost.location.i + moveDiff.i,
    j: ghost.location.j + moveDiff.j,
  }
  // console.log('nextLocation:', nextLocation) //{i,j}

  var nextCell = gBoard[nextLocation.i][nextLocation.j] //'.'
  // console.log('nextCell:', nextCell)

  // return if cannot move
  if (nextCell === WALL || nextCell === GHOST) return

  // hitting a pacman? call gameOver

  if (nextCell === PACMAN) {
    if (gIsPacManSuper) {
      //   eatingGhost(ghost.location)
      return
    } else {
      gameOver()
    }
  }

  // moving from current location:
  // update the model (restore prev cell contents)
  gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent

  // update the DOM
  renderCell(ghost.location, ghost.currCellContent)

  // Move the ghost to new location:
  // update the model (save cell contents)
  ghost.location = nextLocation
  ghost.currCellContent = nextCell

  gBoard[ghost.location.i][ghost.location.j] = GHOST
  // update the DOM
  renderCell(ghost.location, getGhostHTML(ghost))
}

function getMoveDiff() {
  const randNum = getRandomIntInclusive(1, 4)

  switch (randNum) {
    case 1:
      return { i: 0, j: 1 }
    case 2:
      return { i: 1, j: 0 }
    case 3:
      return { i: 0, j: -1 }
    case 4:
      return { i: -1, j: 0 }
  }
}

function getGhostIDXByPos(pos) {
  for (var i = 0; i < gGhosts.length; i++) {
    if (gGhosts[i].location.i === pos.i && gGhosts[i].location.i === pos.i) {
      return i
    }
  }
}

// function eatingGhost(loction) {
//     //update data

//     //update dom
//   var ghostIdx = getGhostIDXByPos(loction)
//   var curghost = gGhosts.splice(ghostIdx, 1)[0]
//   gDeadGhosts.pop(curghost)
//   console.log('curghost :', curghost)
//   if (curghost.currCellContent === FOOD) gfoodBoardCounter--
//   renderCell(loction, curghost.currCellContent)
// }

function changeGhostColor(blue) {
  for (var i = 0; i < gGhosts.length; i++) {
    if (blue) {
      gGhosts[i].color = '#0000FF	'
    } else {
      gGhosts[i].color = getRandomColor()
    }
    renderCell(gGhosts[i].location, getGhostHTML(gGhosts[i]))
  }
}

function getGhostHTML(ghost) {
  return `<span style='text-shadow:${ghost.color} 1px 1px, ${ghost.color} -1px 1px, ${ghost.color} 1px -1px, ${ghost.color} -1px -1px'>${GHOST}</span> ⁠`
}
