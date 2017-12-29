import { ADD, GENERATE_MAP, GENERATE_CIRCLE, ADD_PLAYER, REMOVE_PLAYER, CHANGE_NUMBER } from './actions'

const HANDLERS = {
  [ADD]: (state) => {
    return state + 1
  }
}

function count (state = 0, action) {
  const handler = HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

export const counterReducer = { count }

const GAME_HANDLERS = {
  [GENERATE_MAP]: (state) => {
    const randomArray = Array.from({ length: 100 }, (v, i) => i + 1)
    randomArray.sort(() => Math.random() - 0.5)
    const dots = randomArray.map((n, i) => ({ x: i % 10 + 1, y: Math.floor(i / 10) + 1, n }))
    return { ...state, dots }
  },
  [GENERATE_CIRCLE]: (state, action) => {
    const circle = action.payload
    const { x, y, r } = circle
    const dots = state.dots.map((o) => {
      const { x: dx, y: dy } = o
      if (Math.abs(x - dx) <= r && Math.abs(y - dy) <= r && (dx - x) * (dx - x) + (dy - y) * (dy - y) <= r * r) {
        console.log(o)
        return { ...o, hide: true }
      }
      return o
    })
    return { ...state, circle, dots }
  },
  [ADD_PLAYER]: (state, action) => {
    const player = action.payload
    const { dots } = state
    const emptyNumbers = dots.filter(d => !d.p).map(d => d.n)
    const randomIndex = Math.floor(Math.random() * emptyNumbers.length)
    const number = emptyNumbers[randomIndex]
    const players = state.players.concat({ ...player, number })
    const newDots = dots.map((d) => d.n === number ? { ...d, p: { ...player, number } } : d)
    return { ...state, players, dots: newDots }
  },
  [REMOVE_PLAYER]: (state, action) => {
    const { id } = action.payload
    const { players, dots } = state
    const player = players.find(p => p.id === id)
    const newDots = dots.map((d) => d.n === player.number ? { ...d, p: null } : d)
    const newPlayers = players.filter(p => p.id !== id)
    return { ...state, players: newPlayers, dots: newDots }
  },
  [CHANGE_NUMBER]: (state, action) => {
    const { id, number } = action.payload
    const { players, dots } = state
    let player = null
    const newPlayers = players.map(p => {
      if (p.id === id) {
        player = { ...p, number }
        return { ...player }
      }
      return p
    })
    const newDots = dots.map((d) => {
      if (d.p && d.p.id === id) {
        return { ...d, p: null }
      } else if (d.n === number) {
        return { ...d, p: player }
      } else {
        return d
      }
    })
    return { ...state, players: newPlayers, dots: newDots }
  }
}

const initialState = {
  dots: [],
  players: []
}

function game (state = initialState, action) {
  const handler = GAME_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

export const gameReducer = { game }