import React, { Component } from "react";
import "../App.css";

class Buttons extends Component {
  render() {
    const { buttonKeys } = this.props;
    return (
      <div id="container-buttonKeys">
        {buttonKeys.map((button) => (
          <button
            key={button.id}
            id={button.id}
            style={button.style}
            onClick={this.props[button.onClickFunc]}
            value={button.value}
          >
            {button.value}
          </button>
        ))}
      </div>
    );
  }
}

export default Buttons;
