import React, { Component } from "react";
import "../App.css";

class Display extends Component {
  render() {
    const { currValue, formula } = this.props;
    return (
      <div>
        <div id="container-display">
          <div id="displayFormula">{formula}</div>
          <div id="display">{currValue}</div>
        </div>
      </div>
    );
  }
}

export default Display;
