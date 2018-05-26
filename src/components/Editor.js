import React, { Component } from 'react';
import JSONEditor from 'jsoneditor';
import jp from 'jsonpath/jsonpath.min';

import 'jsoneditor/dist/jsoneditor.min.css';
import './editor.css';

const defaultJsonToFilter = { "store": {
    "book": [ 
      { "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      },
      { "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      },
      { "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      },
      { "category": "fiction",
        "author": "J. R. R. Tolkien",
        "title": "The Lord of the Rings",
        "isbn": "0-395-19395-8",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
}

class Editor extends Component {

    constructor(props) {
        super(props)

        this.jsonEditorRef = React.createRef();
        this.onJsonChange = this.onJsonChange.bind(this)

        this.state = {
            jsonToFilter: props.json || defaultJsonToFilter
        }
    }

    componentDidMount() {
        this.jsonEditor = new JSONEditor(this.jsonEditorRef.current, {modes: ['tree','code'], search: false, change: this.onJsonChange});
        this.jsonEditor.set(this.state.jsonToFilter)
        if(this.props.jsonSchema) this.jsonEditor.setSchema(this.props.jsonSchema)
        this.jsonEditor.expandAll()
    }

    componentWillReceiveProps(newProps) {
        if (newProps.json) {
            this.setState({jsonToFilter: newProps.json})
            this.jsonEditor.set(newProps.json)
        }
        if (newProps.jsonSchema) {
            this.jsonEditor.setSchema(newProps.jsonSchema)
        }
        if (newProps.jsonpath) {
            try {
                const filteredJson = jp.query(this.state.jsonToFilter, newProps.jsonpath);
                this.jsonEditor.set(filteredJson)
                this.jsonEditor.expandAll()
            } catch(e) {
                this.jsonEditor.set(this.state.jsonToFilter)
                this.jsonEditor.expandAll()
            }
        }
    }

    onJsonChange() {
        this.setState({jsonToFilter: this.jsonEditor.get()})
    }

    render() { 
        const style = {
            position: 'absolute',
            top: this.props.position.y,
            left: this.props.position.x,
            zIndex: 15,
            boxShadow: '5px 5px 5px 1px rgba(0, 0, 0, .2)',
            maxHeight: '300px',
            maxWidth: '300px'
        }

        return <div style={style} onMouseEnter={this.props.onMouseEnter} onMouseLeave={this.props.onMouseLeave}>
            <div className='jsoneditor-menu'>
                <button style={{backgroundImage: 'none'}} title='Begin Json path expression'>($)</button>
                <button style={{backgroundImage: 'none'}} title='filter an array'>([?])</button>
                <button style={{backgroundImage: 'none'}} title='Get an item in an array'>([])</button>
            </div>
            <div ref={this.jsonEditorRef}></div>
        </div>;
    }
}
 
export default Editor;