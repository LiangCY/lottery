import React, { Component } from 'react';
import { connect } from 'react-redux'

import { addPlayer, removePlayer } from '../../redux/actions'

class Record extends Component {
  add = () => {
    const id = this.idInput.value
    const name = this.nameInput.value
    if (!id || !name) return
    const { game: { players }, dispatch } = this.props
    if (players.map(p => p.id).includes(id)) return
    dispatch(addPlayer({ id, name }))
  }

  remove = (id) => {
    const { dispatch } = this.props
    dispatch(removePlayer({ id }))
  }

  isInside = (id) => {
    const { game: { dots } } = this.props
    const dot = dots.find(d => d.p && d.p.id === id)
    return dot.hide
  }

  getAvailableNumbers = (id, inside = true) => {
    const { game: { dots } } = this.props
    return dots.filter(d => (inside ? d.hide : !d.hide) && !d.p)
  }

  render () {
    const { game: { players } } = this.props
    return (
      <div>
        <div>
          工号<input ref={input => this.idInput = input} />
          姓名<input ref={input => this.nameInput = input} />
          <button onClick={this.add}>+</button>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th>工号</th>
                <th>姓名</th>
                <th>数字</th>
                <th>圈内</th>
                <th>圈内可选</th>
                <th>圈外可选</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {players.slice().reverse().map(({ id, name, number }) =>
                <tr key={id}>
                  <td>{id}</td>
                  <td>{name}</td>
                  <td>{number}</td>
                  <td>{this.isInside(id) ? '是' : '否'}</td>
                  <td style={{ width: 300 }}>
                    {this.getAvailableNumbers(id).map((d, i) =>
                      <span key={i} style={{ display: 'inline-block', padding: '0 4px' }}>{d.n}</span>
                    )}
                  </td>
                  <td style={{ width: 300 }}>
                    {this.getAvailableNumbers(id, false).map((d, i) =>
                      <span key={i} style={{ display: 'inline-block', padding: '0 4px' }}>{d.n}</span>
                    )}
                  </td>
                  <td><a onClick={() => this.remove(id)}>x</a></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default connect(({ game }) => ({ game }))(Record);
