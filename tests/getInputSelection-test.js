import expect from 'expect'
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import JsonPathEditor from 'src/'

Enzyme.configure({ adapter: new Adapter() });

import { setCaretPosition, getInputSelection, insertAtCursor } from "../src/components/getInputSelection";

describe('input selection helpers', () => {
    it('should return and set expected positions', () => {
        const wrapper = mount(<JsonPathEditor value='a'/>)
        let input = wrapper.instance().inputRef.current;
        expect(getInputSelection(input)).toEqual({start: 1, end: 1});
        setCaretPosition(input, 0);
    })

    it('should return text at position', () => {
        const wrapper = mount(<JsonPathEditor value='a'/>)
        let input = wrapper.instance().inputRef.current;
        expect(getInputSelection(input)).toEqual({start: 1, end: 1});
        const result = insertAtCursor(input, 'b');
        expect(result).toEqual('ab');
    })
})