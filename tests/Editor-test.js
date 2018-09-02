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


    it ('should set json when updated in editor', () => {
        const wraper = mount(<Editor input={document.createElement('input')} position={{x: 0, y:0}} json={{type: 'string'}} />);
        wraper.instance().jsonEditor.set({test: 'a'});
        wraper.instance().onJsonChange();
        expect(wraper.state().jsonToFilter).toEqual({test: 'a'});
    });

    it ('should dispatch selected suggestion', () =>  {
        const spy = expect.createSpy();
        const wraper = mount(<Editor input={document.createElement('input')} onJsonPathChanged={spy} jsonpath='abc' position={{x: 0, y:0}} json={{type: 'string'}} />);
        wraper.instance().onSelectSuggestion({value: 'test', description: 'test'});
        expect(spy).toHaveBeenCalledWith('test');
    });

    it ('should dispatch selected suggestion when suggestion has setCarretAt', () =>  {
        const spy = expect.createSpy();
        const wraper = mount(<Editor input={document.createElement('input')} onJsonPathChanged={spy} jsonpath='abc' position={{x: 0, y:0}} json={{type: 'string'}} />);
        wraper.instance().onSelectSuggestion({value: 'test', description: 'test', setCarretAt: 1});
        expect(spy).toHaveBeenCalledWith('test');
    });
});
