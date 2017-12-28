import React, { Component } from 'react';
import { connect } from 'react-redux'

import './game.css'

import { generateMap, generateCircle } from '../../redux/actions'

class Game extends Component {
  render () {
    const { game: { dots, circle }, dispatch } = this.props
    return (
      <div className='game'>
        <button onClick={() => dispatch(generateMap())}>生成地图</button>
        <button onClick={() => dispatch(generateCircle({ x: 6, y: 6, r: 4 }))}>生成圆圈</button>
        <div className='map'>
          {Array.from({ length: 12 }).map((v, i) =>
            <div key={i} className='line-h' style={{ top: i * 60 }}>
            </div>
          )}
          {Array.from({ length: 12 }).map((v, i) =>
            <div key={i} className='line-v' style={{ left: i * 60 }}>
            </div>
          )}
          {dots.map(({ x, y, n, p, hide }, i) =>
            <span key={i} className='dot' title={p && p.name}
                  style={{ left: x * 60, top: y * 60, color: p ? 'red' : 'black', display: hide ? 'none' : 'inline-block' }}>{n}</span>
          )}
          {circle &&
          <div className='circle' style={{
            width: circle.r * 2 * 60, height: circle.r * 2 * 60,
            left: (circle.x - circle.r) * 60, top: (circle.y - circle.r) * 60
          }} />
          }
        </div>
      </div>
    );
  }
}

export default connect(({ game }) => ({ game }))(Game);
