import React, {Component} from 'react'
import {render} from 'react-dom'

import JsonPathEditor from '../../src'
import { generateRandomJson } from './generateRandomJson';


class Demo extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      json: generateRandomJson(5)
    }
  }
  
  render() {
    const {json} = this.state;
    return <div>
      <h1>react-jsonpath-editor Demo</h1>
      <h2>With a default json</h2>
      <JsonPathEditor/>
      <h2>With a random json and a default value <button onClick={() => this.setState({json: generateRandomJson(5)})}>Click here to generate a new input json</button></h2>
      <JsonPathEditor value='$' json={json}/>
      <h2>With a default value</h2>
      <JsonPathEditor value='$.store.book'/>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
