import React, {Component} from 'react';
import {connect} from 'react-redux'
import classNames from 'classnames'
import {Button} from 'antd'

import './lottery.css'

import {addLuckGuy} from '../../redux/actions'

class Lottery extends Component {
  constructor(props) {
    super(props)
    this.state = {active: -1, moving: false}
  }

  getExitDots = () => {
    const {game: {dots, round}} = this.props
    return dots.filter(d => d.p && d.exit === round)
  }

  getLuckyNumbers = () => {
    const {game: {lucky, round}} = this.props
    const luckyNumbers = lucky[round] || []
    return this.getExitDots().map(d => d.p.number).filter(n => luckyNumbers.includes(n))
  }


  getLotteryNumbers = () => {
    const {game: {lucky, round}} = this.props
    const luckyNumbers = lucky[round] || []
    return this.getExitDots().map(d => d.p.number).filter(n => !luckyNumbers.includes(n))
  }

  start = () => {
    if (this.state.moving) return
    const total = this.getLotteryNumbers().length
    this.setState({moving: true})
    this.move(total)
  }

  move = (total) => {
    this.setState({active: (this.state.active + 0.5) % total})
    this.animation = requestAnimationFrame(() => this.move(total))
  }

  stop = () => {
    if (!this.state.moving) return
    cancelAnimationFrame(this.animation)
    const {dispatch} = this.props
    const {active} = this.state
    const index = Math.floor(active)
    const otherNumbers = this.getLotteryNumbers()
    const luckNumber = otherNumbers[index]
    dispatch(addLuckGuy({number: luckNumber}))
    this.setState({active: -1, moving: false})
  }

  render() {
    const {game: {round}} = this.props
    const {active, moving} = this.state
    const luckyNumbers = this.getLuckyNumbers()
    const otherNumbers = this.getLotteryNumbers()
    const index = Math.floor(active)
    return (
      <div className='lottery-page'>
        <div className='round'>第{round}轮</div>
        <div className='actions'>
          <Button type='primary' size='large' style={{marginRight: 20}} disabled={moving} onClick={this.start}>开始</Button>
          <Button type='primary' size='large' ghost disabled={!moving} onClick={this.stop}>结束</Button>
        </div>
        <div className='numbers'>
          <div className='others'>
            {otherNumbers.map((n, i) =>
              <span key={i} className={classNames('num-item', {active: index === i})}>{n}</span>
            )}
          </div>
          <div className='lucky'>
            {luckyNumbers.map((n, i) =>
              <span key={i} className='num-item'>{n}</span>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(({game}) => ({game}))(Lottery)
