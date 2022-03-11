import React, { Component } from "react";
import Display from "./components/display";
import Buttons from "./components/buttons";
import "./App.css";

// Style backgroundColor Keys:
const numberKeyStyle = { backgroundColor: "#2a2a2a" };
const functionKeyStyle = { backgroundColor: "#cdcdcd" };
const operatorKeyStyle = { backgroundColor: "#ffa600" };

// Calculator Keys:
const buttonKeys = [
  {
    id: "clear",
    style: functionKeyStyle,
    onClickFunc: "handleClearDisplay",
    value: "AC",
  },
  {
    id: "delete",
    style: functionKeyStyle,
    onClickFunc: "handleClearLastCharacter",
    value: "DEL",
  },
  {
    id: "percentage",
    style: functionKeyStyle,
    onClickFunc: "handleOperators",
    value: "%",
  },
  {
    id: "divide",
    style: operatorKeyStyle,
    onClickFunc: "handleOperators",
    value: "/",
  },
  {
    id: "seven",
    style: numberKeyStyle,
    onClickFunc: "handleNumbers",
    value: "7",
  },
  {
    id: "eight",
    style: numberKeyStyle,
    onClickFunc: "handleNumbers",
    value: "8",
  },
  {
    id: "nine",
    style: numberKeyStyle,
    onClickFunc: "handleNumbers",
    value: "9",
  },
  {
    id: "multiply",
    style: operatorKeyStyle,
    onClickFunc: "handleOperators",
    value: "X",
  },
  {
    id: "four",
    style: numberKeyStyle,
    onClickFunc: "handleNumbers",
    value: "4",
  },
  {
    id: "five",
    style: numberKeyStyle,
    onClickFunc: "handleNumbers",
    value: "5",
  },
  {
    id: "six",
    style: numberKeyStyle,
    onClickFunc: "handleNumbers",
    value: "6",
  },
  {
    id: "subtract",
    style: operatorKeyStyle,
    onClickFunc: "handleOperators",
    value: "-",
  },
  {
    id: "one",
    style: numberKeyStyle,
    onClickFunc: "handleNumbers",
    value: "1",
  },
  {
    id: "two",
    style: numberKeyStyle,
    onClickFunc: "handleNumbers",
    value: "2",
  },
  {
    id: "three",
    style: numberKeyStyle,
    onClickFunc: "handleNumbers",
    value: "3",
  },
  {
    id: "add",
    style: operatorKeyStyle,
    onClickFunc: "handleOperators",
    value: "+",
  },
  {
    id: "positive-negative",
    style: functionKeyStyle,
    onClickFunc: "handleSignPositiveNegative",
    value: "+/-",
  },
  {
    id: "zero",
    style: numberKeyStyle,
    onClickFunc: "handleNumbers",
    value: "0",
  },
  {
    id: "decimal",
    style: functionKeyStyle,
    onClickFunc: "handleDecimal",
    value: ".",
  },
  {
    id: "equals",
    style: operatorKeyStyle,
    onClickFunc: "handleOperators",
    value: "=",
  },
];

