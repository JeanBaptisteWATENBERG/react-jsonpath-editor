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

    it('should set carret at 0', () => {
        const wrapper = mount(<JsonPathEditor />)
        let input = wrapper.instance().inputRef.current;
        setCaretPosition(input, 0);
        expect(getInputSelection(input)).toEqual({start: 0, end: 0});
    })

    it('should set carret at 0', () => {
        const wrapper = mount(<JsonPathEditor />)
        let input = wrapper.instance().inputRef.current;
        setCaretPosition(input, 0);
        expect(getInputSelection(input)).toEqual({start: 0, end: 0});
    })

    it('should set carret at 5', () => {
        const spyMove = expect.createSpy();
        const spySelect = expect.createSpy();
        const spy = expect.createSpy().andCall(function () {
            return {move: spyMove, select: spySelect}
          });
        setCaretPosition({createTextRange: spy}, 5);
        expect(spy).toHaveBeenCalledWith();
        expect(spyMove).toHaveBeenCalledWith('character', 5);
        expect(spySelect).toHaveBeenCalledWith();
    })

    it('should return text at position', () => {
        const wrapper = mount(<JsonPathEditor value='a'/>)
        let input = wrapper.instance().inputRef.current;
        expect(getInputSelection(input)).toEqual({start: 1, end: 1});
        const result = insertAtCursor(input, 'b');
        expect(result).toEqual('ab');
    })
})