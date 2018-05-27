import expect from 'expect';
import React from 'react'
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Editor from '../src/components/Editor';

Enzyme.configure({ adapter: new Adapter() });

describe('Editor component', () => {
    it ('should initialize with a schema', () => {
        const wraper = mount(<Editor position={{x: 0, y:0}} jsonSchema={{type: 'string'}} />)
        expect(wraper.state().jsonSchema).toEqual({type: 'string'})
    })
});
