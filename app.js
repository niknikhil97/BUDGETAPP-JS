/*************************************************
 * MAIN PROGRAM
 */

// BUDGET CONTROLLER
var budgetController = (function () {
  // some code
  var Expenses = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
  };
  return {
    addItem: function (type, des, val) {
      var newItem, ID;
      // create id
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else if (data.allItems[type].length === 0) {
        ID = 1;
      }
      // create new item based on 'inc' or 'exp' type
      if (type === "exp") {
        var newItem = new Expenses(ID, des, val);
      } else if (type === "inc") {
        var newItem = new Income(ID, des, val);
      }
      // push it into datastructure array
      data.allItems[type].push(newItem);
      // Return the new element
      return newItem;
    },
  };
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
    // 1. select the add field (WORKING)
    var input = UICtrl.getInput();
    // 2. add item to budget
    var item = budgetCtrl.addItem(input.type, input.description, input.value);
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
