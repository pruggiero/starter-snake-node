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
const randomMovement = (possibleMovements, snake, food) => {
  var location = snake.body;
  var randomNumber = Math.floor(Math.random()*possibleMovements.length);
  var movement = possibleMovements[randomNumber];
  if (possibleMovements.indexOf('down') !== -1) {
    movement = 'down';
  }
  if (possibleMovements.indexOf('right') !== -1) {
    movement = 'right';
  } 
  if (possibleMovements.indexOf('up') !== -1) {
    movement = 'up';
  }
  if (possibleMovements.indexOf('left') !== -1) {
    movement = 'left';
  }

  if (possibleMovements.indexOf('down') !== -1 && location[0].y === 6) {
    movement = 'down';
  }
  if (possibleMovements.indexOf('right') !== -1 && location[0].x === 4) {
    movement = 'right';
  } 
  if (possibleMovements.indexOf('up') !== -1 && location[0].y === 4) {
    movement = 'up';
  }
  if (possibleMovements.indexOf('left') !== -1 && location[0].x === 6) {
    movement = 'left';
  }


  if (food.length > 0 && snake.health < 60) {
    nearbyFood = getNearbyFood(food, location);
    if (nearbyFood.y !== location[0].y) {
      if (nearbyFood.y < location[0].y && possibleMovements.indexOf('up') !== -1) {
        movement = 'up';
      }
      if (nearbyFood.y > location[0].y && possibleMovements.indexOf('down') !== -1) {
        movement = 'down';
      }
    }

    if (nearbyFood.x === location[0].x) {
      if (possibleMovements.indexOf('left') !== -1) {
        movement = 'left';
      }
      if (possibleMovements.indexOf('right') !== -1) {
        movement = 'right';
      }
    }
  }

  return movement;
}

const removePossibleMovement = (possibleMovements, movement) => {
  var index = possibleMovements.indexOf(movement);

  if (index > -1) {
    possibleMovements.splice(index, 1);
  }
  return possibleMovements;
}

const getNearbyFood = (foods, location) => {
  var closeFood = foods[0];
  var radar = 2;
  foods.forEach(food => {
    radar = 2;
    if (location[0].x + radar === food.x && location[0].y === food.y) {
      closeFood = food;
    }
    if (location[0].x - radar === food.x && location[0].y === food.y) {
      closeFood = food;
    }
    if (location[0].y + radar === food.y && location[0].x === food.x) {
      closeFood = food;
    }
    if (location[0].y - radar === cordinate.y && location[0].x === food.x) {
      closeFood = food;
    }

    if (location[0].x + radar === food.x && location[0].y - radar === food.y) {
      closeFood = food;
    }
    if (location[0].x - radar === food.x && location[0].y - radar === food.y) {
      closeFood = food;
    }
    if (location[0].x + radar === food.x && location[0].y + radar === food.y) {
      closeFood = food;
    }
    if (location[0].x - radar === food.x && location[0].y + radar === food.y) {
      closeFood = food;
    }

    radar = 1;
    if (location[0].x + radar === food.x && location[0].y === food.y) {
      closeFood = food;
    }
    if (location[0].x - radar === food.x && location[0].y === food.y) {
      closeFood = food;
    }
    if (location[0].y + radar === food.y && location[0].x === food.x) {
      closeFood = food;
    }
    if (location[0].y - radar === cordinate.y && location[0].x === food.x) {
      closeFood = food;
    }

    if (location[0].x + radar === food.x && location[0].y - radar === food.y) {
      closeFood = food;
    }
    if (location[0].x - radar === food.x && location[0].y - radar === food.y) {
      closeFood = food;
    }
    if (location[0].x + radar === food.x && location[0].y + radar === food.y) {
      closeFood = food;
    }
    if (location[0].x - radar === food.x && location[0].y + radar === food.y) {
      closeFood = food;
    }
    return food;
  });
}

const possibleMovements = (snake, othersnakes, board) => {
  var possibleMovements = ['up','down','left','right'];
  var height = board.height - 1;
  var width = board.width - 1;
  var food = board.food;
  var snakebody = snake.body;

  if (snakebody[0].y === 0) {
    possibleMovements = removePossibleMovement(possibleMovements, 'up');
  }

  if (snakebody[0].y === height) {
    possibleMovements = removePossibleMovement(possibleMovements, 'down');
  }

  if (snakebody[0].x === 0) {
    possibleMovements = removePossibleMovement(possibleMovements, 'left');
  }

  if (snakebody[0].x === width) {
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

  var superfuturevision = possibleMovements.map(x => x);

  othersnakes.forEach(snake => {
    if (snakebody[0].x !== snake.body[0].x && snakebody[0].y !== snake.body[0].y) {
      if (snakebody[0].y - 1 === snake.body[0].y && snakebody[0].x === snake.body[0].x - 1) {
        superfuturevision = removePossibleMovement(superfuturevision, 'up');
        superfuturevision = removePossibleMovement(superfuturevision, 'right');
      }
      if (snakebody[0].y - 1 === snake.body[0].y && snakebody[0].x === snake.body[0].x + 1) {
        superfuturevision = removePossibleMovement(superfuturevision, 'up');
        superfuturevision = removePossibleMovement(superfuturevision, 'left');
      }
      if (snakebody[0].y + 1 === snake.body[0].y && snakebody[0].x === snake.body[0].x - 1) {
        superfuturevision = removePossibleMovement(superfuturevision, 'down');
        superfuturevision = removePossibleMovement(superfuturevision, 'right');
      }
      if (snakebody[0].y + 1 === snake.body[0].y && snakebody[0].x === snake.body[0].x + 1) {
        superfuturevision = removePossibleMovement(superfuturevision, 'down');
        superfuturevision = removePossibleMovement(superfuturevision, 'left');
      }
    }
  });

  var futurevision = superfuturevision.map(x => x);

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

  var avoidFood = superfuturevision.map(x => x);

  if (food.length > 0) {
    food.forEach(cordinate => {
      if (snakebody[0].x !== cordinate.x) {
        if (snakebody[0].x + 1 === cordinate.x && snakebody[0].y === cordinate.y) {
          avoidFood = removePossibleMovement(avoidFood, 'right');
        }
        if (snakebody[0].x - 1 === cordinate.x && snakebody[0].y === cordinate.y) {
          avoidFood = removePossibleMovement(avoidFood, 'left');
        }
      }
      if (snakebody[0].y !== cordinate.y) {
        if (snakebody[0].y + 1 === cordinate.y && snakebody[0].x === cordinate.x) {
          avoidFood = removePossibleMovement(avoidFood, 'down');
        }
        if (snakebody[0].y - 1 === cordinate.y && snakebody[0].x === cordinate.x) {
          avoidFood = removePossibleMovement(avoidFood, 'up');
        }
      }
    });
  }

  if (avoidFood.length > 0 && snake.health > 80) {
    return avoidFood;
  } else if (futurevision.length > 0) {
    return futurevision;
  } else if (superfuturevision.length > 0) {
    return superfuturevision;
  } else {
    return possibleMovements;
  }
}

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  // NOTE: Do something here to generate your move

  // console.log(request.body.you.body);

  var movements = possibleMovements(request.body.you, request.body.board.snakes, request.body.board);
  var currentMove = randomMovement(movements, request.body.you, request.body.board.food);
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
