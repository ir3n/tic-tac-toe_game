import $ from "jquery";

let highScoreInput = $("input#highscore");

let players = [];
let highScore = highScoreInput.val(5);
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

//we start with player 1
let curPlayer = players[0].player;

//hover effect of grid
$(".grid-btn").each(function() {
  $(this).hover(function() {
    $(this).toggleClass(`player-${curPlayer}--hover`);
  });
});

//EVENT LISTENERS

//change highscore
highScoreInput.on("change", function(e) {
  highScore = e.target.valueAsNumber;
});

//player clicks on grid
$("td").each(function() {
  $(this).click(e => handleBtnClick(e));
});

function handleBtnClick(e) {
  //set clicked button's layout
  handleClickedBtnLayout(e.target);

  //check if we have round winner
  if (
    checkRowIfWon() ||
    checkColIfWon() ||
    checkDiag1IfWon() ||
    checkDiag2IfWon()
  ) {
    startOver();
    $(e.target).toggleClass(`player-${curPlayer}--hover`);
    updateScore(curPlayer);
  } else {
    togglePlayer();
  }

  console.log(players);
}

//1. check if current player has 3 cells in a row
function checkRowIfWon() {
  let curPlayerWon = false;
  $("tr").each(function() {
    //find cells with same class
    let cells = [...$(this).find(`td[class="${curPlayer}"]`)];
    if (cells.length === 3) {
      curPlayerWon = true;
    }
  });
  return curPlayerWon;
}
//2. check if current player has 3 cells with same index
function checkColIfWon() {
  let curPlayerWon = false;
  for (let i = 0; i < 3; i++) {
    let cells = [
      //we make an array with te cells that have the class of the player and the same order in the row
      ...$("tr").find(`td[class="${curPlayer}"]:nth-of-type(${i + 1})`)
    ];
    if (cells.length === 3) {
      curPlayerWon = true;
    }
  }
  return curPlayerWon;
}
//3. check diagonal \
function checkDiag1IfWon() {
  let curPlayerWon = false;
  let cells = [];
  $("tr").each(function(i) {
    //we make an array with the tds that have the same index with the row and the class of the player
    cells.push(...$(this).find(`td:eq('${i}')[class="${curPlayer}"]`));
    if (cells.length === 3) {
      curPlayerWon = true;
    }
  });
  return curPlayerWon;
}
//4. check diagonal /
function checkDiag2IfWon() {
  let curPlayerWon = false;
  let cells = [];
  //we start from the last row and look for the tds whose index follows the type 3-rowIndex-1
  for (let i = 2; i >= 0; i--) {
    cells.push(
      ...$(`tr:eq('${i}')`).find(`td:eq('${3 - i - 1}')[class="${curPlayer}"]`)
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
  //add class to the cell in order to recognize it when we check for the winner
  $(btn)
    .parent("td")
    .addClass(`${curPlayer}`);

  $(btn).addClass(`player-${curPlayer}--clicked`);
  $(btn).prop("disabled", true);
  $(btn).prepend(`<img class="player-${curPlayer}-saber"
  src="./assets/images/${curPlayer}-lightsaber.png"
  alt="Player ${curPlayer} Lightsaber"
    />`);
  $(btn).removeClass(`player-${curPlayer}--hover`);
}
function startOver() {
  for (let i = 0; i < players.length; i++) {
    $(".grid-btn").each(function() {
      $(this).removeClass(`player-${players[i].player}--clicked`);
      if ($(this).hasClass(`player-${curPlayer}--hover`)) {
        $(this).removeClass(`player-${curPlayer}--hover`);
      }

      $(this).prop("disabled", false);
      $(this).html("");
      $(this)
        .parent("td")
        .removeClass(`${players[i].player}`);
    });
  }
}

function togglePlayer() {
  curPlayer =
    curPlayer === players[0].player ? players[1].player : players[0].player;
}
