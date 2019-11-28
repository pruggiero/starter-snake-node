const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // NOTE: Do something here to start the game

  // Response data
  const data = {
    color: '#0a0a0a',
    headType: "evil",
    tailType: "hook"
  }

  return response.json(data)
})
const randomMovement = (possibleMovements, location, food) => {
  var randomNumber = Math.floor(Math.random()*possibleMovements.length);
  var movement = possibleMovements[randomNumber];
  if (location[0].x < 5 && possibleMovements.indexOf('right') !== -1) {
    movement = 'right';
  } 
  if (location[0].x >= 5 && possibleMovements.indexOf('left') !== -1) {
    movement = 'left';
  } 
  if (location[0].y < 5 && possibleMovements.indexOf('down') !== -1) {
    movement = 'down';
  } 
  if (location[0].y >= 5 && possibleMovements.indexOf('up') !== -1) {
    movement = 'up';
  }
  console.log("Before food");
  console.log(movement);
  if (food !== []) {
    if (food[0].y !== location[0].y) {
      if (food[0].y < location[0].y && possibleMovements.indexOf('up') !== -1) {
        movement = 'up';
      }
      if (food[0].y > location[0].y && possibleMovements.indexOf('down') !== -1) {
        movement = 'down';
      }
    }

    if (food[0].x !== location[0].x) {
      if (food[0].x < location[0].x && possibleMovements.indexOf('left') !== -1) {
        movement = 'left';
      }
      if (food[0].x > location[0].x && possibleMovements.indexOf('right') !== -1) {
        movement = 'right';
      }
    }
  }
  console.log("after food");
  console.log(movement);
  return movement;
}

const removePossibleMovement = (possibleMovements, movement) => {
  var index = possibleMovements.indexOf(movement);

  if (index > -1) {
    possibleMovements.splice(index, 1);
  }
  return possibleMovements;
}

const possibleMovements = (snakebody, othersnakes) => {
  var possibleMovements = ['up','down','left','right'];

  if (snakebody[0].y === 0) {
    possibleMovements = removePossibleMovement(possibleMovements, 'up');
  }

  if (snakebody[0].y === 10) {
    possibleMovements = removePossibleMovement(possibleMovements, 'down');
  }

  if (snakebody[0].x === 0) {
    possibleMovements = removePossibleMovement(possibleMovements, 'left');
  }

  if (snakebody[0].x === 10) {
    possibleMovements = removePossibleMovement(possibleMovements, 'right');
  }

  snakebody.forEach(cordinate => {
    if (snakebody[0].x !== cordinate.x) {
      if (snakebody[0].x + 1 === cordinate.x && snakebody[0].y === cordinate.y) {
        possibleMovements = removePossibleMovement(possibleMovements, 'right');
      }
      if (snakebody[0].x - 1 === cordinate.x && snakebody[0].y === cordinate.y) {
        possibleMovements = removePossibleMovement(possibleMovements, 'left');
      }
    }
    if (snakebody[0].y !== cordinate.y) {
      if (snakebody[0].y + 1 === cordinate.y && snakebody[0].x === cordinate.x) {
        possibleMovements = removePossibleMovement(possibleMovements, 'down');
      }
      if (snakebody[0].y - 1 === cordinate.y && snakebody[0].x === cordinate.x) {
        possibleMovements = removePossibleMovement(possibleMovements, 'up');
      }
    }
  });

  othersnakes.forEach(snake => {
    snake.body.forEach(cordinate => {
      if (snakebody[0].x !== cordinate.x) {
        if (snakebody[0].x + 1 === cordinate.x && snakebody[0].y === cordinate.y) {
          possibleMovements = removePossibleMovement(possibleMovements, 'right');
        }
        if (snakebody[0].x - 1 === cordinate.x && snakebody[0].y === cordinate.y) {
          possibleMovements = removePossibleMovement(possibleMovements, 'left');
        }
      }
      if (snakebody[0].y !== cordinate.y) {
        if (snakebody[0].y + 1 === cordinate.y && snakebody[0].x === cordinate.x) {
          possibleMovements = removePossibleMovement(possibleMovements, 'down');
        }
        if (snakebody[0].y - 1 === cordinate.y && snakebody[0].x === cordinate.x) {
          possibleMovements = removePossibleMovement(possibleMovements, 'up');
        }
      }
    });
  });

  var futurevision = possibleMovements.map(x => x)

  othersnakes.forEach(snake => {
    snake.body.forEach(cordinate => {
      if (snakebody[0].x !== cordinate.x) {
        if (snakebody[0].x + 2 === cordinate.x && snakebody[0].y === cordinate.y) {
          futurevision = removePossibleMovement(futurevision, 'right');
        }
        if (snakebody[0].x - 2 === cordinate.x && snakebody[0].y === cordinate.y) {
          futurevision = removePossibleMovement(futurevision, 'left');
        }
      }
      if (snakebody[0].y !== cordinate.y) {
        if (snakebody[0].y + 2 === cordinate.y && snakebody[0].x === cordinate.x) {
          futurevision = removePossibleMovement(futurevision, 'down');
        }
        if (snakebody[0].y - 2 === cordinate.y && snakebody[0].x === cordinate.x) {
          futurevision = removePossibleMovement(futurevision, 'up');
        }
      }
    });
  });

  if (futurevision === []) {
    return possibleMovements;
  } else {
    return futurevision;
  }
}

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  // NOTE: Do something here to generate your move

  console.log(request.body.you.body);
  console.log('food');
  console.log(request.body.board.food);

  var food = request.body.board.food ? request.body.board.food : [];
  var movements = possibleMovements(request.body.you.body, request.body.board.snakes);
  var currentMove = randomMovement(movements, request.body.you.body, food);
  console.log(movements);
  console.log(currentMove);
  // Response data
  const data = {
    move: currentMove, // one of: ['up','down','left','right']
  }

  return response.json(data)
})

app.post('/end', (request, response) => {
  // NOTE: Any cleanup when a game is complete.
  return response.json({})
})

app.post('/ping', (request, response) => {
  // Used for checking if this snake is still alive.
  return response.json({});
})

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
