import React, { Component } from 'react';
import jp from 'jsonpath/jsonpath.min';
import PropTypes from 'prop-types';
import './JsonPathPreviewer.css';

export const carriageReturnTag = '£CR£';
export const indentationIncrementationTag = '£INC£';
export const indentationDecrementationTag = '£DEC£';
export const highlightingTags = {
    start: '££TAGGED£',
    end: '£TAGGED££'
};

class JsonPathPreviewer extends Component {

    evalJsonPath(json, jsonPath) {
        try {
            return jp.paths(json, jsonPath);
        } catch(e) {
            return [];
        }
    }

    tagPartOfJsonToHighlight(jsonAsObject, paths, traversedPath = ['$']) {
        if (Array.isArray(jsonAsObject)) {
            const doesTraversingPathMatch = paths.filter(oneOfPathsToRetrieve => oneOfPathsToRetrieve.join(',') === traversedPath.join(',')).length > 0;
            const isALengthPathMatchingThisCollection = paths.filter(oneOfPathsToRetrieve => oneOfPathsToRetrieve.join(',') === [...traversedPath, 'length'].join(',')).length > 0;
            return `${carriageReturnTag + indentationIncrementationTag}${doesTraversingPathMatch ? highlightingTags.start : ''}[${carriageReturnTag + indentationIncrementationTag}${jsonAsObject.map((item, index) => 
                this.tagPartOfJsonToHighlight(item, paths, [...traversedPath, index])
            ).join(',' + carriageReturnTag)}${indentationDecrementationTag + carriageReturnTag}]${
                doesTraversingPathMatch ? highlightingTags.end  : ''
            }${isALengthPathMatchingThisCollection ? highlightingTags.start + '.length = ' + jsonAsObject.length + highlightingTags.end : ''}${indentationDecrementationTag}`;
        }

        if (typeof jsonAsObject === 'object') {
            const doesTraversingPathMatch = paths.filter(oneOfPathsToRetrieve => oneOfPathsToRetrieve.join(',') === traversedPath.join(',')).length > 0;
            return `${doesTraversingPathMatch ? highlightingTags.start : ''}{${carriageReturnTag + indentationIncrementationTag}${Object.keys(jsonAsObject).map(key => 
                `"${key}": ${this.tagPartOfJsonToHighlight(jsonAsObject[key], paths, [...traversedPath, key])}`
            ).join(',' + carriageReturnTag)}${indentationDecrementationTag + carriageReturnTag}}${doesTraversingPathMatch ? highlightingTags.end : ''}`;
        }
        
        const doesTraversingPathMatch = paths.filter(oneOfPathsToRetrieve => oneOfPathsToRetrieve.join(',') === traversedPath.join(',')).length > 0;
        
        if (typeof jsonAsObject === 'number') {
            return `${doesTraversingPathMatch ? highlightingTags.start : ''}${jsonAsObject}${doesTraversingPathMatch ? highlightingTags.end : ''}`;
        } else {
            return `"${doesTraversingPathMatch ? highlightingTags.start : ''}${jsonAsObject}${doesTraversingPathMatch ? highlightingTags.end : ''}"`;
        }
    }

    convertTaggedJsonAsReactComponent(taggedJSON) {
        let increments = 0;
        let highlightBlock = false;
        return taggedJSON.split(carriageReturnTag).map(line => {
            if (line.includes(indentationIncrementationTag)) increments++;
            if (line.includes(highlightingTags.start + '[') || line.includes(highlightingTags.start + '{')) highlightBlock = true;
            const toReturn = <React.Fragment>
                <p className={highlightBlock ? 'highlighted' : ''}>
                    {Array(increments).fill(<React.Fragment>&nbsp;</React.Fragment>)}
                    {line.replace(new RegExp(indentationIncrementationTag,'g'), '').replace(new RegExp(indentationDecrementationTag,'g'), '')
                        .split(highlightingTags.start).map(jsonPart => {
                            const parts = jsonPart.split(highlightingTags.end);
                            if (parts.length === 2) {
                                return <React.Fragment><span className='highlighted'>{parts[0]}</span>{parts[1]}</React.Fragment>;
                            }
                            return <React.Fragment>{jsonPart}</React.Fragment>;
                        })}
                </p>
            </React.Fragment>;
            if (line.includes(indentationDecrementationTag)) increments--;
            if (line.includes(']' + highlightingTags.end) || line.includes('}' + highlightingTags.end)) highlightBlock = false;
            return toReturn;
        });
    }

    render() {
        const {json, jsonPath} = this.props;

        const pathsEvaluated = this.evalJsonPath(json, jsonPath);

        return (
            <code>
                {this.convertTaggedJsonAsReactComponent(this.tagPartOfJsonToHighlight(json, pathsEvaluated))}
            </code>
        );
    }
}

JsonPathPreviewer.propTypes = {
    /** Json on which execute jsonPath */
    json: PropTypes.object.isRequired,
    /** JsonPath to preview on JSON */
    jsonPath: PropTypes.string.isRequired
};

export default JsonPathPreviewer;