export const CLEAR_ALL = 'CLEAR_ALL'
export const GENERATE_MAP = 'GENERATE_MAP'
export const GENERATE_CIRCLE = 'GENERATE_CIRCLE'
export const END_ROUND = 'END_ROUND'

export const ADD_PLAYER = 'ADD_PLAYER'
export const REMOVE_PLAYER = 'REMOVE_PLAYER'
export const CHANGE_NUMBER = 'CHANGE_NUMBER'

export const ADD_LUCKY_GUY = 'ADD_LUCKY_GUY'

export const clearAll = () => ({ type: CLEAR_ALL })
export const generateMap = () => ({ type: GENERATE_MAP })
export const generateCircle = (payload) => ({ type: GENERATE_CIRCLE, payload })
export const endRound = () => ({ type: END_ROUND })

export const addPlayer = (payload) => ({ type: ADD_PLAYER, payload })
export const removePlayer = (payload) => ({ type: REMOVE_PLAYER, payload })
export const changeNumber = (payload) => ({ type: CHANGE_NUMBER, payload })

export const addLuckGuy = (payload) => ({ type: ADD_LUCKY_GUY, payload })