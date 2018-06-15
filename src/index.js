import React, {Component} from 'react'
import Editor from './components/Editor'

/** 
 * props :
 *  - inputProps? -- properties to set on input tag
 *  - value? -- input value
 *  - onChange? -- function called when input value change
 *  - json? -- json to edit
 *  - editorPosition? -- {x,y} overrides the position of the editor 
*/
export default class extends Component {

  constructor(props) {
    super(props)

    this.inputRef = React.createRef()

    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.onChange = this.onChange.bind(this)
    this.changePath = this.changePath.bind(this)
    this.disableBlur = this.controlBlur.bind(this, {isEnable: false})
    this.enableBlur = this.controlBlur.bind(this, {isEnable: true})
    this.escFunction = this.escFunction.bind(this)
    this.onMouseLeaveFromEditor = this.onMouseLeaveFromEditor.bind(this)

    this.state = {
      value: props.value || '',
      editorOpened: false,
      isBlurEnable: true,
      editorPosition: {x:0,y:0}
    }
  }

  componentDidMount(){
    document.addEventListener('keydown', this.escFunction, false);
    window.addEventListener('scroll', this.updateEditorPosition, false);
    window.addEventListener('resize', this.updateEditorPosition, false);
    this.updateEditorPosition();
  }

  componentWillUnmount(){
    document.removeEventListener('keydown', this.escFunction, false);
    window.removeEventListener('scroll', this.updateEditorPosition, false);
    window.removeEventListener('resize', this.updateEditorPosition, false);
  }

  updateEditorPosition() {
    if (this.props.editorPosition) {
      this.setState({editorPosition: this.props.editorPosition});
    } else if (this.inputRef && this.inputRef.current) {
      const inputBoundRect = this.inputRef.current.getBoundingClientRect();
      this.setState({editorPosition: {x:inputBoundRect.left, y: inputBoundRect.top + inputBoundRect.height}});
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value != null && typeof newProps.value != 'undefined')  {
      this.setState({value: newProps.value})
    }
  }

  escFunction(event){
    if(event.keyCode === 27) {
      this.setState({editorOpened: false, isBlurEnable: true})
    }
  }

  controlBlur({isEnable}) {
    this.setState({isBlurEnable: isEnable})
  }

  onMouseLeaveFromEditor() {
    this.inputRef.current.focus()
    this.enableBlur()
  }

  onChange(e) {
    this.changePath(e.target.value)
  }

  changePath(newValue) {
    if (this.props.onChange) this.props.onChange(newValue)
    if (newValue.startsWith('$')) this.setState({editorOpened: true})
    else this.setState({editorOpened: false})
    this.setState({value: newValue})
  }

  onFocus() {
    if (this.inputRef.current.value.startsWith('$')) this.setState({editorOpened: true})
  }

  onBlur() {
    if (this.state.isBlurEnable) {
      this.setState({editorOpened: false})
    }
  }

  render() {
    const {inputProps, json} = this.props;
    const {value, editorOpened, editorPosition} = this.state;
    return <React.Fragment>
      <input ref={this.inputRef} type='text' value={value} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} {...inputProps} />
      {editorOpened && <Editor 
        input={this.inputRef.current}
        position={editorPosition}
        jsonpath={value}
        json={json}
        onJsonPathChanged={this.changePath}
        onMouseEnter={this.disableBlur}
        onMouseLeave={this.onMouseLeaveFromEditor} />}
    </React.Fragment>
  }
}
