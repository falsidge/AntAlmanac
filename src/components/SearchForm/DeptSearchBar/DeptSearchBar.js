import React, { Component } from 'react';
import depts from './depts';
import Select from 'react-select';

class DeptSearchBar extends Component {
  constructor(props) {
    super(props);
    const inputStarter = props.label === null ? '' : props.label;
    this.state = {
      inputVal: inputStarter,
    };
    // this.state = { filteredItems: depts }; // Inital state is the whole list of depts
    this.handleStateChange = this.handleStateChange.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextProps !== this.props && nextProps.dept === null) {
      this.setState({ inputVal: '' });
      console.log('here to reset');
    }
    return nextState !== this.state || nextProps !== this.props;
  }

  handleStateChange(changes) {
    if (typeof changes.inputValue === 'string') {
      // Match depts by label (ignoring case) and filter out the non matching depts
      const filteredItems = depts.filter((item) =>
        item.label.toLowerCase().includes(changes.inputValue.toLowerCase())
      );
      this.setState({ filteredItems });
    }
  }

  changeInput = (newInput, action) => {
    this.setState({ inputVal: newInput });
  };

  render() {
    console.log(this.props.dept);
    return (
      <Select
        options={depts}
        isSearchable
        isClearable
        defaultValue={this.props.dept}
        onChange={this.props.setDept}
        inputValue={this.state.inputVal}
        onInputChange={this.changeInput}
      />
    );
  }
}
export default DeptSearchBar;
