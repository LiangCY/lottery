import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Button, Modal, Input, Checkbox} from 'antd'

import './players.css'

import {addPlayer, removePlayer, changeNumber} from '../../redux/actions'

class Record extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showNumbersModal: false
    }
  }

  add = () => {
    const id = this.idInput.input.value
    const name = this.nameInput.input.value
    const isOuter = this.isOuterInput.rcCheckbox.state.checked
    if (!id || !name) return
    const {game: {players}, dispatch} = this.props
    if (players.map(p => p.id).includes(id)) return
    dispatch(addPlayer({id, name, isOuter}))
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

  isInside = (id) => {
    const {game: {dots}} = this.props
    const dot = dots.find(d => d.p && d.p.id === id)
    return dot && dot.hide
  }

  getAvailableNumbers = (inside = true) => {
    const {game: {dots}} = this.props
    const array = dots.filter(d => (inside ? d.hide : !d.hide) && !d.p)
    array.sort((a, b) => a.n - b.n)
    return array
  }

  handleChangeNumber = () => {
    const {selectingPlayer, selectedNumber} = this.state
    if (!selectingPlayer || !selectedNumber) return
    this.props.dispatch(changeNumber(({id: selectingPlayer.id, number: selectedNumber})))
    this.setState({selectingPlayerId: null, selectedNumber: null, showNumbersModal: false})
  }

  render() {
    const {game: {players, lucky}} = this.props
    const {filterValue, showNumbersModal, selectedNumber} = this.state
    const availableInside = this.getAvailableNumbers(true)
    const availableOutside = this.getAvailableNumbers(false)
    return (
      <div className='players-page'>
        <div className='add-player'>
          <div className='field'><span>姓名</span><Input ref={input => this.nameInput = input}/></div>
          <div className='field'><span>工号</span><Input ref={input => this.idInput = input}/></div>
          <div className='field'>
            <Checkbox ref={input => this.isOuterInput = input}>外包</Checkbox>
          </div>
          <div className='actions'>
            <Button type='primary' onClick={this.add}>添加</Button>
          </div>
        </div>
        <div className='player-list'>
          <div className='filter'>
            <Input placeholder='输入姓名筛选' value={filterValue} onChange={e => this.setState({filterValue: e.target.value})}/>
          </div>
          <table>
            <thead>
            <tr>
              <th>工号</th>
              <th>姓名</th>
              <th>数字</th>
              <th>状态</th>
              <th>中奖信息</th>
              <th>换号</th>
              <th>删除</th>
            </tr>
            </thead>
            <tbody>
            {players.slice().reverse().filter(({name}) => name.includes(filterValue || '')).map((player, i) =>
              <tr key={i}>
                <td>{player.id}</td>
                <td>{player.name}</td>
                <td>{player.number}</td>
                <td>{player.exit ? `第${player.exit}轮淘汰` : this.isInside(player.id) ? '圈内' : '圈外'}</td>
                <td>{player.exit && lucky[player.exit].includes(player.number) && `第${player.exit}轮中奖`}</td>
                {player.isOuter || player.exit ?
                  <td/> :
                  <td style={{width: 72}}>
                    <Button type='primary' onClick={() => this.setState({selectingPlayer: player, showNumbersModal: true})}>换号</Button>
                  </td>
                }
                <td style={{width: 72}}><Button type='danger' ghost onClick={() => this.remove(player.id)}>删除</Button></td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
        <div className='available'>
          <div className='list list-in'>
            <div>圈内可选（{availableInside.length}）</div>
            <div>
              {availableInside.map((d, i) =>
                <span key={i} className='num-item'>{d.n}</span>
              )}
            </div>
          </div>
          <div className='list list-out'>
            <div>圈外可选（{availableOutside.length}）</div>
            <div>
              {availableOutside.map((d, i) =>
                <span key={i} className='num-item'>{d.n}</span>
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
              {availableInside.map((d, i) =>
                <span key={i} onClick={() => this.setState({selectedNumber: d.n})}>{d.n}</span>
              )}
            </div>
          </div>
          <div className='numbers numbers-out'>
            <div className='title'>圈外可选</div>
            <div className='list'>
              {availableOutside.map((d, i) =>
                <span key={i} onClick={() => this.setState({selectedNumber: d.n})}>{d.n}</span>
              )}
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default connect(({game}) => ({game}))(Record)
