import React, {Component} from 'react';
import {connect} from 'react-redux'
import classNames from 'classnames'
import {Button, Input} from 'antd'

import './lottery.css'

import {addLuckGuy, startLastRound} from '../../redux/actions'

const awardCounts = [6, 4, 1, 1]

class Lottery extends Component {
  constructor(props) {
    super(props)
    this.state = {active: -1, moving: false}
  }

  getExitDots = () => {
    const {game: {dots, players, round}} = this.props
    const usedNumbers = players.map(p => p.number)
    if (round === 4) {
      return dots.filter(d => usedNumbers.includes(d.number) && !d.exit)
    } else {
      return dots.filter(d => usedNumbers.includes(d.number) && d.exit === round)
    }
  }

  getLuckyNumbers = () => {
    const {game: {lucky, round}} = this.props
    const luckyNumbers = lucky[round] || []
    return this.getExitDots().map(d => d.number).filter(n => luckyNumbers.includes(n))
  }

  getLotteryNumbers = () => {
    const {game: {lucky, round}} = this.props
    const luckyNumbers = lucky[round] || []
    return this.getExitDots().map(d => d.number).filter(n => !luckyNumbers.includes(n))
  }

  start = () => {
    if (this.state.moving) return
    const {game: {round, lucky}} = this.props
    const luckyNumbers = lucky[round] || []
    if (luckyNumbers.length >= awardCounts[round - 1]) return
    const total = this.getLotteryNumbers().length
    this.setState({moving: true})
    this.move(total)
  }

  move = (total) => {
    this.setState({active: Math.floor(Math.random() * total)})
    this.animation = requestAnimationFrame(() => this.move(total))
  }

  stop = () => {
    if (!this.state.moving) return
    cancelAnimationFrame(this.animation)
    const {game: {players}, dispatch} = this.props
    const {active} = this.state
    const otherNumbers = this.getLotteryNumbers()
    const outerNumbers = players.filter(p => p.isOuter).map(p => p.number)
    const availableNumbers = otherNumbers.filter(n => !outerNumbers.includes(n))
    const luckNumber = availableNumbers[active % availableNumbers.length]
    dispatch(addLuckGuy({number: luckNumber}))
    this.setState({active: -1, moving: false})
  }

  startLastRound = () => {
    if (this.state.moving) return
    const {game: {round, lucky}, dispatch} = this.props
    if (!lucky[round]) return
    dispatch(startLastRound())
  }

  enterLuckyNumber = () => {
    const {game: {round, lucky}, dispatch} = this.props
    const luckyNumbers = lucky[round] || []
    if (luckyNumbers.length >= awardCounts[round - 1]) return
    const number = parseInt(this.numberInput.input.value)
    if (!number) return
    const otherNumbers = this.getLotteryNumbers()
    if (!otherNumbers.includes(number)) return
    dispatch(addLuckGuy({number}))
    this.numberInput.input.value = ''
  }

  render() {
    const {game: {round, status}} = this.props
    const {active, moving} = this.state
    const luckyNumbers = this.getLuckyNumbers()
    const otherNumbers = this.getLotteryNumbers()
    return (
      <div className='lottery-page'>
        <div className='background'/>
        <div className='content'>
          <div className='round'>第{round}轮</div>
          {round < 4 &&
          <div className='actions'>
            <Button type='primary' size='large' style={{marginRight: 20}} disabled={moving} onClick={this.start}>开始</Button>
            <Button type='primary' size='large' ghost disabled={!moving} onClick={this.stop}>结束</Button>
          </div>
          }
          {round === 4 &&
          <div className='actions'>
            <Input size='large' placeholder='请输入中奖号码' onPressEnter={this.enterLuckyNumber} ref={input => this.numberInput = input}/>
          </div>
          }
          <div className='numbers'>
            <div className='others'>
              {otherNumbers.map((n, i) =>
                <span key={i} className={classNames('num-item', {active: active === i})}>{n}</span>
              )}
            </div>
            <div className='lucky'>
              {luckyNumbers.map((n, i) =>
                <span key={i} className='num-item'>{n}</span>
              )}
            </div>
          </div>
          {status === 'lottery' && round === 3 &&
          <div className='last-round'>
            <Button type='primary' size='large' onClick={this.startLastRound}>最后一轮</Button>
          </div>
          }
        </div>
      </div>
    )
  }
}

export default connect(({game}) => ({game}))(Lottery)
