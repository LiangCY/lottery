export const ADD = 'ADD'
export const add = () => ({ type: ADD })

export const GENERATE_MAP = 'GENERATE_MAP'
export const GENERATE_CIRCLE = 'GENERATE_CIRCLE'
export const ADD_PLAYER = 'ADD_PLAYER'
export const REMOVE_PLAYER = 'REMOVE_PLAYER'
export const CHANGE_NUMBER = 'CHANGE_NUMBER'
export const generateMap = () => ({ type: GENERATE_MAP })
export const generateCircle = (payload) => ({ type: GENERATE_CIRCLE, payload })
export const addPlayer = (payload) => ({ type: ADD_PLAYER, payload })
export const removePlayer = (payload) => ({ type: REMOVE_PLAYER, payload })
export const changeNumber = (payload) => ({ type: CHANGE_NUMBER, payload })