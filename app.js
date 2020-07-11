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
    testDisplay: function () {
      console.log(data);
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
    expenseItem: ".expenses__list",
    incomeItem: ".income__list",
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
    addListItem: function (obj, type) {
      var html, newhtml, element;
      if (type === "inc") {
        // html text
        element = DOMstrings.incomeItem;
        html =
          '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        // html text
        element = DOMstrings.expenseItem;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // add the placeholders
      newhtml = html.replace("%id%", obj.id);
      newhtml = newhtml.replace("%description%", obj.description);
      newhtml = newhtml.replace("%value%", obj.value);
      // add the html to the UI
      document.querySelector(element).insertAdjacentHTML("beforeend", newhtml);
    },
    clearFields: function () {
      var fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMstrings.inputValue + ", " + DOMstrings.inputDescription
      );
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });
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
    UIController.addListItem(item, input.type);
    // 4. clear fields
    UIController.clearFields();
    // 5. calculate the budget
    // 6. display the budget on the ui
  };

  return {
    init: function () {
      console.log("APPLICATION STARTED");
      setupEventListeners();
    },
  };
})(budgetController, UIController);

Controller.init();
