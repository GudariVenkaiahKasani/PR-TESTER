// Function 1: simple addition
function add(a, b) {
  const c=a+b
  return c;
}

// Function 2: multiply
function multiply(a, b) {
  return a * b;
}

// Function 3: arrow function
const subtract = (a, b) => {
  return a - b;
}

// Function 4: class method
class Calculator {
  divide(a, b) {
    if (b === 0) return null;
    return a / b;
  }

  square(a) {
    return a * a;
  }
}

// Function 5: object method
const utils = {
  greet(name) {
    return `Hello, ${name}!`;
  },
  farewell(name) {
    return `Goodbye, ${name}!`;
  }
}

// Function 6: anonymous function assigned to variable
const logMessage =
