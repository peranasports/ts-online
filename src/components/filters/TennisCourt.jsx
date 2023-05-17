import { useRef, useEffect, useState } from 'react'
import h337 from "heatmap.js"
import heat from 'simpleheat' 
import { PercentColours } from './PercentColours';
import { interpolate } from '../utils/utils';

function TennisCourt({ sets, matches, allOptions, playerGuid, oppositionId, displayMode, isNormalised, showSource, handleFilteredEventsChanged }) {

  var kServing = 0;
  var kReturning = 1;
  var kRally = 2;
  var kKeypoint = 3;
  // var kRallyCounter = 4;
  // var kMissingPoint = 10;
  // var kMissingGame = 20;
  // var kMissingRally = 30;
  // var kCoachTag = 40;

  var kServeIn = 0;
  var kServeFootfault = 1;
  var kServeAce = 2;
  var kServeWinner = 3;
  var kServeLet = 4;
  var kServeOut = 5;
  var kServeNet = 6;
  var kServeOutOffNet = 7;

  var kServeFirst = 0;
  var kServeSecond = 1;
  // var kAfterServe = 2;
  // var kAfterReturn = 3;

  var kReturnIn = 0;
  var kReturnInOffNet = 1;
  var kReturnVolleyed = 2;
  var kReturnWinner = 3;
  var kReturnForcingError = 4;
  var kReturnPassingShot = 5;
  var kReturnOut = 6;
  var kReturnUnforcedError = 7;
  var kReturnFirst = 8;
  var kReturnSecond = 9;
  // var kReturnNetted = 10;

  var kForehand = 0;
  // var kBackhand = 1;
  // var kUnknownhand = 2;

  var kRallyDrive = 0;
  var kRallySlice = 1;
  var kRallyTopspin = 2;
  var kRallyVolley = 3;
  var kRallyOverhead = 4;
  var kRallyLob = 5;
  var kRallyDropshot = 6;
  // var kRallyOther = 7;
  var kRallyDriveVolley = 8;
  var kRallyServeVolley = 9;
  var kRallySmash = 10;
  var kRallyApproach = 11;

  // var kRallyOutcomeIn = 0;
  var kRallyOutcomeOut = 1;
  var kRallyOutcomeWinner = 2;
  var kRallyOutcomeUnforcedError = 3;
  var kRallyOutcomeForcingError = 4;
  var kRallyOutcomePassingShot = 5;
  var kRallyOutcomeNetcord = 6;
  var kRallyOutcomePutAway = 7;
  var kRallyOutcomeNetted = 8;
  var kRallyOutcomeOutOffNet = 9;
  var kRallyOutcomeNettedPassingShot = 10;
  var kRallyOutcomeOutPassingShot = 11;

  // var kIsServing = 1;
  // var kBreakPointAgainst = 2;
  // var kBreakPoint = 3;
  // var kBreakPointConverted = 4;
  // var kBreakPointConceded = 5;

  // var kDirectionInsideOut = 0;
  // var kDirectionInsideIn = 1;
  // var kDirectionCrossCourt = 2;
  // var kDirectionDownTheLine = 3;
  // var kDirectionCentre = 4;

  // var kReachComfortable = 0;
  // var kReachStretch = 1;
  // var kReachBody = 2;

  var kOutcomeNoMatch = -1;
  var kOutcomeWinner = 0;
  var kOutcomeError = 1;
  var kOutcomeServeReturnIn = 2;
  var kOutcomeServeLet = 3;
  var kOutcomeUnforcedError = 4;

  var kScores00_00 = 0;
  var kScores15_00 = 1;
  var kScores30_00 = 2;
  var kScores00_15 = 3;
  var kScores15_15 = 4;
  var kScores30_15 = 5;
  var kScores00_30 = 6;
  var kScores15_30 = 7;
  var kScores30_30 = 8;
  var kScores00_40 = 9;
  var kScores15_40 = 10;
  var kScores30_40 = 11;
  var kScores40_15 = 12;
  var kScores40_30 = 13;
  var kScores40_00 = 14;
  var kScoresDeuce = 15;
  var kScoresServerAd = 16;
  var kScoresReturnerAd = 17;
  // var kScoresBreakPointFor = 18;
  var kScoresBreakPoint = 19;
  var kScoresGamePoint = 20;
  var kScoresTiebreak = 21;

  // console.log('tenniscourt sets, matches, allOptions, playerGuid, oppositionId', sets, matches, allOptions, playerGuid, oppositionId)

  const canvasRef = useRef(null)
  const ref = useRef(null)
  const [heatmapInstance, setHeatmapInstance] = useState(null)
  const [filteredEvents, setFilteredEvents] = useState([])

  const getSels = (options, title) => {
    var sels = []
    for (var n = 0; n < options.length; n++) {
      var option = options[n]
      if (option.title === title) {
        for (var m = 0; m < option.items.length; m++) {
          var item = option.items[m]
          sels.push(item)
        }
      }
    }
    // console.log('getSels', title, sels)
    return sels
  }

  const player1GameScore = (e) => {
    var a = e.scores.split(" ")
    if (a.length === 2) {
      var a2 = a[1].split(":")
      if (a2.length === 2) {
        return parseInt(a2[0], 10)
      }
    }
    return 0;
  }

  const player2GameScore = (e) => {
    var a = e.scores.split(" ")
    if (a.length === 2) {
      var a2 = a[1].split(":")
      if (a2.length === 2) {
        return parseInt(a2[1], 10)
      }
    }
    return 0;
  }

  const player1SetScore = (e) => {
    var a = e.scores.split(" ")
    if (a.length === 2) {
      var a2 = a[0].split(":")
      if (a2.length === 2) {
        return parseInt(a2[0], 10)
      }
    }
    return 0;
  }

  const player2SetScore = (e) => {
    var a = e.scores.split(" ")
    if (a.length === 2) {
      var a2 = a[0].split(":")
      if (a2.length === 2) {
        return parseInt(a2[1], 10)
      }
    }
    return 0;
  }

  const serveZone = (e) => {
    if (e.endBall === null)
    {
      return -1
    }
    var outcome = getOutcome(e)
    if (outcome === kOutcomeError || outcome === kOutcomeUnforcedError) {
      return 3
    }

    if (outcome === kOutcomeServeLet) {
      return -1
    }

    var a = e.endBall.split(",")
    if (a.length !== 2) {
      return -1
    }
    var x = parseInt(a[0], 10)
    var y = parseInt(a[1], 10)
    if (y > 100)    // normalise
    {
      x = 100 - x;
      y = 200 - y;
    }
    if ((x >= 12.5 && x < 25) || (x >= 75 && x < 87.5)) {
      return 0
    }
    else if ((x >= 25 && x < 37.5) || (x >= 62.5 && x < 75)) {
      return 1
    }
    else if ((x >= 37.5 && x < 50) || (x >= 50 && x < 62.5)) {
      return 2
    }
    return -1
  }

  const getOutcome = (e) => {
    var outcome = e.outcome;

    if (e.skill === kServing) {
      if (outcome === kServeAce || outcome === kServeWinner) {
        return kOutcomeWinner;
      } else if (outcome === kServeLet) {
        return kOutcomeServeLet;
      } else if (outcome === kServeIn) {
        return kOutcomeServeReturnIn;
      } else if (outcome === kServeFootfault || outcome === kServeOut || outcome === kServeNet || outcome === kServeOutOffNet) {
        return kOutcomeUnforcedError;
      }
    } else if (e.skill === kReturning) {
      if (outcome === kReturnWinner) {
        return kOutcomeWinner;
      } else if (outcome === kReturnIn || outcome === kReturnInOffNet || outcome === kReturnPassingShot || outcome === kReturnVolleyed) {
        return kOutcomeServeReturnIn;
      } else if (outcome === kReturnForcingError) {
        return kOutcomeError;
      } else if (outcome === kReturnOut || outcome === kReturnUnforcedError) {
        return kOutcomeUnforcedError;
      }
    } else if (e.skill === kRally) {
      return kOutcomeServeReturnIn;
    } else if (e.skill === kKeypoint) {
      if (outcome === kRallyOutcomeWinner || outcome === kRallyOutcomePassingShot || outcome === kRallyOutcomeNetcord || outcome === kRallyOutcomePutAway) {
        return kOutcomeWinner;
      } else if (outcome === kRallyOutcomeOut || outcome === kRallyOutcomeUnforcedError || outcome === kRallyOutcomeNetted || outcome === kRallyOutcomeOutOffNet || outcome === kRallyOutcomeNettedPassingShot || outcome === kRallyOutcomeOutPassingShot) {
        return kOutcomeUnforcedError;
      } else if (outcome === kRallyOutcomeForcingError) {
        return kOutcomeError;
      }
    }

    return kOutcomeNoMatch;
  }

  const getColor = (event) => {
    var outcome = getOutcome(event);
    var color = '#ff0000';

    switch (outcome) {
      case kOutcomeServeReturnIn:
        color = '#f3e85c';
        break;

      case kOutcomeServeLet:
        color = '#e1e1e1';
        break;

      case kOutcomeWinner:
        color = '#00ff00';
        break;

      default:
        color = '#ff0000';
    }

    return color;
  }

  const getScoresIndex = (e, selplayerGuid) => {
    var scoreA = e.scoreA
    var scoreB = e.scoreB
    // var setScoreA = e.setScoreA
    // var setScoreB = e.setScoreB
    var isTiebreak = e.isSetTiebreak
    // console.log('isTiebreak', isTiebreak)
    var isServing = (e.serverId === selplayerGuid) || (selplayerGuid === 0 && e.serverId !== playerGuid)

    if (isServing && scoreB >= 6 && scoreB > scoreA && isTiebreak)
      return kScoresBreakPoint;

    if (scoreA === 0 && scoreB === 0 && !isTiebreak) return kScores00_00;
    if (scoreA === 1 && scoreB === 0 && !isTiebreak) return kScores15_00;
    if (scoreA === 2 && scoreB === 0 && !isTiebreak) return kScores30_00;
    if (scoreA === 0 && scoreB === 1 && !isTiebreak) return kScores00_15;
    if (scoreA === 1 && scoreB === 1 && !isTiebreak) return kScores15_15;
    if (scoreA === 2 && scoreB === 1 && !isTiebreak) return kScores30_15;
    if (scoreA === 0 && scoreB === 2 && !isTiebreak) return kScores00_30;
    if (scoreA === 1 && scoreB === 2 && !isTiebreak) return kScores15_30;
    if (scoreA === 2 && scoreB === 2 && !isTiebreak) return kScores30_30;
    if (scoreA === 0 && scoreB === 3 && !isTiebreak) return kScores00_40;
    if (scoreA === 1 && scoreB === 3 && !isTiebreak) return kScores15_40;
    if (scoreA === 2 && scoreB === 3 && !isTiebreak) return kScores30_40;
    if (scoreA === 3 && scoreB === 1 && !isTiebreak) return kScores40_15;
    if (scoreA === 3 && scoreB === 2 && !isTiebreak) return kScores40_30;
    if (scoreA === 3 && scoreB === 0 && !isTiebreak) return kScores40_00;
    if (scoreA >= 3 && scoreB === scoreA && !isTiebreak) return kScoresDeuce;
    if ((scoreA >= 4) && (scoreA === scoreB + 1) && !isTiebreak)
      return kScoresServerAd;
    if ((scoreB >= 4) && (scoreB === scoreA + 1) && !isTiebreak) return kScoresReturnerAd;
    if ((scoreA >= 3 && scoreA > scoreB && !isTiebreak) ||
      (scoreA >= 6 && scoreA > scoreB && isTiebreak))
      return kScoresGamePoint;

    if (isTiebreak) {
      return kScoresTiebreak;
    }
    return -1;
  }


  const gameNumber = (e) => { return (player1SetScore(e) + player2SetScore(e) + 1) };
  const pointNumber = (e) => { return (player1GameScore(e) + player2GameScore(e) + 1) }
  const isFirstServe = (e) => { return (e.skill === kServing && e.subskill1 === kServeFirst) }
  const isSecondServe = (e) => { return (e.skill === kServing && e.subskill1 === kServeSecond) }
  const isFirstReturn = (e) => { return (e.skill === kReturning && (e.subskill1 === kReturnFirst || e.subskill1 === kServeFirst)) }
  const isSecondReturn = (e) => { return (e.skill === kReturning && (e.subskill1 === kReturnSecond || e.subskill1 === kServeSecond)) }
  const isDeuceSide = (e) => { return (pointNumber(e) % 2 === 1) }
  const isRallyShot = (e) => { return (e.skill === kRally) }
  const isKeyshot = (e) => { return (e.skill === kKeypoint) }
  // const isForehand = (e) => { return (e.hand === kForehand) }
  // const isBackhand = (e) => { return (e.hand === kBackhand) }
  const isVolley = (e) => { return (e.subskill2 === kRallyVolley || e.subskill2 === kRallyDriveVolley || e.subskill2 === kRallyServeVolley) }
  const isServeVolley = (e) => { return (e.isAfterServe && isVolley(e)) }
  const isNetApproach = (e) => {
    if (e.startBall === null)
    {
      return false
    }
    var pt = e.startBall.split(",")
    var ptx = parseInt(pt[0], 10)
    var pty = parseInt(pt[1], 10)
    if (ptx !== 0 || pty !== 0) {
      if (pty < 100) {
        ptx = 100 - ptx;
        pty = 200 - pty;
      }

      if (pty < 154) {
        return true;
      }
    }

    return false
  }

  const checkShot = (e, lastserve, selShots) => {
    // console.log('selshots', selShots)
    if (isFirstServe(e) && isDeuceSide(e) && selShots[0].selected) return true
    if (isSecondServe(e) && isDeuceSide(e) && selShots[2].selected) return true
    if (isFirstServe(e) && !isDeuceSide(e) && selShots[1].selected) return true
    if (isSecondServe(e) && !isDeuceSide(e) && selShots[3].selected) return true

    if (e.skill === kReturning)
    {
      if (lastserve)
      {
        if (lastserve.subskill1 === kServeFirst) {
          e.subskill1 = kReturnFirst;
        }
        else if (lastserve.subskill1 === kServeSecond) {
          e.subskill1 = kReturnSecond;
        }
      }
    }
    if (isFirstReturn(e) && isDeuceSide(e) && selShots[4].selected) return true
    if (isSecondReturn(e) && isDeuceSide(e) && selShots[6].selected) return true
    if (isFirstReturn(e) && !isDeuceSide(e) && selShots[5].selected) return true
    if (isSecondReturn(e) && !isDeuceSide(e) && selShots[7].selected) return true

    if (isRallyShot(e) && selShots[8].selected) return true
    if (isKeyshot(e) && selShots[9].selected) return true

    if (e.isAfterServe && selShots[10].selected) return true
    if (e.isAfterReturn && selShots[11].selected) return true
    if (isServeVolley(e) && selShots[12].selected) return true
    if (isNetApproach(e) && selShots[13].selected) return true

    // console.log('event', e)

    return false
  }

  const checkHandShot = (e, selForehands, selBackhands) => {
    var selHands = e.hand === kForehand ? selForehands : selBackhands;

    if (e.subskill2 === kRallyTopspin && (selHands[0].selected) === false) return false
    if (e.subskill2 === kRallyDrive && (selHands[1].selected) === false) return false
    if (e.subskill2 === kRallySlice && (selHands[2].selected) === false) return false
    if (isVolley(e) && (selHands[3].selected) === false) return false
    if (e.subskill2 === kRallyOverhead && (selHands[4].selected) === false) return false
    if (e.subskill2 === kRallyLob && (selHands[5].selected) === false) return false
    if (e.subskill2 === kRallyDropshot && (selHands[6].selected) === false) return false
    if (e.subskill2 === kRallySmash && (selHands[7].selected) === false) return false
    if (e.subskill2 === kRallyApproach && (selHands[8].selected) === false) return false

    return true
  }

  const checkDirection = (e, selDirections) => {
    if (e.skill !== kReturning && e.skill !== kRally && e.skill !== kKeypoint) {
      return true
    }
    return ((selDirections[0].selected && e.direction === 0) ||
      (selDirections[1].selected && e.direction === 1) ||
      (selDirections[2].selected && e.direction === 2) ||
      (selDirections[3].selected && e.direction === 3) ||
      (selDirections[4].selected && e.direction === 4))

  }

  const checkServe = (e, selServes) => {
    if (e.skill !== kServing) {
      return true;
    }

    var zone = serveZone(e);
    // console.log(e)
    if (zone === -1) {
      return false;
    }

    return ((selServes[0].selected && zone === 0) ||
      (selServes[1].selected && zone === 1) ||
      (selServes[2].selected && zone === 2) ||
      (selServes[3].selected && zone === 3));
  }

  const checkOutcome = (e, selOutcome) => {
    var outcome = getOutcome(e)
    if (selOutcome[0].selected && outcome === kOutcomeWinner) {
      return true;
    }
    else if (selOutcome[1].selected && outcome === kOutcomeError) {
      return true;
    }
    else if (selOutcome[2].selected && outcome === kOutcomeUnforcedError) {
      return true;
    }
    else if (selOutcome[3].selected && outcome !== kOutcomeError &&
      outcome !== kOutcomeUnforcedError && outcome !== kOutcomeWinner) {
      return true;
    }
    return false;
  }

  const checkReach = (e, selReaches) => {
    var reach = e.reach

    return ((selReaches[0].selected && reach === 0) ||
      (selReaches[1].selected && reach === 1) ||
      (selReaches[2].selected && reach === 2) ||
      (selReaches[3].selected && reach === null))
  }

  const checkGameNumber = (e, selGames) => {
    var gn = gameNumber(e)
    // var p1sc = player1SetScore(e)
    // var p2sc = player2SetScore(e)
    // console.log('game number', e.scores, p1sc, p2sc, gn)
    if (gn > 14 && selGames[selGames.length - 1].selected) return true;
    if (selGames[gn - 1].selected) return true;
    return false;
  }

  const checkScores = (e, selScores, selplayerGuid) => {
    var doBreakPointsFor = false
    var doBreakPoints = false
    var doGamePoints = false

    var sels = selScores
    if (sels[18].selected)    // all break points for
    {
      doBreakPointsFor = true
      for (var n = 9; n < 17; n++) {
        if (sels[n].selected) {
          doBreakPointsFor = false
          break;
        }
      }
    }
    if (sels[19].selected)    // all break points against
    {
      doBreakPoints = true
      for (n = 9; n < 17; n++) {
        if (sels[n].selected) {
          doBreakPoints = false
          break;
        }
      }
    }
    if (sels[20].selected) // all game points
    {
      doGamePoints = true
      for (n = 9; n < 17; n++) {
        if (sels[n].selected) {
          // console.log('GP false n = ', n, sels)
          doGamePoints = false
          break;
        }
      }
    }

    var scoreA = e.scoreA
    var scoreB = e.scoreB
    var setScoreA = e.setScoreA
    var setScoreB = e.setScoreB

    if (doBreakPoints || doGamePoints || doBreakPointsFor) {
      //        if ([e.set.isTiebreak.selected)
      //        {
      //            return NO;
      //        }
      var isServing = (selplayerGuid === e.serverId) || (selplayerGuid === 0 && e.serverId !== playerGuid)
      if ((doBreakPoints && !isServing) || (doGamePoints && !isServing) || (doBreakPointsFor && isServing)) {
        // console.log('breakpoints 111 isServing doBreakPoints doGamePoints doBreakPointsFor', scoreA, scoreB, e.serverId, isServing, doBreakPoints, doGamePoints, doBreakPointsFor)
        return false
      }

      if (e.setIsTiebreak && setScoreA >= 6 && setScoreB >= 6) {
        console.log('setIsTiebreak')
        return false
      }

      if (doBreakPoints && scoreB >= 3 && scoreA < scoreB) {
        return true
      }
      if (doBreakPointsFor && scoreA >= 3 && scoreB < scoreA) {
        return true
      }
      if (doGamePoints && scoreA >= 3 && scoreB < scoreA) {
        return true
      }
      return false
    }
    // console.log('breakpoints 222 isServing doBreakPoints doGamePoints', scoreA, scoreB, e.serverId, isServing, doBreakPoints, doGamePoints)

    n = getScoresIndex(e, selplayerGuid)

    if (selScores[0].selected)    //00-00
    {
      if (n === kScores00_00) return true
    }
    if (selScores[1].selected)    //15-00
    {
      if (n === kScores15_00) return true
    }
    if (selScores[2].selected)    //30-00
    {
      if (n === kScores30_00) return true
    }
    if (selScores[3].selected)    //00-15
    {
      if (n === kScores00_15) return true
    }
    if (selScores[4].selected)    //15-15
    {
      if (n === kScores15_15) return true
    }
    if (selScores[5].selected)    //30-15
    {
      if (n === kScores30_15) return true
    }
    if (selScores[6].selected)    //00-30
    {
      if (n === kScores00_30) return true
    }
    if (selScores[7].selected)    //15-30
    {
      if (n === kScores15_30) return true
    }
    if (selScores[8].selected)    //30-30
    {
      if (n === kScores30_30) return true
    }
    if (selScores[9].selected)    //00-40
    {
      if (n === kScores00_40) return true
    }
    if (selScores[10].selected)   //15-40
    {
      if (n === kScores15_40) return true
    }
    if (selScores[11].selected)   //30-40
    {
      if (n === kScores30_40) return true
    }
    if (selScores[12].selected)   //40-15
    {
      if (n === kScores40_15) return true
    }
    if (selScores[13].selected)   //40-30
    {
      if (n === kScores40_30) return true
    }
    if (selScores[14].selected)   //40-00
    {
      if (n === kScores40_00) return true
    }
    if (selScores[15].selected)   //Deuce
    {
      if (n === kScoresDeuce) return true
    }
    if (selScores[16].selected)   // server ad
    {
      if (n === kScoresServerAd) return true
    }
    if (selScores[17].selected)   // returner ad
    {
      if (n === kScoresReturnerAd) return true
    }
    if (selScores[18].selected)   // break points
    {
      if (n === kScoresBreakPoint) return true
    }
    if (selScores[19].selected)   // game points
    {
      console.log('game point n =', n)
      if (n === kScoresGamePoint) return true
    }
    if (selScores[20].selected)   // all tie break points
    {
      if (n === kScoresTiebreak) return true
    }
    return false
  }

  const checkRallyLength = (e, selRally) => {
    if (selRally[0].selected) return true
    if (selRally[1].selected && ((e.rallycount >= 0 && e.rallycount <= 4) || (e.rallycount === null))) return true
    if (selRally[2].selected && e.rallycount > 4 && e.rallycount <= 8) return true
    if (selRally[3].selected && e.rallycount > 8) return true
    return false
  }

  const checkWinner = (e, selWinners) => {
    if (selWinners[0].selected && e.winnerId === playerGuid) return true
    if (selWinners[1].selected && e.winnerId !== null && e.winnerId !== playerGuid) return true
    return false
  }

  const writeText = (info, style = {}) => {
    const { ctx, text, x, y } = info;
    const { fontSize = 20, fontFamily = 'Helvetica Neue', color = 'black', textAlign = 'left', textBaseline = 'top' } = style;

    ctx.beginPath();
    ctx.font = fontSize + 'px ' + fontFamily;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.stroke();
  }

  const writeTextCenter = (info, style = {}) => {
    const { ctx, text, x, y, width } = info;
    const { fontSize = 20, fontFamily = 'Helvetica Neue', color = 'black', textAlign = 'left', textBaseline = 'top' } = style;

    var textWidth = ctx.measureText(text).width;
    var xx = x + (width/2) - (textWidth / 2)

    ctx.beginPath();
    ctx.font = fontSize + 'px ' + fontFamily;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.fillStyle = color;
    ctx.fillText(text, xx, y);
    ctx.stroke();
  }

function drawArrowHead(ctx, bs, be, ahl, ahar, col, scolor)
{
  ctx.lineWidth = 1.0;
  ctx.strokeStyle = scolor;
  ctx.fillStyle = col;
    
	var arrowOrigin = {};
    var arrowTip = {};
    var arrowHeadBase = {};
    var arrowHeadWing1 = {};
    var arrowHeadWing2 = {};
    var arrowHeadBase2 = {};
    var arrowHeadWing21 = {};
    var arrowHeadWing22 = {};
	var deltaX = 0.0;
	var deltaY = 0.0;
	
	var deltaXBase = 0.0;
	var deltaYBase = 0.0;
	
	var headToShaftRatio = 0.0;
	var deltaXWing = 0.0;
	var deltaYWing = 0.0;
    
	var mArrowLength;	
	
	// The arrow origin will be at the center of the view
    arrowOrigin.x = bs.x;
    arrowOrigin.y = bs.y;
    
	// Create the path that will contain the arrow drawing instructions
	// and begin drawing.
	ctx.beginPath();
//	CGPathMoveToPoint(arrowPath, NULL, arrowOrigin.x, arrowOrigin.y);
	
	// Calculate the arrow tip location from the polar coordinates
	deltaX = (be.x - bs.x); 
	deltaY = (be.y - bs.y); 
    arrowTip.x = be.x;
    arrowTip.y = be.y;
	
	mArrowLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	//	mArrowAngle = deltaY == 0 ? 0 : atan(-deltaX / deltaY);
	//	mArrowAngle = (mArrowAngle * 180) / PI;
	
	var mArrowHeadLength = ahl;
	var mArrowHeadAspectRatio = ahar;
	
	// Define the arrow shaft
//	CGPathAddLineToPoint(arrowPath, NULL, arrowTip.x, arrowTip.y);
	
	headToShaftRatio = mArrowHeadLength/mArrowLength;
	deltaXBase = headToShaftRatio*deltaX;
	deltaYBase = headToShaftRatio*deltaY;
	// Calculate the location of the base of the arrow head
	arrowHeadBase.x = arrowTip.x - deltaXBase;	
	arrowHeadBase.y = arrowTip.y - deltaYBase;	
	
	arrowHeadBase2.x = arrowTip.x - deltaXBase/2;	
	arrowHeadBase2.y = arrowTip.y - deltaYBase/2;	
	
	// Calculate the wing tips of the arrow head
	deltaXWing = mArrowHeadAspectRatio*deltaXBase;
	deltaYWing = mArrowHeadAspectRatio*deltaYBase;
	arrowHeadWing1.x = arrowHeadBase.x - deltaYWing ;	
	arrowHeadWing1.y = arrowHeadBase.y + deltaXWing ;	
	arrowHeadWing2.x = arrowHeadBase.x + deltaYWing ;	
	arrowHeadWing2.y = arrowHeadBase.y - deltaXWing ;	
	
	arrowHeadWing21.x = arrowHeadBase2.x - deltaYWing/2 ;	
	arrowHeadWing21.y = arrowHeadBase2.y + deltaXWing/2 ;	
	arrowHeadWing22.x = arrowHeadBase2.x + deltaYWing/2 ;	
	arrowHeadWing22.y = arrowHeadBase2.y - deltaXWing/2 ;	
	
	// Define the arrow head wings
  ctx.moveTo(arrowTip.x, arrowTip.y);
  ctx.lineTo(arrowHeadWing1.x, arrowHeadWing1.y);
	ctx.lineTo(arrowHeadWing2.x, arrowHeadWing2.y);
	ctx.lineTo(arrowTip.x, arrowTip.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

  // const drawArrowHead = (ctx, start, end, headLength, ratio, color) =>
  // {
  //   ctx.beginPath();
  //   ctx.moveTo(start.x, start.y - headLength);
  //   ctx.lineTo(end.x - headLength/2, end.y - headLength);
  //   ctx.lineTo(end.x + headLength/2, end.y - headLength);
  //   ctx.closePath();

  //   ctx.fillStyle = color;
  //   ctx.fill();
  // }

  const convertBallPosition = (ballPos) =>
  {
    var pos = ballPos !== null ? ballPos.split(",") : [0, 0]
    var x = pos[0]
    var y = pos[1]
    return { x:x, y:y }
  }

  const convertStartBallPosition = (ballPos) =>
  {
    var pos = ballPos !== null ? ballPos.split(",") : [0, 0]
    var x = pos[0]
    var y = pos[1]
    if (isNormalised && y < 100)
    {
      x = 100 - x
      y = 200 - y
    }
    return { x:x, y:y }
  }

  const convertEndBallPosition = (ballPos) =>
  {
    var pos = ballPos !== null ? ballPos.split(",") : [0, 0]
    var x = pos[0]
    var y = pos[1]
    if (isNormalised && y > 100)
    {
      x = 100 - x
      y = 200 - y
    }
    return { x:x, y:y }
  }

  const getColourForPercent = (grade, max) => 
  {
    var range = 2 * max;
    var scale = 150 / range;
    var y = Math.floor((grade + max) * scale);

    if (y >= 150) {
      y = 149;
    } else if (y < 0) {
      y = 0;
    }

    return PercentColours[y];
  }

  const CGRectMake = (x, y, width, height) => {
    return {
      origin: {
        x: x,
        xe: x + width,
        y: y,
        ye: y + height,
      },
      size: {
        width: width,
        height: height,
      }
    };
  }

  const CGRectContainsPoint = (rect, x, y) => {
    var isMatchingXAxis = x > rect.origin.x && x < rect.origin.xe;
    var isMatchingYAxis = y > rect.origin.y && y < rect.origin.ye;

    return isMatchingXAxis && isMatchingYAxis;
  }

  const initZoneStats = () => {
    var zsobjs = [];
    var cols = 6;
    var tramWidth = 12.5;
    var w = 100 - (tramWidth * 2); // width - 2 x tramlines
    var dx = w / cols;
    var dy;
    var dy1 = 46 / 2;
    var dy2 = 53.5 / 2;
    var x;
    var y = 0;
    var n = 0;

    for (var r=0; r<8; r++) {
      for (var c=0; c<6; c++) {
        x = tramWidth + c * dx;
        dy = r < 2 || r > 5 ? dy1 : dy2;
        zsobjs[n++] = { rect: CGRectMake(x, y, dx, dy) };
      }
      y += dy;
    }

    var margin = 30;

    // back of top court
    x = tramWidth - margin;
    y = -margin;
    zsobjs[n++] = { rect: CGRectMake(x, y, margin, margin) };

    x += margin;
    for (var d=0; d<6; d++) {
      zsobjs[n++] = { rect: CGRectMake(x, y, dx, margin) };
      x += dx;
    }

    zsobjs[n++] = { rect: CGRectMake(x, y, margin, margin) };

    // left top
    zsobjs[n++] = { rect: CGRectMake(tramWidth - margin, 0, margin, 100) };

    // right top
    zsobjs[n++] = { rect: CGRectMake(tramWidth + w, 0, margin, 100) };

    // back of top court
    x = tramWidth - margin;
    y = 200;
    zsobjs[n++] = { rect: CGRectMake(x, y, margin, margin) };

    x += margin;
    for (var e=0; e<6; e++) {
      zsobjs[n++] = { rect: CGRectMake(x, y, dx, margin) };
      x += dx;
    }

    zsobjs[n++] = { rect: CGRectMake(x, y, margin, margin) };

    // left top
    zsobjs[n++] = { rect: CGRectMake(tramWidth - margin, 100, margin, 100) };

    // right top
    zsobjs[n++] = { rect: CGRectMake(tramWidth + w, 100, margin, 100) };

    for (var n=0; n<zsobjs.length; n++)
    {
      var zsobj = zsobjs[n]
      zsobj.count = 0
      zsobj.percent = 0
    }
    return zsobjs
  };

  const drawCourtLines = (ctx, scale, xmargin, ymargin, baseWidth, baseHeight, netPost, postWidth, tramWidth, serviceLine) =>
  {
    ctx.beginPath();

    // ctx.fillStyle = '#0044ff';
    // ctx.fillRect(xmargin, ymargin, baseWidth, baseHeight);

    ctx.lineWidth = scale * 2
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(xmargin, ymargin, baseWidth, baseHeight)

    ctx.moveTo(xmargin - netPost, ymargin + baseHeight / 2);
    ctx.lineTo(xmargin + baseWidth + netPost, ymargin + baseHeight / 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(xmargin - netPost - postWidth / 2, ymargin + baseHeight / 2 - postWidth / 2, postWidth, postWidth);
    ctx.fillRect(xmargin + baseWidth + netPost - postWidth / 2, ymargin + baseHeight / 2 - postWidth / 2, postWidth, postWidth);

    ctx.moveTo(xmargin + tramWidth, ymargin);
    ctx.lineTo(xmargin + tramWidth, ymargin + baseHeight);
    ctx.stroke();

    ctx.moveTo(xmargin + baseWidth - tramWidth, ymargin);
    ctx.lineTo(xmargin + baseWidth - tramWidth, ymargin + baseHeight);
    ctx.stroke();

    ctx.moveTo(xmargin + tramWidth, ymargin + serviceLine);
    ctx.lineTo(xmargin + baseWidth - tramWidth, ymargin + serviceLine);
    ctx.stroke();

    ctx.moveTo(xmargin + tramWidth, ymargin + baseHeight - serviceLine);
    ctx.lineTo(xmargin + baseWidth - tramWidth, ymargin + baseHeight - serviceLine);
    ctx.stroke();

    ctx.moveTo(xmargin + baseWidth / 2, ymargin + serviceLine);
    ctx.lineTo(xmargin + baseWidth / 2, ymargin + baseHeight - serviceLine);
    ctx.stroke();

    ctx.moveTo(xmargin + baseWidth / 2, ymargin);
    ctx.lineTo(xmargin + baseWidth / 2, ymargin + 10 * scale);
    ctx.stroke();

    ctx.moveTo(xmargin + baseWidth / 2, ymargin + baseHeight - 10 * scale);
    ctx.lineTo(xmargin + baseWidth / 2, ymargin + baseHeight);
    ctx.stroke();
  }

  const doFiltering = () =>
  {
    var selPlayers = getSels(allOptions, "Players")
    var selShots = getSels(allOptions, "Shots")
    var selDirections = getSels(allOptions, "Directions")
    var selWinners = getSels(allOptions, "Winners")
    var selForehands = getSels(allOptions, "Forehand")
    var selBackhands = getSels(allOptions, "Backhand")
    var selReaches = getSels(allOptions, "Reaches")
    var selSets = getSels(allOptions, "Sets")
    var selServes = getSels(allOptions, "Serves")
    var selOutcome = getSels(allOptions, "Outcome")
    var selRally = getSels(allOptions, "Rally Length")
    var selGames = getSels(allOptions, "Games")
    var selScores = getSels(allOptions, "Scores")

    for (var s = 0; s < sets.length; s++) {
      var set = sets[s]
      var isTiebreak = set.isTiebreak ? true : false
      // console.log('set', set)
      var serverId = 0
      var rallycount = 0
      var winnerId = 0
      var evs = []
      for (var e = 0; e < set.events.length; e++) {
        var event = set.events[e]
        event.isSetTiebreak = isTiebreak
        var skill = event.skill
        var match = null
        for (var m = 0; m < matches.length; m++) {
          var mm = matches[m]
          if (mm.id === event.matchId) {
            match = matches[m]
            break;
          }
        }

        if (skill === kServing) {
          event.serverId = event.playerGuid
          for (var n = 0; n < evs.length; n++) {
            evs[n].rallycount = rallycount
            evs[n].winnerId = winnerId
          }
          rallycount = 0
          evs = []
        }
        if (skill !== kServing && skill !== kReturning) {
          rallycount++
        }

        var result = event.result
        if (result === 0) {
          if (isFirstReturn(event)) {
          }
          else {
            if (isSecondServe(event)) {
            }
            if (event.playerGuid === match.player1Guid) {
              winnerId = match.player2Id;
            }
            else if (event.playerGuid === match.player2Id) {
              winnerId = match.player1Guid;
            }
          }
        }
        else if (result === 3) {
          if (event.playerGuid === match.player1Guid) {
            winnerId = match.player1Guid;
          }
          else if (event.playerGuid === match.player2Id) {
            winnerId = match.player2Id;
          }
        }

        if (match.player1Guid === playerGuid) {
          event.scoreA = player1GameScore(event)
          event.scoreB = player2GameScore(event)
          event.setScoreA = player1SetScore(event)
          event.setScoreB = player2SetScore(event)
        }
        else {
          event.scoreA = player2GameScore(event)
          event.scoreB = player1GameScore(event)
          event.setScoreA = player2SetScore(event)
          event.setScoreB = player1SetScore(event)
        }
        evs.push(event)
      }
    }

    var filteredevents = []

    // draw balls
    for (s = 0; s < sets.length; s++) {
      set = sets[s]
      // console.log('set', set)
      var lastShotReturn = false
      var lastShotAfterServe = false
      serverId = 0
      var lastserve = null;
      for (e = 0; e < set.events.length; e++) {
        event = set.events[e]
        if (event.skill === kServing)
        {
          lastserve = event;
        }
        // console.log('rallycount = ', event.rallycount)
        if (selSets[event.setNumber - 1].selected === false) continue;

        if (checkRallyLength(event, selRally) === false) continue;

        if (event.skill === kServing) {
          lastShotReturn = false
          lastShotAfterServe = false
          serverId = event.playerGuid
        }
        if (lastShotReturn && event.skill !== kServing && event.playerGuid === serverId) {
          event.isAfterServe = true
          lastShotAfterServe = true
        }
        lastShotReturn = (event.skill === kReturning)
        if (lastShotAfterServe && event.skill !== kServing && event.playerGuid !== serverId) event.isAfterReturn = true

        if (selPlayers[0].selected === false && event.playerGuid === playerGuid) continue
        if (selPlayers[1].selected === false && event.playerGuid !== playerGuid) continue
        if (checkShot(event, lastserve, selShots) === false) continue
        if (checkWinner(event, selWinners) === false) continue
        if (checkHandShot(event, selForehands, selBackhands) === false) continue
        if (checkDirection(event, selDirections) === false) continue
        if (checkServe(event, selServes) === false) continue
        if (checkOutcome(event, selOutcome) === false) continue
        if (checkReach(event, selReaches) === false) continue
        if (checkGameNumber(event, selGames) === false) continue
        if ((selPlayers[0].selected && selPlayers[1].selected === false) ||
          (selPlayers[0].selected === false && selPlayers[1].selected)) {
          var selplayerGuid = selPlayers[0].selected ? playerGuid : oppositionId
          // console.log('selplayerGuid', selplayerGuid)
          if (checkScores(event, selScores, selplayerGuid) === false) continue
        }

        filteredevents.push(event)
        // console.log(event)

      }
    }

    // FUDGE - check if the 2 arrays are different - otherwise we will run in a loop
    if (JSON.stringify(filteredevents) !== JSON.stringify(filteredEvents))
    {
      setFilteredEvents(filteredevents)
      handleFilteredEventsChanged(filteredevents)
    }
  }

  const draw = ctx => {
    const canvas = canvasRef.current
    canvas.width = window.innerWidth * 2
    canvas.height = window.innerHeight * 2 * 0.78
    // console.log('canvas width, height', canvas.width, canvas.height)
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight * 0.78}px`
    // console.log('ref.current clientWidth, clientHeight', ref.current.clientWidth, ref.current.clientHeight)

    var xmargin = 40;
    var ymargin = 80;
    var baseWidth = 216;
    var baseHeight = 468;
    var tramWidth = 27;
    var serviceLine = 108;
    // var serveZoneDepth = 40;
    var netPost = 18;
    var postWidth = 8;

    var scalew = ref.current.clientWidth / (baseWidth + xmargin * 2);
    var scaleh = ref.current.clientHeight / (baseHeight + ymargin * 2);
    var scale = scaleh < scalew ? scaleh * 2 : scalew * 2
    // console.log('scalew sclaeh scale', scalew, scaleh, scale)

    baseWidth = baseWidth * scale
    baseHeight = baseHeight * scale
    tramWidth = tramWidth * scale
    serviceLine = serviceLine * scale
    // serveZoneDepth = serveZoneDepth * scale
    netPost = netPost * scale
    postWidth = postWidth * scale
    xmargin = (ref.current.clientWidth * 2 - baseWidth) / 2
    ymargin = (ref.current.clientHeight * 2 - baseHeight) / 2
    // console.log('xmargin ymargin baseWidth baseHeight', xmargin, ymargin, baseWidth, baseHeight)

    ctx.fillStyle = '#0044ff';
    ctx.fillRect(xmargin, ymargin, baseWidth, baseHeight);

    drawCourtLines(ctx, scale, xmargin, ymargin, baseWidth, baseHeight, netPost, postWidth, tramWidth, serviceLine)

    var rad = 2 * scale


    if (displayMode === 0) {
      for (var n = 0; n < filteredEvents.length; n++) {
        var event = filteredEvents[n]
        var ballColor = getColor(event)
        var strokeColor = ballColor;
        if (event.skill === 1) {
          strokeColor = event.subskill1 === kReturnFirst ? '#ff00ff' : "magenta";
        } 
        else if (event.skill === 0) {
          strokeColor = event.subskill1 === kServeFirst ? '#ff00ff' : "magenta";
        } 
        var xd = 0
        var yd = 0
        if (showSource)
        {
          var pos = convertStartBallPosition(event.startBall)
          xs = xmargin + (pos.x * baseWidth) / 100;
          ys = ymargin + (pos.y * baseHeight / 2) / 100;
          pos = convertEndBallPosition(event.endBall)
          xd = xmargin + (pos.x * baseWidth) / 100;
          yd = ymargin + (pos.y * baseHeight / 2) / 100;
          const pp = interpolate({ x: xs, y: ys }, { x: xd, y: yd }, 0.01)
          drawArrowHead(ctx, {x:xs, y:ys}, pp, 8 * scale, scale/4, ballColor, strokeColor)
        }
        else
        {
          // pos = convertStartBallPosition(event.startBall)
          // xs = xmargin + (pos.x * baseWidth) / 100;
          // ys = ymargin + (pos.y * baseHeight / 2) / 100;
          // pos = convertEndBallPosition(event.endBall)
          // xd = xmargin + (pos.x * baseWidth) / 100;
          // yd = ymargin + (pos.y * baseHeight / 2) / 100;
          if (isNormalised)
          {
            var poss = convertBallPosition(event.startBall)
            var pose = convertBallPosition(event.endBall)
            if (poss.y < 100)
            {
              poss.x = 100 - poss.x;
              poss.y = 200 - poss.y;
              pose.x = 100 - pose.x;
              pose.y = 200 - pose.y;
            }
            xs = xmargin + (poss.x * baseWidth) / 100;
            ys = ymargin + (poss.y * baseHeight / 2) / 100;
            xd = xmargin + (pose.x * baseWidth) / 100;
            yd = ymargin + (pose.y * baseHeight / 2) / 100;
          }
          else
          {
            pos = convertBallPosition(event.startBall)
            xs = xmargin + (pos.x * baseWidth) / 100;
            ys = ymargin + (pos.y * baseHeight / 2) / 100;
            pos = convertBallPosition(event.endBall)
            xd = xmargin + (pos.x * baseWidth) / 100;
            yd = ymargin + (pos.y * baseHeight / 2) / 100;
          }

          ctx.beginPath();
          ctx.moveTo(xs - rad, ys - rad)
          ctx.lineTo(xd - rad, yd - rad)
          ctx.strokeStyle = "#808080"
          ctx.lineWidth = 0.5;
          ctx.stroke()
          ctx.closePath()

          ctx.beginPath();
          ctx.arc(xd - rad, yd - rad, rad * 2, 0, 2 * Math.PI);
          ctx.closePath()
          ctx.fillStyle = ballColor;
          ctx.fill();
          ctx.lineWidth = isSecondServe(event) ? 2 * scale : scale
          ctx.strokeStyle = isSecondServe(event) ? '#ff00ff' : '#808080';
          ctx.stroke();
        }
        // console.log('event.startBall, endBall, ballColor', event.startBall, event.endBall, ballColor)
      }
    }
    else if (displayMode == 2) {
      var zsobjs = initZoneStats()
      var max = 0
      for (var n=0; n<filteredEvents.length; n++)
      {
        event = filteredEvents[n]
        var x = 0
        var y = 0
        if (showSource)
        {
          var pos = convertStartBallPosition(event.startBall)
          x = pos.x
          y = pos.y
        }
        else
        {
          pos = convertEndBallPosition(event.endBall)
          x = pos.x 
          y = pos.y
        }
        for (var m=0; m<zsobjs.length; m++)
        {
          if (CGRectContainsPoint(zsobjs[m].rect, x, y))
          {
            zsobjs[m].count++
            max = zsobjs[m].count > max ? zsobjs[m].count : max
            break;
          }
        }
      }
      max = (max * 100) / filteredEvents.length
      for (var m=0; m<zsobjs.length; m++)
      {
        var zo = zsobjs[m]
        zo.percent = (zo.count * 100) / filteredEvents.length
        var xs = xmargin + (zo.rect.origin.x * baseWidth) / 100
        var xe = xmargin + (zo.rect.origin.xe * baseWidth) / 100
        var ys = ymargin + (zo.rect.origin.y * baseHeight / 2) / 100
        var ye = ymargin + (zo.rect.origin.ye * baseHeight / 2) / 100
        var w = xe - xs
        var h = ye - ys
        ctx.beginPath();
        ctx.rect(xs, ys, xe - xs, ye - ys);
        ctx.fillStyle = getColourForPercent(zo.percent, max)
        ctx.fill();
        ctx.lineWidth = 1
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        // console.log(zo.count.toString())
        if (zo.count > 0)
        {
          writeTextCenter({ctx: ctx, text: zo.count.toString(), x: xs, y: ys + h/2 - 10, width:w, textAlign: 'center', fontSize: 20*scale });
        }
      }
      drawCourtLines(ctx, scale, xmargin, ymargin, baseWidth, baseHeight, netPost, postWidth, tramWidth, serviceLine)
      // console.log(zsobjs)
    }
    else if (displayMode == 3) {
      var zsobjs = initZoneStats()
      var max = 0
      for (var n=0; n<filteredEvents.length; n++)
      {
        event = filteredEvents[n]
        var x = 0
        var y = 0
        if (showSource)
        {
          var pos = convertStartBallPosition(event.startBall)
          x = pos.x
          y = pos.y
        }
        else
        {
          pos = convertEndBallPosition(event.endBall)
          x = pos.x 
          y = pos.y
        }
        for (var m=0; m<zsobjs.length; m++)
        {
          if (CGRectContainsPoint(zsobjs[m].rect, x, y))
          {
            zsobjs[m].count++
            max = zsobjs[m].count > max ? zsobjs[m].count : max
            break;
          }
        }
      }
      max = (max * 100) / filteredEvents.length
      for (var m=0; m<zsobjs.length; m++)
      {
        var zo = zsobjs[m]
        zo.percent = Math.floor((zo.count * 100) / filteredEvents.length)
        var xs = xmargin + (zo.rect.origin.x * baseWidth) / 100
        var xe = xmargin + (zo.rect.origin.xe * baseWidth) / 100
        var ys = ymargin + (zo.rect.origin.y * baseHeight / 2) / 100
        var ye = ymargin + (zo.rect.origin.ye * baseHeight / 2) / 100
        var w = xe - xs
        var h = ye - ys
        ctx.beginPath();
        ctx.rect(xs, ys, xe - xs, ye - ys);
        ctx.fillStyle = getColourForPercent(zo.percent, max)
        ctx.fill();
        ctx.lineWidth = 1
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        // console.log(zo.count.toString())
        if (zo.count > 0)
        {
          writeTextCenter({ctx: ctx, text: zo.percent.toString(), x: xs, y: ys + h/2 - 20, width:w, textAlign: 'center', fontSize: 20*scale });
          writeTextCenter({ctx: ctx, text: "%", x: xs, y: ys + h/2, width:w, textAlign: 'center', fontSize: 20*scale });
        }
      }
      // console.log(zsobjs)
      drawCourtLines(ctx, scale, xmargin, ymargin, baseWidth, baseHeight, netPost, postWidth, tramWidth, serviceLine)
    }
    else if (displayMode == 1) {
    //   var points = []
    //   var max = 0
    //   for (var n = 0; n < filteredEvents.length; n++) {
    //     var event = filteredEvents[n]
    //     // var val = (event.result + 1) * 20
    //   var val = Math.floor(Math.random() * 100);
    //   var radius = Math.floor(Math.random() * 70);
    //     max = val > max ? val : max
    //     var endPosition = event.endBall !== null ? event.endBall.split(",") : [0, 0]
    //     var point = {
    //       x: xmargin + (endPosition[0] * baseWidth) / 100,
    //       y: ymargin + (endPosition[1] * baseHeight / 2) / 100,
    //       value: val,
    //       radius: radius
    // };
    //     points.push(point);

      //   ctx.beginPath();
      //   ctx.arc(point.x - rad, point.y - rad, rad * 2, 0, 2 * Math.PI);
      //   var ballColor = getColor(event)
      //   ctx.fillStyle = ballColor;
      //   ctx.fill();

      // }

      var points = [];
      var max = 0;
      var width = 840;
      var height = 400;
      var len = 300;

      while (len--) {
        var val = Math.floor(Math.random() * 100);
        // now also with custom radius
        var radius = Math.floor(Math.random() * 70);

        max = Math.max(max, val);
        var point = {
          x: Math.floor(Math.random() * width),
          y: Math.floor(Math.random() * height),
          value: val,
        };
        points.push(point);
      }

      const heatmap = heat("canvas").data(points).max(max);
      heatmap.draw();

      //max = 99
      // var data = {
      //   max: max,
      //   data: points
      // };

      // if (heatmapInstance === null) {
      //   var domElement = document.getElementById("heatmapf");
      //   var hi = h337.create({
      //     container: domElement
      //   })
      //   hi.setData(data);
      //   setHeatmapInstance(hi)
      // }
      // else {
      //   heatmapInstance.setData(data);
      // }
    }
  }

  useEffect(() => {

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    // var domElement = document.getElementById("heatmapf");
    // var hi = h337.create({
    //   container: domElement
    // })
    // setHeatmapInstance(hi)

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    doFiltering()
    //Our draw come here
    draw(context)


  }, [draw])

  if (sets === null)
  {
    return <></>
  }

  return (
    <div ref={ref}>
      {/* <div id="heatmapf" style={{"height" : "800px", "width" : "100%"}}></div> */}
      <canvas id="canvas" ref={canvasRef} />
    </div>
  )
}

export default TennisCourt