// REGEX Expressions:
// See: https://www.w3schools.com/js/js_regexp.asp
const decimalRegExp = /[\.*]/;
const endsWithDecimalRegExp = /[\.]$/;
const operatorsRegExp = /[\+\-x*\/]/i;
const endsWithOperatorRegExp = /[x*\/+\-]$/i;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currValue: "0",
      currSign: true,
      formula: "",
      buttonKeys: buttonKeys,
    };
    this.maxDigitInputWarning = this.maxDigitInputWarning.bind(this);
    this.handleNumbers = this.handleNumbers.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handleOperators = this.handleOperators.bind(this);
    this.handleSignPositiveNegative =
      this.handleSignPositiveNegative.bind(this);
    this.handleClearDisplay = this.handleClearDisplay.bind(this);
    this.handleClearLastCharacter = this.handleClearLastCharacter.bind(this);
  }

  maxDigitInputWarning() {
    let prevValue = this.state.currValue;
    this.setState({
      currValue: "Digit Limit Reached",
    });
    setTimeout(() => this.setState({ currValue: prevValue }), 1000);
  }

  handleNumbers(input) {
    let { currValue, formula } = this.state;
    if (currValue !== "Digit Limit Reached") {
      if (currValue.length > 21) {
        this.maxDigitInputWarning();
      } else {
        let number = input.target.value;
        let updatedCurrValue =
          currValue === "0"
            ? number
            : endsWithOperatorRegExp.test(currValue)
            ? number
            : currValue + number;
        let updatedFormula =
          formula === ""
            ? updatedCurrValue
            : formula === "0"
            ? formula.slice(0, -1) + number
            : /[=]$/.test(formula)
            ? updatedCurrValue
            : /[)]$/.test(formula)
            ? formula.slice(0, -1) + number + ")"
            : endsWithOperatorRegExp.test(formula) || formula !== ""
            ? formula + number
            : number;
        this.setState({
          currValue: updatedCurrValue,
          formula: updatedFormula,
        });
      }
    }
  }

  handleDecimal() {
    const { currValue, formula } = this.state;
    if (currValue !== "Digit Limit Reached") {
      if (currValue.length > 21) {
        this.maxDigitInputWarning();
      } else if (currValue === "0") {
        this.setState({
          currValue: "0.",
          formula: "0.",
        });
      } else {
        let updatedCurrValue = decimalRegExp.test(currValue)
          ? currValue
          : endsWithOperatorRegExp.test(currValue)
          ? "0."
          : currValue + ".";
        let updatedFormula =
          formula === ""
            ? updatedCurrValue
            : /[=]$/.test(formula)
            ? updatedCurrValue
            : endsWithOperatorRegExp.test(formula)
            ? formula + "0."
            : endsWithDecimalRegExp.test(updatedCurrValue) &&
              !endsWithDecimalRegExp.test(formula)
            ? formula + "."
            : formula;
        this.setState({
          currValue: updatedCurrValue,
          formula: updatedFormula,
        });
      }
    }
  }

  handleOperators(input) {
    let { currValue, currSign, formula } = this.state;
    let operator = input.target.value;
    if (operatorsRegExp.test(operator)) {
      //Avoid repetion of last operator:
      while (endsWithOperatorRegExp.test(formula)) {
        formula = formula.slice(0, -1);
      }
      //Avoid 'x' and '/' operators on the beginning
      //Avoid '.' in last position if receive an operator after
      if (endsWithDecimalRegExp.test(formula)) {
        formula = formula.slice(0, -1);
      }
      let updatedFormula =
        formula === ""
          ? /^[x*\/]/i.test(operator)
            ? ""
            : operator
          : /[=]$/.test(formula)
          ? currValue + operator.replace(/x/gi, "*")
          : formula + operator.replace(/x/gi, "*");
      //Replace "x" by "*":
      this.setState({
        currValue: operator.replace(/x/gi, "*"),
        formula: updatedFormula,
      });
    }
    //Handle '%' operator
    //See: 'https://dev.to/sanchithasr/7-ways-to-convert-a-string-to-number-in-javascript-4l'
    else if (operator === "%" && currValue !== 0) {
      let percentage = (parseFloat(currValue) / 100).toString();
      let updatedFormula = /[=]$/.test(formula)
        ? percentage
        : formula.slice(0, -currValue.length) + percentage;
      this.setState({
        currValue: percentage,
        formula: updatedFormula,
      });
    }
    //Handle '=' operator:
    else if (operator === "=" && currValue !== "0") {
      let result = Math.round(1000000000 * eval(formula)) / 1000000000;
      let updatedCurrValue = result.toString();
      let updatedFormula = formula + "=";
      this.setState({
        currValue: updatedCurrValue,
        formula: updatedFormula,
      });
    }
  }

  handleSignPositiveNegative(input) {
    //Handle '+/-' operator
    let { currValue, currSign, formula } = this.state;
    let operator = input.target.value;
    if (
      operator === "+/-" &&
      currValue !== "0" &&
      !endsWithOperatorRegExp.test(formula)
    ) {
      this.setState({
        currSign: !currSign,
      });
      let currSignValue = currSign === true ? "-" : "";
      let updatedCurrValue;
      let updatedFormula;
      if (currSign && /^[-]/.test(currValue) === false) {
        updatedCurrValue = currSignValue + currValue;
        updatedFormula = /[=]$/.test(formula)
          ? updatedCurrValue
          : formula.slice(0, -currValue.length) +
            "(" +
            currSignValue +
            currValue +
            ")";
        this.setState({
          currValue: updatedCurrValue,
          formula: updatedFormula,
        });
      } else if (currSign === false && /^[-]/.test(currValue)) {
        updatedCurrValue = currValue.slice(1);
        updatedFormula = /[=]$/.test(formula)
          ? updatedCurrValue
          : formula.slice(0, -currValue.length - 2) + updatedCurrValue;
        this.setState({
          currValue: updatedCurrValue,
          formula: updatedFormula,
        });
      }
    }
  }

  handleClearDisplay() {
    this.setState({
      currValue: "0",
      currSign: true,
      formula: "",
    });
  }

  handleClearLastCharacter() {
    let { currValue, formula } = this.state;
    if (currValue !== "0") {
      let updatedCurrValue;
      let updatedFormula;
      if (currValue.length === 1 && /[=]$/.test(formula) === false) {
        updatedCurrValue = "0";
        updatedFormula = formula.slice(0, -1);
      } else if (currValue.length === 2 && /^[-]/.test(currValue)) {
        updatedCurrValue = "0";
        updatedFormula = /[=]$/.test(formula) ? "0" : formula.slice(0, -4);
      } else if (currValue.length > 1 && /^[-]/.test(currValue) === false) {
        updatedCurrValue = currValue.slice(0, -1);
        updatedFormula = formula.slice(0, -1);
      } else if (currValue.length > 1 && /^[-]/.test(currValue)) {
        updatedCurrValue = currValue.slice(0, -1);
        updatedFormula =
          formula.slice(0, -currValue.length - 2) +
          "(" +
          updatedCurrValue +
          ")";
      }
      this.setState({
        currValue: updatedCurrValue,
        formula: updatedFormula,
      });
    }
  }

  render() {
    return (
      <div id="container-app">
        <div id="container-calculator">
          <Display
            currValue={this.state.currValue}
            formula={this.state.formula}
          />
          <Buttons
            currValue={this.state.currValue}
            buttonKeys={buttonKeys}
            handleNumbers={this.handleNumbers}
            handleDecimal={this.handleDecimal}
            handleOperators={this.handleOperators}
            handleSignPositiveNegative={this.handleSignPositiveNegative}
            handleClearDisplay={this.handleClearDisplay}
            handleClearLastCharacter={this.handleClearLastCharacter}
          />
        </div>
        <footer>
          <a href="https://codepen.io/new_life/full/wvebydP" target="_blank">
            &copy; Developed by Paulo Fidalgo
          </a>
        </footer>
      </div>
    );
  }
}

export default App;
