$(document).ready(function() {
  var player,
    computer,
    X = '<i class="fa fa-times" aria-hidden="true"></i>',
    O = '<i class="fa fa-circle-o" aria-hidden="true"></i>',
    playerScore = 0,
    computerScore = 0,
    playerTurn = true,
    win = false,
    hard,
    id,
    alert,
    cornerCombos = [[0, 8], [2, 6]],
    board = [0, 1, 2, 3, 4, 5, 6, 7, 8],
    wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

  // Initialize Game
  setup();

  // Button Events
  $("#scoreBtn").click(function() {
    $(".board").fadeOut();
    showScore();
  });

  $("#resetBtn").click(function() {
    setup();
  });

  $("#easy").click(function() {
    hardOrEasy(false);
  });

  $("#hard").click(function() {
    hardOrEasy(true);
  });

  $("#X").click(function() {
    xoro(X, O);
  });

  $("#O").click(function() {
    xoro(O, X);
  });

  $(".square").click(function() {
    id = $(this).attr("id");
    if (!isNaN(board[Number(id)]) && playerTurn && !win) {
      markData(player, false, id);
      checkWin();
      setTimeout(computerPick, 700);
    }
  });

  // Choose hard or easy
  function hardOrEasy(bool) {
    hard = bool;
    $(".level").fadeOut();
    $(".choose")
      .delay(500)
      .fadeIn();
  }

  // Player picks X or O
  function xoro(shape1, shape2) {
    player = shape1;
    computer = shape2;
    $(".choose").fadeOut();
    $(".board")
      .delay(1000)
      .fadeIn();
    triggerButtons("#scoreBtn", "#resetBtn", false);
  }

  // Mark X's and O's on board
  function markData(person, bool, id) {
    $("#" + id).append(person);
    playerTurn = bool;
    board[Number(id)] = person;
    checkCombos(id, wins, person);
    checkCombos(id, cornerCombos, person);
  }

  // Check if move resulted in a victory or tie
  function checkWin() {
    for (var i = 0; i < wins.length; i++) {
      if (wins[i].every((val, i, arr) => val === computer)) {
        computerScore++;
        alertWinner(computerScore, "Computer Wins!", "#cScore");
        return true;
      }
      if (wins[i].every((val, i, arr) => val === player)) {
        playerScore++;
        alertWinner(playerScore, "Player Wins!", "#pScore");
        return true;
      }
    }
    if (board.every(isNaN)) {
      alert = "Tie Game!";
      win = true;
      displayAlert();
      return true;
    }
  }

  // Screen shows who won game
  function alertWinner(score, winner, div) {
    win = true;
    alert = winner;
    updateScore(div, score);
  }

  // Update Scoreboard
  function updateScore(div, score) {
    $(div).empty();
    $(div).append(score);
    displayAlert();
  }

  // Computer AI
  function computerPick() {
    if (!playerTurn && !win) {
      var val = Math.round(Math.random() * 8);
      if (blockWin(computer, wins)) {
        return true;
      } else if (blockWin(player, wins)) {
        return true;
      }
      if (hard) {
        if (!isNaN(board[4])) {
          markData(computer, true, "4");
          setTimeout(checkWin, 500);
          return true;
        } else if (blockWin(player, cornerCombos)) {
          return true;
        } else if (checkCorners()) {
          return true;
        } else if (checkSides()) {
          return true;
        }
      } else if (board.indexOf(val) > -1) {
        markData(computer, true, val.toString());
        setTimeout(checkWin, 500);
        return true;
      } else if (board.indexOf(val) === -1) {
        computerPick();
      }
    }
  }

  // Computer checks if it can win or block
  function blockWin(opponent, arr) {
    for (var i = 0; i < arr.length; i++) {
      var newArr = arr[i].filter(function(a) {
        return a !== opponent;
      });
      if (newArr.length == 1 && !isNaN(newArr[0])) {
        markData(computer, true, newArr[0].toString());
        setTimeout(checkWin, 500);
        return true;
      } else if (newArr.length === 0) {
        for (var j = 1; j <= 7; j += 2) {
          if (board.indexOf(j) !== -1) {
            markData(computer, true, j.toString());
            return true;
          }
        }
      }
    }
  }

  // Computer blocks player's fork
  function checkCombos(id, arr, person) {
    for (var i = 0; i < arr.length; i++) {
      for (var j = 0; j < arr[i].length; j++) {
        if (arr[i][j] === Number(id)) {
          arr[i][j] = person;
        }
      }
    }
  }

  // Computer checks if corners are open
  function checkCorners() {
    for (var i = 0; i <= 8; i += 2) {
      if (board.indexOf(i) !== -1) {
        markData(computer, true, i.toString());
        return true;
      }
    }
  }

  function checkSides() {
    for (var i = 1; i <= 7; i += 2) {
      if (board.indexOf(i) !== -1) {
        markData(computer, true, i.toString());
        setTimeout(checkWin, 500);
        return true;
      }
    }
  }

  // Show scoreboard
  function showScore() {
    triggerButtons("#scoreBtn", "#resetBtn", true);
    $(".score")
      .delay(500)
      .fadeIn();
    $(".score")
      .delay(2000)
      .fadeOut();
    $(".board")
      .delay(3000)
      .fadeIn();
    setTimeout(computerPick, 800);
    setTimeout(function() {
      triggerButtons("#scoreBtn", "#resetBtn", false);
    }, 3500);
  }

  // Display who won game
  function displayAlert() {
    triggerButtons("#scoreBtn", "#resetBtn", true);
    $("#alert").empty();
    $("#alert").append(alert);
    $(".winner").fadeIn();
    $(".winner")
      .delay(2500)
      .fadeOut();
    $(".board")
      .delay(2000)
      .fadeOut(500);
    setTimeout(showScore, 3000);
    setTimeout(reset, 2000);
    return true;
  }

  // Disable/Enable buttons
  function triggerButtons(button1, button2, bol) {
    $(button1).prop("disabled", bol);
    $(button2).prop("disabled", bol);
  }

  // Resets variables
  function reset() {
    $(".square").empty();
    win = false;
    cornerCombos = [[0, 8], [2, 6]];
    board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
  }

  // Initializes game
  function setup() {
    reset();
    triggerButtons("#scoreBtn", "#resetBtn", true);
    $(".board").css("display", "none");
    $(".l-splash")
      .delay(300)
      .fadeIn();
    $(".l-splash")
      .delay(1500)
      .fadeOut();
    $(".splash")
      .delay(2800)
      .fadeIn();
    $(".splash")
      .delay(2000)
      .fadeOut();
    $(".level")
      .delay(5600)
      .fadeIn();
    playerScore = 0;
    computerScore = 0;
    $("#pScore").empty();
    $("#cScore").empty();
    $("#pScore").append(0);
    $("#cScore").append(0);
  }
});