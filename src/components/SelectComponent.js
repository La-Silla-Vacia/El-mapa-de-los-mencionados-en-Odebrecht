'use strict';

import React from 'react';
import cx from 'classnames';

import Item from './SelectItemComponent';

require('styles/Select.scss');

class SelectComponent extends React.Component {
  constructor() {
    super();

    this.state = {
      open: false,
      currentOption: '',
      options: []
    };

    this.openSelect = this.openSelect.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  getOptions() {
    return this.state.options.map((option, index) => {
      return (
        <Item
          key={index}
          value={option}
          callback={this.handleClick}
        >
          {option}
        </Item>
      );
    });
  }

  handleClick(option) {
    this.setState({
      currentOption: option
    });
    this.props.callback(option);

    const optionIndex = this.state.options.indexOf(option);
    const newOptions = [
      this.props.options[optionIndex]
    ];

    for (let i = 0; i < this.props.options.length; i += 1) {
      if (i != optionIndex)
        newOptions.push(this.props.options[i]);
    }
    this.setState({options: newOptions});
    this.setState({open: false});
  }

  componentWillMount() {
    this.setState({currentOption: this.props.value});
  }

  componentWillReceiveProps(newprops) {
    if (newprops.options.length > this.state.options.length) {
      this.setState({options: newprops.options});
    }
  }

  render() {
    const options = this.getOptions();

    return (
      <div className={cx('Select', {'Select__open': this.state.open})}
           onClick={this.openSelect}
           onKeyDown={this.openSelect} tabIndex="0">
        <span>{this.state.currentOption}</span>
        <div className='Select__inner'>
          {options}
        </div>
      </div>
    );
  }

  openSelect(e) {
    if (e.type === 'keydown') {
      if (e.keyCode === 13) {
        this.setState({open: !this.state.open});
      }
    } else {
      this.setState({open: !this.state.open});
    }
  }
}

SelectComponent.displayName = 'SelectComponent';

// Uncomment properties you need
// SelectComponent.propTypes = {};
// SelectComponent.defaultProps = {};

export default SelectComponent;
