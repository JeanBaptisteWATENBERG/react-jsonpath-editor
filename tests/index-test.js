import expect from 'expect'
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import JsonPathEditor from 'src/'
import { getSuggestion } from '../src/components/suggestionBuilder';

Enzyme.configure({ adapter: new Adapter() });

describe('JsonPathEditor', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('should render an input', () => {
    render(<JsonPathEditor />, node, () => {
      expect(node.innerHTML).toContain('input')
    })
  })

  it('should have a default state', () => {
    const wrapper = mount(<JsonPathEditor />);
    expect(wrapper.state()).toEqual({
      value: '',
      editorOpened: false,
      isBlurEnable: true,
      editorPosition: {x:0,y:0}
    })
  })

  it('should set value according to value prop', () => {
    const wrapper = mount(<JsonPathEditor value='hello' />);
    expect(wrapper.state()).toEqual({
      value: 'hello',
      editorOpened: false,
      isBlurEnable: true,
      editorPosition: {x:0,y:0}
    })
  })

  it('should let the editor closed', () => {
    const wrapper = mount(<JsonPathEditor value='hello' />);
    wrapper.find('input').simulate('focus')
    expect(wrapper.state().editorOpened).toEqual(false)
  })

  it('should open the editor', () => {
    const wrapper = mount(<JsonPathEditor value='$' />);
    wrapper.find('input').simulate('focus')
    expect(wrapper.state().editorOpened).toEqual(true)
  })

  it('should close the editor when focus is lost', () => {
    const wrapper = mount(<JsonPathEditor value='$' />);
    wrapper.find('input').simulate('focus')
    expect(wrapper.state().editorOpened).toEqual(true)
    wrapper.find('input').simulate('blur')
    expect(wrapper.state().editorOpened).toEqual(false)
  })
})

describe('get suggestion', () => {
  it('should lists . suggestions', () => {
    // Given
    // When
    const suggestion = getSuggestion('$.', 2, { test: 0 });
    // Then
    expect(suggestion).toEqual([
      { value: 'test', description: 'property', scopes: ['object'] },
      {
        description: 'get all values',
        value: '*',
        scopes: ['[]', '.']
      }
    ])
  })

  it('should lists object suggestions', () => {
    // Given
    // When
    const suggestion = getSuggestion('$', 2, { test: 0 });
    // Then
    expect(suggestion).toEqual([
      {
        description: 'access a specific property',
        scopes: [
          'array',
          'object'
        ],
        value: '.'
      },
      {
        description: 'search recursively for a property',
        scopes: [
          'array',
          'object'
        ],
        value: '..'
      },
      {
        description: 'get all values',
        value: '.*',
        scopes: ['array', 'object']
      },
    ])
  })

  it('should lists array suggestions', () => {
    // Given
    // When
    const suggestion = getSuggestion('$', 2, [0, 1]);
    // Then
    expect(suggestion).toEqual([
      {
        description: 'pick a value in a collection',
        scopes: [
          'array'
        ],
        setCarretAt: 1,
        value: '[]'
      },
      {
        description: 'get collection size',
        scopes: [
          'array'
        ],
        value: '.length'
      },
      {
        description: 'access a specific property',
        scopes: [
          'array',
          'object'
        ],
        value: '.'
      },
      {
        description: 'search recursively for a property',
        scopes: [
          'array',
          'object'
        ],
        value: '..'
      },
      {
        description: 'get all values',
        value: '.*',
        scopes: ['array', 'object']
      },
    ])
  })

  it('should lists pick suggestions', () => {
    // Given
    // When
    const suggestion = getSuggestion('$.test[]', 6, { test: [0, 1] });
    // Then
    expect(suggestion).toEqual([
      {
        description: 'filter a collection',
        value: '?(@)',
        setCarretAt: 3,
        scopes: ['[]']
      },
      {
        description: 'select an item by it\'s index relatively to the size of the collection',
        value: '(@.length-1)',
        setCarretAt: 10,
        scopes: ['[]']
      },
      {
        description: 'select a range of item by their indexes',
        value: '0:1',
        setCarretAt: 0,
        scopes: ['[]']
      },
      {
        description: 'retrieves last item in a collection',
        value: '-1:',
        scopes: ['[]']
      },
      {
        description: 'get all values',
        value: '*',
        scopes: ['[]', '.']
      }
    ])
  })
})