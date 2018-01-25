import React, {Component} from 'react';
import {connect} from 'react-redux'
import classNames from 'classnames'
import {Button, Modal, Icon, message} from 'antd'

import './game.css'

import {clearAll, generateMap, generateCircle, endRound} from '../../redux/actions'

class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {picking: false}
  }

  componentDidMount() {
    document.addEventListener('webkitfullscreenchange', this.handleFullScreenChange)
  }

  componentWillUnmount() {
    document.removeEventListener('webkitfullscreenchange', this.handleFullScreenChange)
  }

  clearAll = () => {
    const {dispatch} = this.props
    Modal.confirm({
      title: '清空数据',
      content: '确定要清空所有数据吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch(clearAll())
      }
    })
  }

  openPicker = () => {
    const {game: {players}} = this.props
    if (players.find(p => !p.number)) return message.warn('尚有玩家未分配号码', 1)
    this.setState({picking: true, centerX: 0, centerY: 0, radius: 0, pickEnabled: false})
  }

  pickCenter = (e) => {
    if (!this.state.picking) return
    const {pageX, pageY} = e
    const rect = this.mapDom.getBoundingClientRect()
    const centerX = ((pageX - rect.x) / 60).toFixed(2)
    const centerY = ((pageY - rect.y) / 60).toFixed(2)
    const {game: {circle, dots, round}} = this.props
    let radius = 0
    if (!circle) {
      radius = Math.min(centerX - 1, centerY - 1, 10 - centerX, 10 - centerY)
    } else {
      const centerDistance = Math.sqrt((centerX - circle.x) * (centerX - circle.x) + (centerY - circle.y) * (centerY - circle.y))
      radius = circle.r - centerDistance
    }
    radius = radius.toFixed(2)
    if (radius < 1) return this.setState({pickEnabled: false})
    let inCount = 0
    let outCount = 0
    dots.forEach(({x, y, exit}) => {
      if (exit) return
      if (Math.abs(x - centerX) <= radius && Math.abs(y - centerY) <= radius && (centerX - x) * (centerX - x) + (centerY - y) * (centerY - y) <= radius * radius) {
        inCount++
      } else {
        outCount++
      }
    })
    console.log('in circle dots', inCount)
    console.log('out circle dots', outCount)
    if ((round === 0 && inCount <= 36) || (round === 1 && (inCount <= 12 || outCount <= 20)) || (round === 2 && (inCount <= 4 || outCount <= 6))) {
      this.setState({pickEnabled: false})
    } else {
      this.setState({pickEnabled: true})
    }
    this.setState({centerX, centerY, radius})
  }

  generateCircle = () => {
    const {dispatch} = this.props
    const {picking, centerX, centerY, radius} = this.state
    if (!picking || !centerX || !centerY || !radius) return
    dispatch(generateCircle({x: centerX, y: centerY, r: radius}))
    this.setState({picking: false})
  }

  isInCircle = (x, y) => {
    const {game: {circle}} = this.props
    if (!circle) return true
    return (x - circle.x) * (x - circle.x) + (y - circle.y) * (y - circle.y) < circle.r * circle.r
  }

  hasPlayer = (number) => {
    const {game: {players}} = this.props
    return players.map(p => p.number).includes(number)
  }

  endRound = () => {
    const {dispatch} = this.props
    Modal.confirm({
      title: '结束本轮',
      content: '确定结束这轮游戏吗？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch(endRound())
      }
    })
  }

  fullScreenMap = () => {
    this.mapDom.webkitRequestFullScreen && this.mapDom.webkitRequestFullScreen()
  }

  handleFullScreenChange = () => {
    if (document.webkitIsFullScreen) {
      const ratioX = (window.innerWidth - 40) / 660
      const ratioY = (window.innerHeight - 40) / 660
      const ratio = Math.min(ratioX, ratioY)
      this.mapDom.style.transform = `scale(${ratio})`
    } else {
      this.mapDom.style.transform = ''
    }
  }

  render() {
    const {picking, centerX, centerY, radius, pickEnabled} = this.state
    const {game: {dots, circle, prevCircles, status, round}, dispatch} = this.props
    return (
      <div className='game'>
        <div className='init'>
          <div className='clear'>
            <Button type='danger' ghost onClick={this.clearAll}>清空数据</Button>
          </div>
          {(!dots || dots.length === 0) &&
          <div className='generate'>
            <Button type="primary" ghost onClick={() => dispatch(generateMap())}>生成坐标</Button>
          </div>
          }
          {dots && dots.length === 100 && !circle &&
          <div className='tips'>
            坐标已生成，编号将在第一个圈生成后显示
          </div>
          }
        </div>
        <div className='actions'>
          {status !== 'game' && dots.length > 0 && round < 3 &&
          <div className='center-picker'>
            {!picking ?
              <Button onClick={this.openPicker}>选取圆心</Button> :
              <div>
                <span className='hint'>请在地图中点击选取圆心</span>
                {centerX > 0 && centerY > 0 && <span className='circle-center'>圆心：{centerX}, {centerY}</span>}
                {radius > 0 && <span className='circle-radius'>半径：{radius}</span>}
                <Button onClick={this.generateCircle} type='primary' disabled={!pickEnabled}>生成圆圈</Button>
              </div>
            }
          </div>
          }
          <div className='end-round'>
            {status === 'game' && !!circle &&
            <Button onClick={this.endRound}>结束本轮</Button>
            }
          </div>
        </div>
        <div className='map' onClick={this.pickCenter} ref={div => this.mapDom = div}
             style={{cursor: picking ? 'pointer' : 'default'}}>
          {Array.from({length: 12}).map((v, i) =>
            <div key={i} className='line-h' style={{top: i * 60}}>
            </div>
          )}
          {Array.from({length: 12}).map((v, i) =>
            <div key={i} className='line-v' style={{left: i * 60}}>
            </div>
          )}
          {dots.map(({x, y, number, exit}, i) =>
            <span key={i} className={classNames('dot', {hide: round < 4 && this.isInCircle(x, y), hold: this.hasPlayer(number), exit: !!exit})}
                  style={{left: x * 60, top: y * 60, opacity: circle ? '1' : '0'}}>{number}</span>
          )}
          {circle &&
          <div className='circle' style={{
            width: circle.r * 2 * 60, height: circle.r * 2 * 60,
            left: (circle.x - circle.r) * 60, top: (circle.y - circle.r) * 60
          }}>
            <div className='radar'/>
          </div>
          }
          {prevCircles.map((c, i) =>
            <div key={i} className='prev-circle' style={{
              width: c.r * 2 * 60, height: c.r * 2 * 60,
              left: (c.x - c.r) * 60, top: (c.y - c.r) * 60
            }}>
              <div className='radar'/>
            </div>
          )}
        </div>
        <div className='fullscreen' onClick={this.fullScreenMap}>
          <Icon type="scan"/>全屏
        </div>
      </div>
    )
  }
}

export default connect(({game}) => ({game}))(Game);
