/*************************************************
 * MAIN PROGRAM
 */

// BUDGET CONTROLLER
var budgetController = (function () {
  // some code
})();

// UI CONTROLLER
var UIController = (function () {
  // some code
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value,
      };
    },
    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

// GLOBAL APP CONTROLLER
var Controller = (function (budgetCtrl, UICtrl) {
  // function to call eventlisteners
  var setupEventListeners = function () {
    var DOM = UICtrl.getDOMstrings();
    document
      .querySelector(DOM.inputButton)
      .addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };
  // function to get input values from UI
  var ctrlAddItem = function () {
    // 1. select the add field
    var input = UIController.getInput();
    console.log(input);
    // 2. add item to budget
    // 3. add the item to the UI
    // 4. calculate the budget
    // 5. display the budget on the ui
  };

  return {
    init: function () {
      console.log("APPLICATION STARTED");
      setupEventListeners();
    },
  };
})(budgetController, UIController);

Controller.init();
