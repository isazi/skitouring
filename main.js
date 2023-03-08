
var isPaused;
// currentMode is 0 for startup, 1 for climb, 2 for descent
var currentMode;
var slopeMode;
var referenceAltitude;
var threshold;

function evaluate(input, output) {
  if ( isPaused ) {
    return;
  }
  
  var currentAltitude = input.altitude;
  // Counter for climbs and descents
  if ( currentMode == 0 ) {
    // Startup mode
    if ( Math.abs(referenceAltitude - currentAltitude) > threshold ) {
      if ( currentAltitude > referenceAltitude ) {
        // Start climbing
        currentMode = 1;
        output.climbs++;
      }
      else {
        // Start descending
        currentMode = 2;
        output.descents++;
      }
      referenceAltitude = currentAltitude;
    }
  }
  else if ( currentMode == 1 ) {
    // Climbing mode
    if ( Math.abs(referenceAltitude - currentAltitude) > threshold ) {
      if ( currentAltitude < referenceAltitude ) {
        // Start descending
        currentMode = 2;
        output.descents++;
      }
      referenceAltitude = currentAltitude;
    }
  }
  else if ( currentMode == 2 ) {
    // Descent mode
    if ( Math.abs(referenceAltitude - currentAltitude) > threshold ) {
      if ( currentAltitude > referenceAltitude ) {
        // Start climbing
        currentMode = 1;
        output.climbs++;
      }
      referenceAltitude = currentAltitude;
    }
  }

  // Pressure trend
  if ( input.trend == 1 ) {
    output.arrow = "&#xF280;"
  }
  else if ( input.trend == 2 ) {
    output.arrow = "&#xF281;"
  }
  else if ( input.trend == 3 ) {
    output.arrow = "&#xF282;"
  }
  else if ( input.trend == 4 ) {
    output.arrow = "&#xF283;"
  }
  else if ( input.trend == 5 ) {
    output.arrow = "&#xF284;"
  }
  else if ( input.trend == 6 ) {
    output.arrow = "&#xF285;"
  }
  else if ( input.trend == 7 ) {
    output.arrow = "&#xF286;"
  }
  else if ( input.trend == 8 ) {
    output.arrow = "&#xF287;"
  }
  else if ( input.trend == 9 ) {
    output.arrow = "&#xF288;"
  }
}

function onLoad(input, output) {
  output.climbs = 0;
  output.descents = 0;
  referenceAltitude = input.altitude;
  threshold = 7;
  currentMode = 0;
  slopeMode = false;
}

function onExerciseStart()
{
  isPaused = false;
}

function onExercisePause()
{
  isPaused = true;
}

function onExerciseContinue()
{
  isPaused = false;
}

function onLap()
{
  slopeMode = !slopeMode;
}

function getUserInterface() {
  return {
    template: 't',
    tl: { input: 'Fusion/Altitude', format: 'Altitude_Fourdigits' },
    tr: { input: 'Fusion/Altitude/Ascent', format: 'Ascent_Fivedigits' },
    ml: { input: 'Navigation/Routes/NavigatedRoute/ETA', format: 'Duration_Approximate' },
    mr: { input: '', format: '' },
    bottom: { input: '', format: '' }
  };
}

// This is called also when user backs from exercise start panel without starting
// exercise. onExerciseEnd() is not working at all as zapp gets disabled before
// it is called (and it would be called only when exercise is really started).
function getSummaryOutputs(input, output) {
  return [
    {
      id: "myzapp01.climbs",
      name: "Climbs",
      format: "Count_Threedigits",
      value: output.climbs
    },
    {
      id: "myzapp01.descents",
      name: "Descents",
      format: "Count_Threedigits",
      value: output.descents
    }
  ];
}
