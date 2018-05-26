import React, {Component} from 'react'
import {render} from 'react-dom'

import Example from '../../src'

class Demo extends Component {
  render() {
    return <div>
      <h1>react-jsonpath-editor Demo</h1>
      <Example/>
      <p>This is some text behind the component. A Looooooooooooooooooooooooooooooooooooooooooooooooooooooong text</p>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
