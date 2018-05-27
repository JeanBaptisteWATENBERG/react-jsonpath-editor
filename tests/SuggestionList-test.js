import expect from 'expect';
import React from 'react'
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SuggestionList from '../src/components/SuggestionList';

Enzyme.configure({ adapter: new Adapter() });

describe('SuggestionList component', () => {
    it('should render a list', () => {
        const wrapper = mount(<SuggestionList suggestions={[]} />);
        expect(wrapper.find('ul').length).toEqual(1);
    })

    it('should render a list containing suggestions', () => {
        const wrapper = mount(<SuggestionList suggestions={[{value: 'test', description: 'test'}]} />);
        expect(wrapper.find('li').length).toEqual(1);
    })

    it('should select the first suggestion by default', () => {
        const wrapper = mount(<SuggestionList suggestions={[{value: 'test', description: 'test'}, {value: 'test1', description: 'test'}]} />);
        expect(wrapper.find('li').length).toEqual(2);
        expect(wrapper.state().selectedSuggestion).toEqual({value: 'test', description: 'test'});
    })

    it('should update the suggestion list when it receives new suggestions', () => {
        const wrapper = mount(<SuggestionList suggestions={[{value: 'test', description: 'test'}, {value: 'test1', description: 'test'}]} />);
        expect(wrapper.find('li').length).toEqual(2);
        expect(wrapper.state().selectedSuggestion).toEqual({value: 'test', description: 'test'});
        wrapper.setProps({suggestions: [{value: 'test2', description: 'test'}]})
        expect(wrapper.find('li').length).toEqual(1);
        expect(wrapper.state().selectedSuggestion).toEqual({value: 'test2', description: 'test'});
    })

    it('should set the selected suggestion accordingly when using keyboard', () => {
        // Given
        const UP = 38;
        const DOWN = 40;
        const ENTER = 13;
        const spy = expect.createSpy();
        const wrapper = mount(<SuggestionList onSelectSuggestion={spy} suggestions={[{value: 'test', description: 'test'}, {value: 'test1', description: 'test'}, {value: 'test2', description: 'test'}]} />);
        expect(wrapper.find('li').length).toEqual(3);
        expect(wrapper.state().selectedSuggestion).toEqual({value: 'test', description: 'test'});

        // When
        wrapper.instance().keyboardControl({keyCode: UP, preventDefault: () => {}});
        // Then
        expect(wrapper.state().selectedSuggestion).toEqual({value: 'test2', description: 'test'});

        // When
        wrapper.instance().keyboardControl({keyCode: DOWN, preventDefault: () => {}});
        // Then
        expect(wrapper.state().selectedSuggestion).toEqual({value: 'test', description: 'test'});

        // When
        wrapper.instance().keyboardControl({keyCode: DOWN, preventDefault: () => {}});
        // Then
        expect(wrapper.state().selectedSuggestion).toEqual({value: 'test1', description: 'test'});

        // When
        wrapper.instance().keyboardControl({keyCode: DOWN, preventDefault: () => {}});
        // Then
        expect(wrapper.state().selectedSuggestion).toEqual({value: 'test2', description: 'test'});

        // When
        wrapper.instance().keyboardControl({keyCode: UP, preventDefault: () => {}});
        // Then
        expect(wrapper.state().selectedSuggestion).toEqual({value: 'test1', description: 'test'});

        // When
        wrapper.instance().keyboardControl({keyCode: UP, preventDefault: () => {}});
        // Then
        expect(wrapper.state().selectedSuggestion).toEqual({value: 'test', description: 'test'});

        // When
        wrapper.instance().keyboardControl({keyCode: ENTER, preventDefault: () => {}});
        // Then
        expect(wrapper.state().selectedSuggestion).toEqual({value: 'test', description: 'test'});
        expect(spy).toHaveBeenCalledWith({value: 'test', description: 'test'});
    })
})
