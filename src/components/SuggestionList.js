import React, { Component } from 'react';

class SuggestionList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            selectedSuggestion: {}
        }

        this.keyboardControl = this.keyboardControl.bind(this);
    }

    componentDidMount(){
        document.addEventListener('keydown', this.keyboardControl, false);
    }
    
    componentWillUnmount(){
        document.removeEventListener('keydown', this.keyboardControl, false);
    }

    keyboardControl(e) {
        const UP = 38;
        const DOWN = 40;
        const ENTER = 13;
        if(e.keyCode === UP) {
            e.preventDefault();
            let isFirst = true;
            let tempSuggestion = null;
            for (const suggestion of this.props.suggestions) {
                if (this.state.selectedSuggestion.value === suggestion.value) {
                    if (isFirst) tempSuggestion = this.props.suggestions[this.props.suggestions.length - 1];
                    break;
                }
                if (!isFirst) tempSuggestion = suggestion
                isFirst = false;
            }
            const suggestionToSelect = tempSuggestion || this.props.suggestions[0];
            this.selectSuggestion(suggestionToSelect)
        } else if(e.keyCode === DOWN) {
            e.preventDefault();
            let isNext = false;
            let suggestionToSelect = null;
            for (const suggestion of this.props.suggestions) {
                if (this.state.selectedSuggestion.value === suggestion.value) {
                    isNext = true;
                    continue;
                }

                if (isNext) {
                    suggestionToSelect = suggestion;
                    break;
                }
            }

            if (!suggestionToSelect) {
                suggestionToSelect = this.props.suggestions[0]
            }
            this.selectSuggestion(suggestionToSelect)
        } else if(e.keyCode === ENTER) {
            e.preventDefault();
            this.triggerSuggestionSelected(this.state.selectedSuggestion)
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.suggestions && newProps.suggestions.length > 0) {
            this.selectSuggestion(newProps.suggestions[0])
        }
    }

    selectSuggestion(suggestion) {
        this.setState({selectedSuggestion: suggestion});
        if (this.props.onSelectSuggestionToSimulate) this.props.onSelectSuggestionToSimulate(suggestion);
    }

    triggerSuggestionSelected(suggestion) {
        this.props.onSelectSuggestion(suggestion);
    }

    render() { 
        const {selectedSuggestion} = this.state;
        return <ul>
            {this.props.suggestions.map((s,i) => 
                <li 
                    key={i}
                    className={selectedSuggestion.value === s.value ? 'selected' : ''}
                    onMouseOver={this.selectSuggestion.bind(this,s)}
                    onClick={this.triggerSuggestionSelected.bind(this,s)}
                >{s.value} - {s.description}</li>)}
        </ul>
    }
}
 
export default SuggestionList;