import expect from 'expect';
import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Editor from '../src/components/Editor';

Enzyme.configure({ adapter: new Adapter() });

describe('Editor component', () => {
    it ('should initialize with a schema', () => {
        const wraper = mount(<Editor input={document.createElement('input')} position={{x: 0, y:0}} jsonSchema={{type: 'string'}} />);
        expect(wraper.state().jsonSchema).toEqual({type: 'string'});
    });

    it ('should set json state', () => {
        const wraper = mount(<Editor input={document.createElement('input')} position={{x: 0, y:0}} jsonSchema={{type: 'string'}} />);
        wraper.setProps({json: {test: 'a'}});
        expect(wraper.state().jsonToFilter).toEqual({test: 'a'});
    });

    it ('should set json schema', () => {
        const wraper = mount(<Editor input={document.createElement('input')} position={{x: 0, y:0}} jsonSchema={{type: 'string'}} />);
        wraper.setProps({jsonSchema: {type: 'number'}});
        expect(wraper.state().jsonSchema).toEqual({type: 'number'});
    });

    it ('should dispatch selected suggestion', () =>  {
        //S
        const spy = expect.createSpy();
        const wraper = mount(<Editor input={document.createElement('input')} onJsonPathChanged={spy} jsonpath='abc' position={{x: 0, y:0}} json={{type: 'string'}} />);
        //E
        wraper.instance().onSelectSuggestion({value: 'test', description: 'test'});
        //V
        expect(spy).toHaveBeenCalledWith('test');
    });

    it ('should dispatch selected suggestion when suggestion has setCarretAt', () =>  {
        //S
        const spy = expect.createSpy();
        const wraper = mount(<Editor input={document.createElement('input')} onJsonPathChanged={spy} jsonpath='abc' position={{x: 0, y:0}} json={{type: 'string'}} />);
        //E
        wraper.instance().onSelectSuggestion({value: 'test', description: 'test', setCarretAt: 1});
        //V
        expect(spy).toHaveBeenCalledWith('test');
    });

    it ('should set json path with suggestion value correctly when jsonpath ends with a part of the suggestion', () =>  {
        //S
        const spy = expect.createSpy();
        const jsonPath = '$.te.es'; // es is included in 'test' which is the value of the suggestion
        const input = document.createElement('input');
        input.value = jsonPath;
        const wraper = mount(<Editor input={input} onJsonPathChanged={spy} jsonpath={jsonPath} position={{x: 0, y:0}} json={{type: 'string'}} />);
        //E
        wraper.instance().onSelectSuggestion({value: 'test', description: 'test', setCarretAt: 1});
        //V
        expect(spy).toHaveBeenCalledWith('$.te.test');
    });

    it ('should set json path with suggestion value correctly when jsonpath doesn\'t ends with a part of the suggestion', () =>  {
        //S
        const spy = expect.createSpy();
        const jsonPath = '$.te.re';
        const input = document.createElement('input');
        input.value = jsonPath;
        const wraper = mount(<Editor input={input} onJsonPathChanged={spy} jsonpath={jsonPath} position={{x: 0, y:0}} json={{type: 'string'}} />);
        //E
        wraper.instance().onSelectSuggestion({value: 'test', description: 'test', setCarretAt: 1});
        //V
        expect(spy).toHaveBeenCalledWith('$.te.retest');
    });

    it ('should evaluate suggestions when caret position is updated', () => {
        //S
        const wraper = mount(<Editor input={document.createElement('input')} position={{x: 0, y:0}} json={{type: 'string'}} />);
        const spy = expect.spyOn(wraper.instance(), 'evalPathAndSuggestions');
        //E
        wraper.instance().onCaretChanged({code: 'ArrowLeft'});
        //V
        expect(spy).toHaveBeenCalled();
    });


    it ('should not evaluate suggestions when caret position is updated due to up arrow', () => {
        //S
        const wraper = mount(<Editor input={document.createElement('input')} position={{x: 0, y:0}} json={{type: 'string'}} />);
        const spy = expect.spyOn(wraper.instance(), 'evalPathAndSuggestions');
        //E
        wraper.instance().onCaretChanged({code: 'ArrowUp'});
        //V
        expect(spy).toNotHaveBeenCalled();
    });

    it ('should not evaluate suggestions when caret position is updated due to down arrow', () => {
        //S
        const wraper = mount(<Editor input={document.createElement('input')} position={{x: 0, y:0}} json={{type: 'string'}} />);
        const spy = expect.spyOn(wraper.instance(), 'evalPathAndSuggestions');
        //E
        wraper.instance().onCaretChanged({code: 'ArrowDown'});
        //V
        expect(spy).toNotHaveBeenCalled(); 
    });
});
