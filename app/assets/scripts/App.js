import $ from "jquery";
import { deflateRaw } from "zlib";

let highScore = 2,
  players = [],
  curPlayer;

//how many players
createPlayersArray(2);

init();

//EVENT LISTENERS

//set listener for when player clicks on grid
$("td").each(function() {
  $(this).on("click", e => handleBtnClick(e));
});

//change highscore
$("input#highscore").on("change", function(e) {
  highScore = e.target.valueAsNumber;
  curPlayer = players[0].player;
  startOver();
});

//restart button
$("#restart").click(function() {
  curPlayer = players[0].player;

  $(`.player-${curPlayer}-hero`).removeClass("hero--show");
  startOver();
  eliminateScores();
  handleFeedbackText();
});

function init() {
  //set the highscore
  $("input#highscore").val(highScore);

  //eliminate the scores of both players
  eliminateScores();

  //we start with player 1
  curPlayer = players[0].player;
  //handle feedback
  handleFeedbackText();
  //hover effect of grid
  gridHover();
}
function eliminateScores() {
  for (let i = 0; i < players.length; i++) {
    players[i].score = 0;
    $(`#player-${players[i].player}-score`).html("0");
    players[i].winner = false;
  }
}

function handleBtnClick(e) {
  //remove event listener
  $(e.target)
    .parent("td")
    .off("click");

  //set clicked button's layout
  handleClickedBtnLayout(e.target);

  //check if we have round winner
  if (checkRoundWinner()) {
    startOver();
    $(e.target).toggleClass(`player-${curPlayer}--hover`);
    updateScore(curPlayer);
  } else {
    togglePlayer();
  }
  //check for draw
  if (checkForDraw()) {
    curPlayer = players[0].player;
    startOver();
  }

  console.log(players);
}
function checkForDraw() {
  return (
    $(".grid-btn").length == $(".grid-btn:disabled").length &&
    checkRoundWinner() == false
  );
}

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

function checkRoundWinner() {
  return (
    checkRowIfWon() || checkColIfWon() || checkDiag1IfWon() || checkDiag2IfWon()
  );
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
  players[player - 1].score++;
  $(`#player-${player}-score`).html(`${players[player - 1].score}`);
  if (players[player - 1].score === highScore) {
    players[player - 1].winner = true;
    finalWinner();
  } else {
    return;
  }
}

function handleClickedBtnLayout(btn) {
  //add class to the cell in order to recognize it when we check for the winner
  $(btn)
    .parent("td")
    .addClass(`${curPlayer}`);
  $(btn).prop("disabled", true);
  $(btn).addClass(`player-${curPlayer}--clicked`);
  $(btn).prepend(`<img class="player-${curPlayer}-saber"
  src="./assets/images/${curPlayer}-lightsaber.png"
  alt="Player ${curPlayer} Lightsaber"
    />`);
  $(btn).removeClass(`player-${curPlayer}--hover`);
}
function startOver() {
  handleFeedbackText();
  console.log(players);
  for (let i = 0; i < players.length; i++) {
    $(`.player-${players[i].player}-hero`).removeClass("hero--show");
    $(".grid-btn").each(function() {
      //re-attach event listener for click
      if ($(this).prop("disabled")) {
        $(this)
          .parent()
          .on("click", e => handleBtnClick(e));
      }
      $(this).removeClass(`player-${players[i].player}--clicked`);
      $(this).removeClass(`player-${curPlayer}--hover`);
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
function finalWinner() {
  //1. all grid buttons have the winner's --clicked class
  $(".grid-btn").each(function() {
    handleClickedBtnLayout($(this));
    // remove event listeners
    $(this)
      .parent("td")
      .off("click");
  });
  //2. show the winner's hero
  $(`.player-${curPlayer}-hero`).addClass("hero--show");
  //3. write who wins
  handleFeedbackText();
}

function handleFeedbackText() {
  let html = `<i class="ion-md-arrow-dropright"></i>&nbsp;Click on a cell to begin...`;

  //remove the initial text when someone clicks
  $(".grid-btn").each(function() {
    if (this.className.indexOf("clicked") > -1) {
      html = "";
    }
  });
  //if we have round winner
  if (checkRoundWinner()) {
    html =
      curPlayer === 1
        ? `<i class="ion-md-arrow-dropright"></i>&nbsp;One point for the Light Side!`
        : `<i class="ion-md-arrow-dropright"></i>&nbsp;One point for the Dark Side!`;
  } else if (checkForDraw()) {
    html = `<i class="ion-md-arrow-dropright"></i>&nbsp;It's a Draw!`;
  }
  //if we have final winner
  if (players[0].winner) {
    html = `<i class="ion-md-arrow-dropright"></i>&nbsp;<b>THE LIGHT SIDE WINS!</b>`;
  }
  if (players[1].winner) {
    html = `<i class="ion-md-arrow-dropright"></i>&nbsp;<b>THE DARK SIDE WINS!</b>`;
  }

  return $("#feedback-text").html(html);
}

function gridHover() {
  $(".grid-btn").each(function() {
    $(this).hover(function() {
      if ($(this).hasClass(`player-${curPlayer}--hover`)) {
        $(this).removeClass(`player-${curPlayer}--hover`);
      } else {
        $(this).addClass(`player-${curPlayer}--hover`);
      }
    });
  });
}
