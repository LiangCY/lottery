import React, { Component } from 'react';
import { connect } from 'react-redux'
import classNames from 'classnames'

import './game.css'

import { clearAll, generateMap, generateCircle } from '../../redux/actions'

class Game extends Component {
  generateCircle = () => {
    const { dispatch } = this.props
    dispatch(generateCircle({ x: Math.random() + 5, y: Math.random() + 5, r: 3.9 }))
  }

  render () {
    const { game: { dots, circle } } = this.props
    return (
      <div className='game'>
        {/*<div>*/}
        {/*<button onClick={() => dispatch(clearAll())}>清空数据</button>*/}
        {/*<button onClick={() => dispatch(generateMap())}>生成地图</button>*/}
        {/*</div>*/}
        <div>
          <button onClick={() => this.generateCircle()}>生成圆圈</button>
        </div>
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
            <span key={i} className={classNames('dot', { hide, hold: !!p, outer: p && p.isOuter })} title={p && p.name}
                  style={{ left: x * 60, top: y * 60 }}>{n}</span>
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
