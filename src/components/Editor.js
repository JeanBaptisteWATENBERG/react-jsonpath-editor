import React, { Component } from 'react';
import JSONEditor from 'jsoneditor';
import jp from 'jsonpath/jsonpath.min';
import ejs from 'easy-json-schema';
import { getSuggestions } from './suggestionBuilder';
import { getInputSelection, setCaretPosition, insertAtCursor } from './getInputSelection';
import SuggestionList from './SuggestionList';

import 'jsoneditor/dist/jsoneditor.min.css';
import './editor.css';

const defaultJsonToFilter = {
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
};

class Editor extends Component {

    constructor(props) {
        super(props);

        this.jsonEditorRef = React.createRef();
        this.onJsonChange = this.onJsonChange.bind(this);
        this.onSelectSuggestion = this.onSelectSuggestion.bind(this);
        this.onCaretChanged = this.onCaretChanged.bind(this);

        this.state = {
            jsonToFilter: props.json || defaultJsonToFilter,
            jsonSchema: null,
            suggestions: []
        };
    }

    componentDidMount() {
        this.jsonEditor = new JSONEditor(this.jsonEditorRef.current, { modes: ['tree', 'code'], search: false, change: this.onJsonChange });
        this.jsonEditor.set(this.state.jsonToFilter);
        this.initSchema(this.props);
        this.jsonEditor.expandAll();
        this.evalPathAndSuggestions(this.props);
        this.props.input.addEventListener('keyup',this.onCaretChanged);
        this.props.input.addEventListener('click',this.onCaretChanged);
        this.props.input.addEventListener('focus',this.onCaretChanged);
    }

    componentWillUnmount() {
        this.props.input.removeEventListener('keyup',this.onCaretChanged);
        this.props.input.removeEventListener('click',this.onCaretChanged);
        this.props.input.removeEventListener('focus',this.onCaretChanged);
    }

    onCaretChanged(e) {
        if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
            return;
        }
        this.evalPathAndSuggestions(this.props);
    }

    initSchema(props) {
        if (props.jsonSchema) {
            this.setState({ jsonSchema: props.jsonSchema });
            this.jsonEditor.setSchema(props.jsonSchema);
        } else {
            const schema = ejs(this.state.jsonToFilter);
            this.setState({ jsonSchema: schema });
        }
    }

    componentWillReceiveProps(newProps) {
        const promises = [];
        if (newProps.json) {
            const jsonToFilterStatePromise = new Promise((resolve) => {
                this.setState({ jsonToFilter: newProps.json }, () => {
                    resolve();
                });
                this.jsonEditor.set(newProps.json);
            });

            promises.push(jsonToFilterStatePromise);
        }
        if (newProps.jsonSchema) {
            this.jsonEditor.setSchema(newProps.jsonSchema);
        }

        // ensure state modifications to jsonToFilter did propagate
        if (promises.length > 0) {
            Promise.all(promises).then(() => {
                this.initSchema(newProps);
                this.evalPathAndSuggestions(newProps);
            });
        } else {
            this.initSchema(newProps);
            this.evalPathAndSuggestions(newProps);
        }
    }

    evalPathAndSuggestions(props) {
        if (props.jsonpath) {
            const suggestions = getSuggestions(
                props.jsonpath,
                getInputSelection(props.input).start,
                props.json || this.state.jsonToFilter
            );

            this.setState({ suggestions });

            try {
                const filteredJson = jp.query(this.state.jsonToFilter, props.jsonpath);
                this.jsonEditor.set(filteredJson);
                this.jsonEditor.expandAll();
            } catch (e) {
                this.jsonEditor.set(this.state.jsonToFilter);
                this.jsonEditor.expandAll();
            }
        }
    }

    onJsonChange() {
        this.setState({ jsonToFilter: this.jsonEditor.get() }, () => this.initSchema(this.props));
    }

    onSelectSuggestion(suggestion) {
        const initialJsonPathLength = this.props.jsonpath.length;

        const parentJsonPath = this.props.jsonpath.substring(0, this.props.jsonpath.lastIndexOf('.') + 1);
        const suggestionsFilter = this.props.jsonpath.substring(this.props.jsonpath.lastIndexOf('.') + 1);
        
        if (suggestion.value.includes(suggestionsFilter)) {
            this.props.onJsonPathChanged(parentJsonPath + suggestion.value);
        } else {
            this.props.onJsonPathChanged(insertAtCursor(this.props.input, suggestion.value));
        }


        if (suggestion.setCarretAt) {
            setCaretPosition(this.props.input, initialJsonPathLength + suggestion.setCarretAt);
        }
    }

    render() {
        const style = {
            top: this.props.position.y,
            left: this.props.position.x,
        };

        return <div className='react-json-path-editor-container' style={style} onMouseEnter={this.props.onMouseEnter} onMouseLeave={this.props.onMouseLeave}>
            <div className='react-json-path-editor-intellisense'>
                <SuggestionList
                    suggestions={this.state.suggestions}
                    onSelectSuggestion={this.onSelectSuggestion}
                // onSelectSuggestionToSimulate={}
                />
            </div>
            <div className='react-json-path-editor-jsoneditor-container' ref={this.jsonEditorRef}></div>
        </div>;
    }
}

export default Editor;