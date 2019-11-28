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

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  // NOTE: Do something here to generate your move

  console.log(request.body.you.body);
  console.log("Pauly");
  var x = request.body.you.body[0].x;
  var y = request.body.you.body[0].y;

  var currentMove = randomMovement(['up','down','left','right']);

  if (y === 0) {
    currentMove = randomMovement(['left','right','down']);
    if (request.body.you.body[1].y === 1) {
      currentMove = randomMovement(['left','right']);
    }
  }

  if (y === 10) {
    currentMove = randomMovement(['left','right','up']);
    if (request.body.you.body[1].y === 9) {
      currentMove = randomMovement(['left','right']);
    }
  }

  if (x === 0) {
    currentMove = randomMovement(['down','right','up']);
    if (request.body.you.body[1].x === 1) {
      currentMove = randomMovement(['down','up']);
    }
  }

  if (x === 10) {
    currentMove = randomMovement(['left','down','up']);
    if (request.body.you.body[1].x === 9) {
      currentMove = randomMovement(['down','up']);
    }
  }
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
