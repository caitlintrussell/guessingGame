

function generateWinningNumber () {
  return Math.floor(Math.random() * 100) + 1;
}

function shuffle (arr) {
  let last = arr.length,
    i,
    temp;
  while (last) {
    i = Math.floor(Math.random() * last--);
    temp = arr[i];
    arr[i] = arr[last];
    arr[last] = temp;
  }
  return arr;
}

function Game () {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

function newGame () {
  return new Game();
}

Game.prototype.difference = function () {
  return Math.abs(this.winningNumber - this.playersGuess);
}

Game.prototype.isLower = function () {
  return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function (num) {
  if (num < 1 || num >= 100 || isNaN(num)) return 'Invalid guess! Give me a number between 1 and 100, please!';
  this.playersGuess = num;
  return this.checkGuess();
}

Game.prototype.guessesRemaining = function () {
  let guessNum = this.pastGuesses.length;
  switch (5 - guessNum) {
    case 4 : return 'You have four guesses remaining.';
    case 3 : return 'You have three guesses remaining.';
    case 2 : return 'You have two guesses remaining.';
    case 1 : return 'You have one guess remaining. Make it count!';
    default : return '';
  }
}

Game.prototype.checkGuess = function () {
  if (this.playersGuess === this.winningNumber) {
    $('#hint, #submit').prop('disabled', true);
    $('#subtitle').text('');
    return 'YOU WIN! Click the reset button to play again!';
  }

  else if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
    return 'You have already guessed that number.';
  }

  else {
    this.pastGuesses.push(this.playersGuess)

    if (this.pastGuesses.length === 5) {
      $('.guess-text-overlay div:nth-of-type(5)').text(this.playersGuess);
      $('#subtitle').text('');
      $('#hint, #submit').prop('disabled', true);
      return 'You Lose... Click the reset button to play again!';
    }
    else {
      $('.guess-text-overlay div:nth-of-type(' + this.pastGuesses.length + ')').text(this.playersGuess);
      $('#subtitle').text(this.guessesRemaining());

      let difference = this.difference();
      let returnStr = '';

      if (difference < 10) returnStr += `You're burning up!`;
      else if (difference < 25) returnStr += `You're lukewarm.`;
      else if (difference < 50) returnStr += `You're a bit chilly.`;
      else returnStr += `You're ice cold!`;
      this.isLower() ? returnStr += ' Guess higher!' : returnStr += ' Guess lower!';
      return returnStr;
    }
  }
}

Game.prototype.provideHint = function () {
  let hintArr = [generateWinningNumber(), generateWinningNumber(), this.winningNumber];
  return shuffle(hintArr).join(' - ');
}

function makeGuess (game) {
  let guess = +$('#player-input').val();
  $('#player-input').val('');
  let output = game.playersGuessSubmission(guess)
  $('#title').text(output);
}

// // BEGIN JQUERY!!

$(document).ready(function () {
  let game = new Game();

  $('#submit').click(function () {
    makeGuess(game);
  })

  $('#player-input').keypress(function (key) {
    if (key.which === 13) makeGuess(game);
  })

  $('#hint, #reset')
    .mouseover(function () {
      $(this).addClass('header-button-hover')
    })
    .mouseout(function () {
      $(this).removeClass('header-button-hover')
    });

  $('#hint').click(function () {
    let hints = game.provideHint();
    $('#title').text('One these is the winning number: ' + hints);
    $(this).prop('disabled', true)
      .off('mouseover mouseout')
      .removeClass('header-button-hover')
      .css('border-color', '#000000')
  });

  $('#reset').click(function () {
    game = newGame();
    $('#title').text('Guess a number between 1 and 100! Good luck!');
    $('#subtitle').text('You have five guesses remaining.');
    $('.guess').text('##');
    $('#hint, #submit').prop('disabled', false)
    $('#hint')
      .mouseover(function () {
        $(this).addClass('header-button-hover')
        })
      .mouseout(function () {
        $(this).removeClass('header-button-hover')
      })
      .css('border-color', '#de2530');
  })

})
