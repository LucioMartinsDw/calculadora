document.addEventListener("DOMContentLoaded", function () {
  const display = document.getElementById("result");
  const buttons = document.querySelectorAll(".btn");
  const powerButton = document.getElementById("power-btn");
  
  let currentValue = "0";
  let currentOperator = null;
  let waitingForSecondOperand = false;
  let calculatorEnabled = true;

  function updateDisplay() {
    display.textContent = currentValue;
  }

  function clearCalculator() {
    currentValue = "0";
    currentOperator = null;
    waitingForSecondOperand = false;
    updateDisplay();
  }
  
  function calculate() {
    const value1 = parseFloat(previousValue);
    const value2 = parseFloat(currentValue);

    if (currentOperator === "+") {
      currentValue = (value1 + value2).toString();
    } else if (currentOperator === "-") {
      currentValue = (value1 - value2).toString();
    } else if (currentOperator === "*") {
      currentValue = (value1 * value2).toString();
    } else if (currentOperator === "/") {
      if (value2 !== 0) {
        currentValue = (value1 / value2).toString();
      } else {
        currentValue = "Erro";
      }
    }

    currentOperator = null;
    previousValue = null;
  }

  function toggleCalculator() {
    calculatorEnabled = !calculatorEnabled;
    if (calculatorEnabled) {
      display.style.opacity = 1;
      buttons.forEach(button => button.disabled = false);
      powerButton.classList.add("active"); // Adicionar classe "active"
    } else {
      display.style.opacity = 0.5;
      buttons.forEach(button => button.disabled = true);
      powerButton.classList.remove("active"); // Remover classe "active"
    }
  }
  

  powerButton.addEventListener("click", toggleCalculator);

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (!calculatorEnabled) {
        return; // Ignorar cliques quando a calculadora estiver desativada
      }

      const buttonValue = button.textContent;

      if (buttonValue >= "0" && buttonValue <= "9") {
        if (waitingForSecondOperand) {
          currentValue = buttonValue;
          waitingForSecondOperand = false;
        } else {
          currentValue = currentValue === "0" ? buttonValue : currentValue + buttonValue;
        }
        display.style.color = "red";
      } else if (buttonValue === "." && !currentValue.includes(".")) {
        currentValue += ".";
        display.style.color = "red";
      } else if (["+", "-", "*", "/"].includes(buttonValue)) {
        if (currentOperator) {
          calculate();
        }
        currentOperator = buttonValue;
        previousValue = currentValue;
        waitingForSecondOperand = true;
      } else if (buttonValue === "=") {
        if (currentOperator) {
          calculate();
          currentOperator = null;
        }
        display.style.color = "";
      } else if (buttonValue === "C") {
        clearCalculator();
        display.style.color = "";
        button.blur(); // Remover o foco da tecla "C"
      }

      updateDisplay();
    });
  });

  // Listener para eventos de teclado
  document.addEventListener("keydown", function (event) {
    if (!calculatorEnabled) {
      return; // Ignorar eventos de teclado quando a calculadora estiver desativada
    }

    const key = event.key;

    if ((key >= "0" && key <= "9") || key === ".") {
      if (waitingForSecondOperand) {
        currentValue = key;
        waitingForSecondOperand = false;
      } else {
        currentValue = currentValue === "0" ? key : currentValue + key;
      }
      display.style.color = "red";
    } else if (["+", "-", "*", "/"].includes(key)) {
      if (currentOperator) {
        calculate();
      }
      currentOperator = key;
      previousValue = currentValue;
      waitingForSecondOperand = true;
    } else if (key === "=" || key === "Enter") {
      if (currentOperator) {
        calculate();
        currentOperator = null;
      }
      display.style.color = "";
    } else if (key === "Escape") {
      clearCalculator();
      display.style.color = "";
    } else if (key === "C" && !event.repeat) {
      clearCalculator();
      display.style.color = "";
    }

    updateDisplay();
  });
});
