import $ from "jquery";

const cells = $("td");
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
      buttonsClicked: [],
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
cells.each(function() {
  $(this).click(e => handleBtnClick(e));
});

function handleBtnClick(e) {
  handleClickedBtnLayout(e.target);

  let x = e.currentTarget.cellIndex;
  let y = e.currentTarget.parentElement.rowIndex;

  //compare with existing
  let sameXCounter = 1;
  let sameYCounter = 1;
  let sameDCounter = 0;
  if (x === y || x === 3 - y - 1) {
    sameDCounter++;
  }

  let buttonsClickedArr = players[curPlayer - 1].buttonsClicked;
  for (let i = 0; i < buttonsClickedArr.length; i++) {
    if (x === y || x === 3 - y - 1) {
      sameDCounter++;
    }
    if (buttonsClickedArr[i].y === y) {
      sameYCounter++;
    }
    if (buttonsClickedArr[i].x === x) {
      sameXCounter++;
    }
    //save clicked buttons for each player

    //check if we have round winner
    checkWinner(sameXCounter, sameYCounter, sameDCounter, curPlayer);
    //start over
  }
  buttonsClickedArr.push({
    y: e.currentTarget.parentElement.rowIndex,
    x: e.currentTarget.cellIndex
  });

  togglePlayer();
  console.log(sameXCounter, sameYCounter, sameDCounter);
  console.log(players);
}

function checkWinner(x, y, d, player) {
  if (x === 3 || y === 3 || d === 3) {
    players[player - 1].score++;
    $(`#player-${player}-score`).html(`${players[player - 1].score}`);
  }
}

function handleClickedBtnLayout(btn) {
  $(btn).addClass(`player-${curPlayer}--clicked`);
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
