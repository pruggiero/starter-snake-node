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
const randomMovement = (possibleMovements) => {
  var randomNumber = Math.floor(Math.random()*possibleMovements.length);
  return possibleMovements[randomNumber];
}

const removePossibleMovement = (possibleMovements, movement) => {
  var index = possibleMovements.indexOf(movement);
  console.log(possibleMovements);
  console.log(movement);
  if (index > -1) {
    possibleMovements.splice(index, 1);
    console.log("Pauly");
    console.log(possibleMovements);
    return possibleMovements;
  }
}

const possibleMovements = (snakebody) => {
  var possibleMovements = ['up','down','left','right'];
  // snakebody.forEach(cordinate => 
  //   cordinate.x
  // );
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

  if (snakebody[0].x === snakebody[1].x + 1) {
    possibleMovements = removePossibleMovement(possibleMovements, 'right');
  }
  if (snakebody[0].x === snakebody[1].x - 1) {
    possibleMovements = removePossibleMovement(possibleMovements, 'left');
  }
  if (snakebody[0].y === snakebody[1].y + 1) {
    possibleMovements = removePossibleMovement(possibleMovements, 'up');
  }
  if (snakebody[0].y === snakebody[1].y - 1) {
    possibleMovements = removePossibleMovement(possibleMovements, 'down');
  }

  // if (possibleMovements === []) {
  //   possibleMovements['up'];
  // }
  return randomMovement(possibleMovements);
}

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  // NOTE: Do something here to generate your move

  console.log(request.body.you.body);

  var currentMove = possibleMovements(request.body.you.body);

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
