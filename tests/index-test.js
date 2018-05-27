import expect from 'expect'
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import JsonPathEditor from 'src/'

Enzyme.configure({ adapter: new Adapter() });

describe('JsonPathEditor', () => {

  it('should render an input', () => {
    const wrapper = mount(<JsonPathEditor />)
    expect(wrapper.find('input').length).toBe(1)
    
  })

  it('should unmount', () => {
    const wrapper = mount(<JsonPathEditor />)
    wrapper.unmount();
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

  it('should not close the editor when focus is lost and blur is disabled', () => {
    const wrapper = mount(<JsonPathEditor value='$' />);
    wrapper.find('input').simulate('focus')
    expect(wrapper.state().editorOpened).toEqual(true)
    wrapper.setState({isBlurEnable: false})
    wrapper.find('input').simulate('blur')
    expect(wrapper.state().editorOpened).toEqual(true)
  })

  it('should reflect prop value change to state', () => {
    const wrapper = mount(<JsonPathEditor value='$' />);
    expect(wrapper.state().value).toEqual('$')
    wrapper.setProps({value: '$.'})
    expect(wrapper.state().value).toEqual('$.')
  })

  it('should not reflect prop value change to state when value is null', () => {
    const wrapper = mount(<JsonPathEditor value='$' />);
    expect(wrapper.state().value).toEqual('$')
    wrapper.setProps({value: null})
    expect(wrapper.state().value).toEqual('$')
  })

  it('should not reflect prop value change to state when value is undefined', () => {
    const wrapper = mount(<JsonPathEditor value='$' />);
    expect(wrapper.state().value).toEqual('$')
    let value;
    wrapper.setProps({value})
    expect(wrapper.state().value).toEqual('$')
  })

  it('should not reflect prop change to state', () => {
    const wrapper = mount(<JsonPathEditor value='$' />);
    expect(wrapper.state().value).toEqual('$')
    wrapper.setProps({xx: '$.'})
    expect(wrapper.state().value).toEqual('$')
  })

  it('should close the editor when esc is pressed', () => {
    const wrapper = mount(<JsonPathEditor value='$' />);
    wrapper.find('input').simulate('focus')
    expect(wrapper.state().editorOpened).toEqual(true)
    wrapper.instance().escFunction({keyCode: 27})
    expect(wrapper.state().editorOpened).toEqual(false)
    expect(wrapper.state().isBlurEnable).toEqual(true)
  })

  it('should not close the editor when another key than esc is pressed', () => {
    const wrapper = mount(<JsonPathEditor value='$' />);
    wrapper.find('input').simulate('focus')
    expect(wrapper.state().editorOpened).toEqual(true)
    wrapper.instance().escFunction({keyCode: 28})
    expect(wrapper.state().editorOpened).toEqual(true)
  })

  it('should set isBlurEnabled accordingly', () => {
    const wrapper = mount(<JsonPathEditor value='$' />);
    wrapper.instance().controlBlur({isEnable: true})
    expect(wrapper.state().isBlurEnable).toEqual(true)
    wrapper.instance().controlBlur({isEnable: false})
    expect(wrapper.state().isBlurEnable).toEqual(false)
  })

  it('should dispatch the change when jsonPath is updated but no callback is defined in properties, neither jsonPath starts by $', () => {
    const wrapper = mount(<JsonPathEditor value='hello' />);
    wrapper.instance().changePath('world');
    expect(wrapper.state().editorOpened).toBe(false);
    expect(wrapper.state().value).toBe('world');
  })

  it('should dispatch the change from an event', () => {
    const wrapper = mount(<JsonPathEditor value='hello' />);
    wrapper.instance().onChange({target: {value:'world'}});
    expect(wrapper.state().editorOpened).toBe(false);
    expect(wrapper.state().value).toBe('world');
  })

  it('should dispatch the change when jsonPath is updated but no callback is defined in properties', () => {
    const wrapper = mount(<JsonPathEditor value='$' />);
    wrapper.instance().changePath('$.');
    expect(wrapper.state().editorOpened).toBe(true);
    expect(wrapper.state().value).toBe('$.');
  })

  it('should dispatch the change when jsonPath is updated', () => {
    const spy = expect.createSpy()
    const wrapper = mount(<JsonPathEditor value='$' onChange={spy}/>);
    wrapper.instance().changePath('$.');
    expect(wrapper.state().editorOpened).toBe(true);
    expect(wrapper.state().value).toBe('$.');
    expect(spy).toHaveBeenCalledWith('$.');
  })

  it('should focus input and enable blur when mouse leaves the editor', () => {
    const wrapper = mount(<JsonPathEditor value='$' />);
    wrapper.instance().onMouseLeaveFromEditor();
    expect(wrapper.state().isBlurEnable).toEqual(true);
  })
})
