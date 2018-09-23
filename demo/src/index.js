import React, {Component} from 'react';
import {render} from 'react-dom';

import JsonPathEditor from '../../src';
import Previewer from '../../src/components/JsonPathPreviewer';
import { generateRandomJson } from './generateRandomJson';


class Demo extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            json: generateRandomJson(5)
        };
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
            <br/>
            <br/>
            <br/>
            <Previewer json={{
                'store': {
                    'book': [
                        {
                            'category': 'reference',
                            'author': 'Nigel Rees',
                            'title': 'Sayings of the Century',
                            'price': 8.95
                        },
                        {
                            'category': 'fiction',
                            'author': 'Evelyn Waugh',
                            'title': 'Sword of Honour',
                            'price': 12.99
                        },
                        {
                            'category': 'fiction',
                            'author': 'Herman Melville',
                            'title': 'Moby Dick',
                            'isbn': '0-553-21311-3',
                            'price': 8.99
                        },
                        {
                            'category': 'fiction',
                            'author': 'J. R. R. Tolkien',
                            'title': 'The Lord of the Rings',
                            'isbn': '0-395-19395-8',
                            'price': 22.99
                        }
                    ],
                    'bicycle': {
                        'color': 'red',
                        'price': 19.95
                    }
                }
            }} jsonPath='$.store.book.length' />

        </div>;
    }
}

render(<Demo/>, document.querySelector('#demo'));
