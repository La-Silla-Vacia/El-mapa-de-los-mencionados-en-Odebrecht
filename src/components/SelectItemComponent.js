'use strict';

import React from 'react';

require('styles/Select.scss');

class SelectItemComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      isSelected: false
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.callback(this.props.value);
  }

  render() {
    return (
      <button
        className="option"
        onClick={this.handleClick.bind(this)}>
        {this.props.children}
      </button>
    );
  }
}

SelectItemComponent.displayName = 'SelectItemComponent';

// Uncomment properties you need
// SelectItemComponent.propTypes = {};
// SelectItemComponent.defaultProps = {};

export default SelectItemComponent;
