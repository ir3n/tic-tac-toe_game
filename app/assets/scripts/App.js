import $ from "jquery";
import { equal } from "assert";

let highScoreInput = $("input#highscore");

let players = [];
let highScore = highScoreInput.val(5);
let curPlayer;
let play = true;

createPlayersArray(2);

function createPlayersArray(numOfPlayers) {
  for (let i = 0; i < numOfPlayers; i++) {
    players.push({
      player: i + 1,
      score: 0,
      winner: false
    });
  }
  return players;
}

curPlayer = players[0].player;

//change highscore
highScoreInput.on("change", function(e) {
  highScore = e.target.valueAsNumber;
});

//hover effect of grid
$(".grid-btn").each(function() {
  $(this).hover(function() {
    $(this).toggleClass(`player-${curPlayer}--hover`);
  });
});

//EVENT LISTENERS
$("td").each(function() {
  $(this).click(e => handleBtnClick(e));
});

function handleBtnClick(e) {
  //set clicked button's layout
  handleClickedBtnLayout(e.target);

  //check if we have round winner
  if (
    checkRowIfWon(curPlayer) ||
    checkColIfWon(curPlayer) ||
    checkDiag1IfWon(curPlayer) ||
    checkDiag2IfWon(curPlayer)
  ) {
    updateScore(curPlayer);
  }
  togglePlayer();
  console.log(players);
}

//1. check if current player has 3 cells in a row
function checkRowIfWon(player) {
  let curPlayerWon = false;
  $("tr").each(function() {
    //find cells with same class
    let cells = [...$(this).find(`td[class="${player}"]`)];
    if (cells.length === 3) {
      curPlayerWon = true;
    }
  });
  return curPlayerWon;
}
//2. check if current player has 3 cells with same index
function checkColIfWon(player) {
  let curPlayerWon = false;
  for (let i = 0; i < 3; i++) {
    let cells = [
      //we make an array with te cells that have the class of the player and the same order in the row
      ...$("tr").find(`td[class="${player}"]:nth-of-type(${i + 1})`)
    ];
    if (cells.length === 3) {
      curPlayerWon = true;
    }
  }
  return curPlayerWon;
}
//3. check diagonal \
function checkDiag1IfWon(player) {
  let curPlayerWon = false;
  let cells = [];
  $("tr").each(function(i) {
    //we make an array with the tds that have the same index with the row and the class of the player
    cells.push(...$(this).find(`td:eq('${i}')[class="${player}"]`));
    if (cells.length === 3) {
      curPlayerWon = true;
    }
  });
  return curPlayerWon;
}
//4. check diagonal /
function checkDiag2IfWon(player) {
  let curPlayerWon = false;
  let cells = [];
  //we start from the last row and look for the tds whose index follows the type 3-rowIndex-1
  for (let i = 2; i >= 0; i--) {
    cells.push(
      ...$(`tr:eq('${i}')`).find(`td:eq('${3 - i - 1}')[class="${player}"]`)
    );
    if (cells.length === 3) {
      curPlayerWon = true;
    }
  }
  return curPlayerWon;
}

function updateScore(player) {
  players[curPlayer - 1].score++;
  $(`#player-${player}-score`).html(`${players[player - 1].score}`);
}

function handleClickedBtnLayout(btn) {
  $(btn).addClass(`player-${curPlayer}--clicked`);
  //add class to the cell in order to recognize it when we check for the winner
  btn.parentElement.classList.add(`${curPlayer}`);
  $(btn).prop("disabled", true);
  $(btn).prepend(`<img class="player-${curPlayer}-saber"
  src="./assets/images/${curPlayer}-lightsaber.png"
  alt="Player ${curPlayer} Lightsaber"
    />`);
  $(btn).removeClass(`player-${curPlayer}--hover`);
}

function togglePlayer() {
  curPlayer =
    curPlayer === players[0].player ? players[1].player : players[0].player;
}
