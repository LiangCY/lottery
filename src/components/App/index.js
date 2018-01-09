import React, { Component } from 'react'
import { Link } from 'react-router'

class App extends Component {
  render () {
    return (
      <div className='app'>
        <nav className='nav'>
          <Link to='/'>Home</Link>
          <Link to='/game'>Game</Link>
          <Link to='/players'>Players</Link>
        </nav>
        <div className='container'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default App;
