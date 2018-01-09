import React, { Component } from 'react';
import { connect } from 'react-redux'

import './players.css'

import { addPlayer, removePlayer, changeNumber } from '../../redux/actions'

class Record extends Component {
  add = () => {
    const id = this.idInput.value
    const name = this.nameInput.value
    const isOuter = this.isOuterInput.checked
    if (!id || !name) return
    const { game: { players }, dispatch } = this.props
    if (players.map(p => p.id).includes(id)) return
    dispatch(addPlayer({ id, name, isOuter }))
  }

  remove = (id) => {
    const { dispatch } = this.props
    dispatch(removePlayer({ id }))
  }

  isInside = (id) => {
    const { game: { dots } } = this.props
    const dot = dots.find(d => d.p && d.p.id === id)
    return dot && dot.hide
  }

  getAvailableNumbers = (inside = true) => {
    const { game: { dots } } = this.props
    const array = dots.filter(d => (inside ? d.hide : !d.hide) && !d.p)
    array.sort((a, b) => a.n - b.n)
    return array
  }

  changeNumber = (id, number) => {
    this.props.dispatch(changeNumber(({ id, number })))
  }

  render () {
    const { game: { players } } = this.props
    const availableInside = this.getAvailableNumbers(true)
    const availableOutside = this.getAvailableNumbers(false)
    return (
      <div className='players-page'>
        <div className='add-player'>
          <div className='field'><span>姓名</span><input ref={input => this.nameInput = input} /></div>
          <div className='field'><span>工号</span><input ref={input => this.idInput = input} /></div>
          <div className='field'>
            <label><span>外包</span><input ref={input => this.isOuterInput = input} type='checkbox' /></label>
          </div>
          <div className='actions'>
            <button onClick={this.add}>+</button>
          </div>
        </div>
        <div className='player-list'>
          <table>
            <thead>
              <tr>
                <th>工号</th>
                <th>姓名</th>
                <th>数字</th>
                <th>圈内</th>
                <th>删除</th>
                <th>换号</th>
              </tr>
            </thead>
            <tbody>
              {players.slice().reverse().map(({ id, name, isOuter, number }) =>
                <tr key={id}>
                  <td>{id}</td>
                  <td>{name}</td>
                  <td>{number}</td>
                  <td>{this.isInside(id) ? '是' : '否'}</td>
                  <td><a onClick={() => this.remove(id)}>x</a></td>
                  {isOuter ?
                    <td /> :
                    <td className='numbers'>
                      <div className='inside'>
                        {availableInside.map((d, i) =>
                          <a key={i} onClick={() => this.changeNumber(id, d.n)}>{d.n}</a>
                        )}
                      </div>
                      <div className='outside'>
                        {availableOutside.map((d, i) =>
                          <a key={i} onClick={() => this.changeNumber(id, d.n)}>{d.n}</a>
                        )}
                      </div>
                    </td>
                  }
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className='available'>
          <div>
            <div>圈内可选</div>
            <div>
              {availableInside.map((d, i) =>
                <span key={i} style={{ display: 'inline-block', width: 40 }}>{d.n}</span>
              )}
            </div>
          </div>
          <div>
            <div>圈外可选</div>
            <div>
              {availableOutside.map((d, i) =>
                <span key={i} style={{ display: 'inline-block', width: 40 }}>{d.n}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(({ game }) => ({ game }))(Record)
