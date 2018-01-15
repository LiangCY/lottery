import React, {Component} from 'react';
import {connect} from 'react-redux'
import classNames from 'classnames'
import {Button, Modal} from 'antd'

import './game.css'

import {clearAll, generateMap, generateCircle, endRound} from '../../redux/actions'

class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      picking: false,
      centerX: 0,
      centerY: 0
    }
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
    this.setState({picking: true})
  }

  pickCenter = (e) => {
    if (!this.state.picking) return
    const {pageX, pageY} = e
    const rect = this.mapDom.getBoundingClientRect()
    const centerX = ((pageX - rect.x) / 60).toFixed(2)
    const centerY = ((pageY - rect.y) / 60).toFixed(2)
    this.setState({centerX, centerY})
  }

  generateCircle = () => {
    const {dispatch} = this.props
    const {picking, centerX, centerY} = this.state
    if (!picking || !centerX || !centerY) return
    dispatch(generateCircle({x: centerX, y: centerY}))
    this.setState({picking: false})
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

  render() {
    const {picking, centerX, centerY} = this.state
    const {game: {dots, circle, status}, dispatch} = this.props
    return (
      <div className='game'>
        <div className='init'>
          <div className='clear'>
            <Button type='danger' ghost onClick={this.clearAll}>清空数据</Button>
          </div>
          {(!dots || dots.length === 0) &&
          <div className='generate'>
            <Button type="primary" ghost onClick={() => dispatch(generateMap())}>生成地图</Button>
          </div>
          }
          {dots && dots.length === 100 && !circle &&
          <div className='tips'>
            坐标已生成，编号将在第一个圈生成后显示
          </div>
          }
        </div>
        <div className='center-picker'>
          {!picking ?
            <Button onClick={this.openPicker}>选取圆心</Button> :
            <div>
              <span className='hint'>请在地图中点击选取圆心</span>
              <span className='center-pos'>圆心坐标：{centerX}, {centerY}</span>
              <Button onClick={this.generateCircle} type='primary'>生成圆圈</Button>
            </div>
          }
        </div>
        <div className='end-round'>
          {status === 'game' && circle &&
          <Button onClick={this.endRound}>结束本轮</Button>
          }
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
          {dots.map(({x, y, n, p, hide, exit}, i) =>
            <span key={i} className={classNames('dot', {hide, hold: !!p, outer: p && p.isOuter, exit: !!exit})} title={p && p.name}
                  style={{left: x * 60, top: y * 60, opacity: circle ? '1' : '0'}}>{n}</span>
          )}
          {circle &&
          <div className='circle' style={{
            width: circle.r * 2 * 60, height: circle.r * 2 * 60,
            left: (circle.x - circle.r) * 60, top: (circle.y - circle.r) * 60
          }}/>
          }
        </div>
      </div>
    );
  }
}

export default connect(({game}) => ({game}))(Game);
