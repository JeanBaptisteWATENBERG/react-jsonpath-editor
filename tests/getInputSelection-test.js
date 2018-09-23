import expect from 'expect';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import JsonPathEditor from 'src/';

Enzyme.configure({ adapter: new Adapter() });

import { setCaretPosition, getInputSelection, insertAtCursor } from '../src/components/getInputSelection';

describe('input selection helpers', () => {
    it('should return and set expected positions', () => {
        const wrapper = mount(<JsonPathEditor value='a'/>);
        let input = wrapper.instance().inputRef.current;
        expect(getInputSelection(input)).toEqual({start: 1, end: 1});
        setCaretPosition(input, 0);
    });

    it('should not set carret when element is null', () => {
        const wrapper = mount(<JsonPathEditor value='a' />);
        let input = wrapper.instance().inputRef.current;
        setCaretPosition(null, 0);
        expect(getInputSelection(input)).toEqual({start: 1, end: 1});
    });

    it('should set carret at 0', () => {
        const wrapper = mount(<JsonPathEditor />);
        let input = wrapper.instance().inputRef.current;
        setCaretPosition(input, 0);
        expect(getInputSelection(input)).toEqual({start: 0, end: 0});
    });

    it('should set carret at 0', () => {
        const wrapper = mount(<JsonPathEditor />);
        let input = wrapper.instance().inputRef.current;
        setCaretPosition(input, 0);
        expect(getInputSelection(input)).toEqual({start: 0, end: 0});
    });

    it('should set carret at 5', () => {
        const spyMove = expect.createSpy();
        const spySelect = expect.createSpy();
        const spy = expect.createSpy().andCall(function () {
            return {move: spyMove, select: spySelect};
        });
        setCaretPosition({createTextRange: spy}, 5);
        expect(spy).toHaveBeenCalledWith();
        expect(spyMove).toHaveBeenCalledWith('character', 5);
        expect(spySelect).toHaveBeenCalledWith();
    });

    it('should return text at position', () => {
        const wrapper = mount(<JsonPathEditor value='a'/>);
        let input = wrapper.instance().inputRef.current;
        expect(getInputSelection(input)).toEqual({start: 1, end: 1});
        const result = insertAtCursor(input, 'b');
        expect(result).toEqual('ab');
    });


    it('should getInputSelection for old browser and return 0 when no range', () => {
        const mockedRange = undefined;
        document.selection = {createRange: expect.createSpy()
            .andReturn(mockedRange)};
        const mockElement = {selectionStart: undefined, value:'hello'};
        const position = getInputSelection(mockElement);
        expect(position).toEqual({start: 0, end: 0});
    });

    it('should getInputSelection for old browser and return 0', () => {
        const mockedTextRange = {
            moveToBookmark: expect.createSpy(),
            collapse: expect.createSpy(),
            compareEndPoints: expect.createSpy().andReturn(2),
            moveStart: expect.createSpy().andReturn(0),
            moveEnd: expect.createSpy()
        };
        const mockElement = {selectionStart: undefined, value:'hello', createTextRange: expect.createSpy().andReturn(mockedTextRange)};
        const mockedRange = {parentElement: expect.createSpy().andReturn(mockElement),getBookmark: expect.createSpy()};
        document.selection = {createRange: expect.createSpy()
            .andReturn(mockedRange)};
        const position = getInputSelection(mockElement);
        expect(position).toEqual({start: mockElement.value.length, end: mockElement.value.length});
    });

    it('should getInputSelection for old browser and return 0 when managing range', () => {
        const mockedTextRange = {
            moveToBookmark: expect.createSpy(),
            collapse: expect.createSpy(),
            compareEndPoints: expect.createSpy().andReturn(-2),
            moveStart: expect.createSpy().andReturn(0),
            moveEnd: expect.createSpy().andReturn(0)
        };
        const mockElement = {selectionStart: undefined, value:'hello', createTextRange: expect.createSpy().andReturn(mockedTextRange)};
        const mockedRange = {parentElement: expect.createSpy().andReturn(mockElement),getBookmark: expect.createSpy()};
        document.selection = {createRange: expect.createSpy().andReturn(mockedRange)};
        const position = getInputSelection(mockElement);
        expect(position).toEqual({start: 0, end: 0});
    });

    it('should getInputSelection for old browser and return 0,len when managing selected range', () => {
        let isFirstCall = true;
        const mockedTextRange = {
            moveToBookmark: expect.createSpy(),
            collapse: expect.createSpy(),
            compareEndPoints: expect.createSpy().andCall(() => {
                if (isFirstCall) {
                    isFirstCall = false;
                    return -2;
                } else {
                    return 2;
                }
            }),
            moveStart: expect.createSpy().andReturn(0),
            moveEnd: expect.createSpy().andReturn(0)
        };
        const mockElement = {selectionStart: undefined, value:'hello', createTextRange: expect.createSpy().andReturn(mockedTextRange)};
        const mockedRange = {parentElement: expect.createSpy().andReturn(mockElement),getBookmark: expect.createSpy()};
        document.selection = {createRange: expect.createSpy().andReturn(mockedRange)};
        const position = getInputSelection(mockElement);
        expect(position).toEqual({start: 0, end: mockElement.value.length});
    });
});