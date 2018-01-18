import React, { Component } from 'react'
import { Link } from 'react-router'
import { Icon } from 'antd'

import './app.css'

class App extends Component {
  render () {
    return (
      <div className='app'>
        <nav className='left-menu'>
          <Link to='/players' className='menu-item' activeClassName='active'>
            <Icon type='team' />玩家
          </Link>
          <Link to='/game' className='menu-item' activeClassName='active'>
            <Icon type='environment-o' />地图
          </Link>
          <Link to='/lottery' className='menu-item' activeClassName='active'>
            <Icon type='pay-circle-o' />抽奖
          </Link>
        </nav>
        <div className='container'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default App;
