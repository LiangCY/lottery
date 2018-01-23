import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Button, Modal, Input, Checkbox, message} from 'antd'

import './players.css'

import {addPlayer, removePlayer, changeNumber} from '../../redux/actions'

class Record extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '', number: '', isOuter: false,
      showNumbersModal: false
    }
  }

  add = () => {
    const {game: {round, players}, dispatch} = this.props
    const {id, number, isOuter} = this.state
    if (!id) return message.warn('请输入姓名', 1)
    if (!number || !number.trim()) return dispatch(addPlayer({id, isOuter}))
    const convertNumber = parseInt(number)
    if (!(convertNumber >= 1 && convertNumber <= 100)) return message.warn('请输入1至100之间的号码', 1)
    if (round > 0) return message.warn('游戏已开始，无法操作', 1)
    const usedNumbers = players.filter(p => p.number).map(p => p.number)
    if (usedNumbers.includes(convertNumber)) return message.warn('号码已经被使用', 1)
    dispatch(addPlayer({id, number: convertNumber, isOuter}))
    this.setState({id: '', number: '', isOuter: false})
  }

  update = (player) => {
    this.setState({id: player.id, number: player.number, isOuter: player.isOuter})
  }

  remove = (id) => {
    const {dispatch} = this.props
    Modal.confirm({
      title: '删除玩家',
      content: '确定要删除这个玩家吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch(removePlayer({id}))
      }
    })
  }

  isInside = ({number}) => {
    const {game: {dots, circle}} = this.props
    const dot = dots.find(d => d.number === number)
    const {x, y} = dot
    return (x - circle.x) * (x - circle.x) + (y - circle.y) * (y - circle.y) < circle.r * circle.r
  }

  getPlayerStatus = (player) => {
    const {game: {dots, lucky, round}} = this.props
    const playerDot = dots.find(dot => player.number && dot.number === player.number)
    if (!playerDot) return ''
    if (!playerDot.exit) {
      if (round === 4) {
        return (lucky[4] || []).includes(player.number) ? `最后一轮中奖` : `最后一轮淘汰`
      } else {
        return this.isInside(player) ? '圈内' : '圈外'
      }
    }
    const luckyNumbers = lucky[playerDot.exit] || []
    return luckyNumbers.includes(player.number) ? `第${playerDot.exit}轮中奖` : `第${playerDot.exit}轮淘汰`
  }

  getAvailableNumbers = (inside = true) => {
    const {game: {dots, circle, players}} = this.props
    const aliveDots = dots.filter(dot => !dot.exit)
    const aliveNumbers = aliveDots.map(dot => dot.number)
    const alivePlayers = players.filter(player => aliveNumbers.includes(player.number))
    const usedNumbers = alivePlayers.map(player => player.number)
    const inArr = []
    const outArr = []
    aliveDots.forEach(dot => {
      const {x, y, number} = dot
      if (usedNumbers.includes(number)) return
      if (!circle) return
      if ((circle.x - x) * (circle.x - x) + (circle.y - y) * (circle.y - y) <= circle.r * circle.r) {
        inArr.push(dot.number)
      } else {
        outArr.push(dot.number)
      }
    })
    return inside ? inArr : outArr
  }

  canChangeNumber = (player) => {
    const {game: {dots, round}} = this.props
    if (round === 4) return false
    const exitNumbers = dots.filter(dot => dot.exit).map(dot => dot.number)
    return !exitNumbers.includes(player.number)
  }

  handleChangeNumber = () => {
    const {selectingPlayer, selectedNumber} = this.state
    if (!selectingPlayer || !selectedNumber) return
    const successRate = selectingPlayer.isOuter ? 0 : 0.5
    if (Math.random() < successRate) {
      Modal.success({title: '换号结果', content: '恭喜您，换号成功~'})
      this.props.dispatch(changeNumber(({id: selectingPlayer.id, number: selectedNumber})))
    } else {
      Modal.error({title: '换号结果', content: '很抱歉，换号失败...'})
    }
    this.setState({selectingPlayer: null, selectedNumber: null, showNumbersModal: false})
  }

  render() {
    const {game: {round, players}} = this.props
    const {filterValue, showNumbersModal, selectedNumber, id, number, isOuter} = this.state
    const availableInside = this.getAvailableNumbers(true)
    const availableOutside = this.getAvailableNumbers(false)
    return (
      <div className='players-page'>
        {round === 0 &&
        <div className='add-player'>
          <div className='field'><span>姓名</span><Input value={id} onChange={e => this.setState({id: e.target.value})}/></div>
          <div className='field'><span>号码</span><Input value={number} onChange={e => this.setState({number: e.target.value})}/></div>
          <div className='field'>
            <Checkbox checked={isOuter} onChange={e => this.setState({isOuter: e.target.checked})}>外包</Checkbox>
          </div>
          <div className='actions'>
            <Button type='primary' onClick={this.add}>添加/更新</Button>
          </div>
        </div>
        }
        <div className='player-list'>
          <div className='filter'>
            <Input placeholder='输入姓名筛选' value={filterValue} onChange={e => this.setState({filterValue: e.target.value})}/>
          </div>
          <table>
            <thead>
            <tr>
              <th>姓名</th>
              <th>号码</th>
              <th>状态</th>
              <th>换号</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            {players.slice().reverse().filter(({id}) => id.includes(filterValue || '')).map((player, i) =>
              <tr key={i}>
                <td>{player.id}</td>
                <td>{player.number}</td>
                <td>{this.getPlayerStatus(player)}</td>
                {this.canChangeNumber(player) ?
                  <td style={{width: 72}}>
                    <Button type='primary' onClick={() => this.setState({selectingPlayer: player, showNumbersModal: true})}>换号</Button>
                  </td> :
                  <td/>
                }
                <td style={{width: 1, whiteSpace: 'nowrap'}}>
                  {round === 0 && <Button type='primary' ghost onClick={() => this.update(player)} style={{marginRight: 6}}>编辑</Button>}
                  {round === 0 && <Button type='danger' ghost onClick={() => this.remove(player.id)}>删除</Button>}
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
        <div className='available'>
          <div className='list list-in'>
            <div>圈内可选（{availableInside.length}）</div>
            <div>
              {availableInside.map((n, i) =>
                <span key={i} className='num-item'>{n}</span>
              )}
            </div>
          </div>
          <div className='list list-out'>
            <div>圈外可选（{availableOutside.length}）</div>
            <div>
              {availableOutside.map((n, i) =>
                <span key={i} className='num-item'>{n}</span>
              )}
            </div>
          </div>
        </div>
        <Modal title='换号' okText='确定' cancelText='取消' className='change-number-modal'
               visible={showNumbersModal}
               onOk={this.handleChangeNumber}
               onCancel={() => this.setState({showNumbersModal: false})}>
          <div className='selected'>当前选取：{selectedNumber}</div>
          <div className='numbers numbers-in'>
            <div className='title'>圈内可选</div>
            <div className='list'>
              {availableInside.map((n, i) =>
                <span key={i} onClick={() => this.setState({selectedNumber: n})}>{n}</span>
              )}
            </div>
          </div>
          <div className='numbers numbers-out'>
            <div className='title'>圈外可选</div>
            <div className='list'>
              {availableOutside.map((n, i) =>
                <span key={i} onClick={() => this.setState({selectedNumber: n})}>{n}</span>
              )}
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default connect(({game}) => ({game}))(Record)
