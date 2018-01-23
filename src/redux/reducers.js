import {
  CLEAR_ALL, GENERATE_MAP, GENERATE_CIRCLE, END_ROUND,
  ADD_PLAYER, REMOVE_PLAYER, CHANGE_NUMBER,
  ADD_LUCKY_GUY, LAST_ROUND
} from './actions'


const numbers = Array.from({length: 100}, (v, i) => i + 1)

const numbersInCounts = [20, 6, 3]

const GAME_HANDLERS = {
  [CLEAR_ALL]: (state) => {
    return {...state, dots: [], circle: null, prevCircle: null, lucky: {}, round: 0, status: ''}
  },
  [GENERATE_MAP]: (state) => {
    const dots = Array.from({length: 100}).map((n, i) => ({x: i % 10 + 1, y: Math.floor(i / 10) + 1}))
    return {...state, dots}
  },
  [GENERATE_CIRCLE]: (state, action) => {
    const {x, y, r} = action.payload
    const {dots: prevDots, circle, players, round} = state
    const numbersInCount = numbersInCounts[round]
    const aliveNumbers = !circle ? numbers : prevDots.filter(d => !d.exit).map(d => d.number)
    const usedNumbers = players.map(p => p.number)
    const unusedNumbers = aliveNumbers.filter(n => !usedNumbers.includes(n))
    const alivePlayers = players.filter(player => aliveNumbers.includes(player.number))
    const shuffled = alivePlayers.filter(p => !p.isOuter).sort(() => Math.random() - 0.5).concat(alivePlayers.filter(p => p.isOuter))
    const inNumbers = shuffled.slice(0, numbersInCount).map(p => p.number)
    const outNumbers = shuffled.slice(numbersInCount).map(p => p.number)
    let inIndex = 0
    let outIndex = 0
    let unusedIndex = 0
    const dots = state.dots.slice().sort(() => Math.random() - 0.5).map((dot) => {
      const {x: dx, y: dy, exit} = dot
      if (exit) return dot
      if (Math.abs(x - dx) <= r && Math.abs(y - dy) <= r && (dx - x) * (dx - x) + (dy - y) * (dy - y) <= r * r) {
        if (inIndex < inNumbers.length) {
          return {...dot, number: inNumbers[inIndex++]}
        } else {
          return {...dot, number: unusedNumbers[unusedIndex++]}
        }
      } else {
        if (outIndex < outNumbers.length) {
          return {...dot, number: outNumbers[outIndex++]}
        } else {
          return {...dot, number: unusedNumbers[unusedIndex++]}
        }
      }
    })
    return {...state, circle: {x, y, r}, prevCircle: state.circle, dots, round: state.round + 1, status: 'game'}
  },
  [END_ROUND]: (state) => {
    const {dots: prevDots, circle: {x, y, r}, round} = state
    const dots = prevDots.map((dot) => {
      const {x: dx, y: dy} = dot
      if ((Math.abs(x - dx) > r || Math.abs(y - dy) > r || (dx - x) * (dx - x) + (dy - y) * (dy - y) > r * r) && !dot.exit) {
        return {...dot, exit: round}
      } else {
        return dot
      }
    })
    return {...state, dots, status: 'lottery'}
  },

  [ADD_PLAYER]: (state, action) => {
    const player = action.payload
    const prevPlayers = state.players
    const index = prevPlayers.map(p => p.id).indexOf(player.id)
    let players = prevPlayers
    if (index < 0) {
      players = prevPlayers.concat(player)
    } else {
      players = prevPlayers.slice(0, index).concat(player).concat(prevPlayers.slice(index + 1))
    }
    return {...state, players}
  },
  [REMOVE_PLAYER]: (state, action) => {
    const {id} = action.payload
    const {players, dots} = state
    const player = players.find(p => p.id === id)
    const newDots = dots.map((d) => d.n === player.number ? {...d, p: null} : d)
    const newPlayers = players.filter(p => p.id !== id)
    return {...state, players: newPlayers, dots: newDots}
  },
  [CHANGE_NUMBER]: (state, action) => {
    const {id, number} = action.payload
    const {players: prevPlayers} = state
    const players = prevPlayers.map(player => {
      if (player.id === id) {
        return {...player, number}
      }
      return player
    })
    return {...state, players}
  },

  [ADD_LUCKY_GUY]: (state, action) => {
    const {number} = action.payload
    const {lucky, round} = state
    if (!lucky[round]) {
      return {...state, lucky: {...lucky, [round]: [number]}}
    } else {
      const numbers = lucky[round].concat(number)
      return {...state, lucky: {...lucky, [round]: numbers}}
    }
  },
  [LAST_ROUND]: (state) => {
    const {round} = state
    return {...state, round: round + 1}
  }
}

const initialState = {
  dots: [],
  players: [],
  lucky: {},
  round: 0,
  status: ''
}

function game(state = initialState, action) {
  const handler = GAME_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

export const gameReducer = {game}