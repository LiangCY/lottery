import {
  CLEAR_ALL, GENERATE_MAP, GENERATE_CIRCLE, END_ROUND,
  ADD_PLAYER, REMOVE_PLAYER, CHANGE_NUMBER,
  ADD_LUCKY_GUY
} from './actions'

const GAME_HANDLERS = {
  [CLEAR_ALL]: () => {
    return {dots: [], players: [], lucky: {}, round: 0, status: 'game'}
  },
  [GENERATE_MAP]: (state) => {
    const randomArray = Array.from({length: 100}, (v, i) => i + 1)
    randomArray.sort(() => Math.random() - 0.5)
    const dots = randomArray.map((n, i) => ({x: i % 10 + 1, y: Math.floor(i / 10) + 1, n}))
    return {...state, dots}
  },
  [GENERATE_CIRCLE]: (state, action) => {
    const {x, y} = action.payload
    const {circle} = state
    let r = 0
    if (!circle) {
      r = Math.min(x - 1, y - 1, 10 - x, 10 - y)
      r = Math.max(r, 1)
    } else {
      const centerDistance = Math.sqrt((x - circle.x) * (x - circle.x) + (y - circle.y) * (y - circle.y))
      r = circle.r - Math.max(centerDistance, 1)
    }
    const dots = state.dots.map((o) => {
      const {x: dx, y: dy} = o
      if (Math.abs(x - dx) <= r && Math.abs(y - dy) <= r && (dx - x) * (dx - x) + (dy - y) * (dy - y) <= r * r) {
        return {...o, hide: true}
      } else {
        return {...o, hide: false}
      }
    })
    return {...state, circle: {x, y, r}, prevCircle: state.circle, dots, round: state.round + 1, status: 'game'}
  },
  [END_ROUND]: (state) => {
    const {dots, players, round} = state
    const outNumbers = dots.filter(d => d.p && !d.hide && !d.exit).map(d => d.n)
    const newDots = dots.map((d) => {
      if (d.p && outNumbers.includes(d.p.number)) {
        return {...d, exit: round}
      }
      return d
    })
    const newPlayers = players.map((p) => {
      if (outNumbers.includes(p.number)) {
        return {...p, exit: round}
      }
      return p
    })
    return {...state, dots: newDots, players: newPlayers, status: 'lottery'}
  },

  [ADD_PLAYER]: (state, action) => {
    const player = action.payload
    const {dots} = state
    const emptyNumbers = dots.filter(d => !d.p && d.x !== 1 && d.x !== 10 && d.y !== 1 && d.y !== 10).map(d => d.n)
    let randomIndex = Math.floor(Math.random() * emptyNumbers.length)
    let number = emptyNumbers[randomIndex]
    if (player.isOuter) {
      const sideNumbers = dots.filter(d => !d.p && !d.hide && (d.x === 1 || d.x === 10 || d.y === 1 || d.y === 10)).map(d => d.n)
      randomIndex = Math.floor(Math.random() * sideNumbers.length)
      number = sideNumbers[randomIndex]
    }
    const players = state.players.concat({...player, number})
    const newDots = dots.map((d) => d.n === number ? {...d, p: {...player, number}} : d)
    return {...state, players, dots: newDots}
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
    const {players, dots} = state
    let player = null
    const newPlayers = players.map(p => {
      if (p.id === id) {
        player = {...p, number}
        return {...player}
      }
      return p
    })
    const newDots = dots.map((d) => {
      if (d.p && d.p.id === id) {
        return {...d, p: null}
      } else if (d.n === number) {
        return {...d, p: player}
      } else {
        return d
      }
    })
    return {...state, players: newPlayers, dots: newDots}
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
  }
}

const initialState = {
  dots: [],
  players: [],
  lucky: {},
  round: 0,
  status: 'game'
}

function game(state = initialState, action) {
  const handler = GAME_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

export const gameReducer = {game}