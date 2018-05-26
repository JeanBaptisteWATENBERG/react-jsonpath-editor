import expect from 'expect'
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

import JsonPathEditor from 'src/'
import { getSuggestion } from '../src/components/suggestionBuilder';

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