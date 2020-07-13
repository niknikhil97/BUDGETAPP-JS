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
    this.percentage = -1;
  };
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  Expenses.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = 0;
    }
  };
  Expenses.prototype.getPercentage = function () {
    return this.percentage;
  };
  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum = sum + cur.value;
    });
    data.totals[type] = sum;
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
    budget: 0,
    percentage: -1,
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
    calculateBudget: function () {
      // calculate total expenses and income
      calculateTotal("exp");
      calculateTotal("inc");
      // calculate the budget = totalincome-totalexpenses

      data.budget = data.totals.inc - data.totals.exp;
      // calculate budget percentage
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function () {
      return {
        budget: data.budget,
        percentage: data.percentage,
        totalExp: data.totals.exp,
        totalInc: data.totals.inc,
      };
    },
    deleteItem: function (type, id) {
      // grab the index
      var index;
      var ids = data.allItems[type].map(function (current) {
        return current.id;
      });
      index = ids.indexOf(id);
      // delete the item
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    calculatePercentages: function () {
      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },
    getPercentages: function () {
      var allPerc = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },
    // only for testing purpose
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
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    itemPercentageLabel: ".item__percentage",
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
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
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        // html text
        element = DOMstrings.expenseItem;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
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
    displayBudget: function (obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent =
        obj.totalExp;
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage;
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },
    deleteListItem: function (selectorId) {
      var el = document.getElementById(selectorId);
      el.parentNode.removeChild(el);
    },
    displayPercentage: function (percentage) {
      var fields = document.querySelectorAll(DOMstrings.itemPercentageLabel);

      // definition for nodeforeach function
      var nodeListforEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodeListforEach(fields, function (cur, index) {
        if (percentage[index] > 0) {
          cur.textContent = percentage[index] + "%";
        } else {
          cur.textContent = "---";
        }
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
    document.querySelector(DOM.container).addEventListener("click", ctrlDelete);
  };

  var updateBudget = function () {
    // calculate the budget
    budgetCtrl.calculateBudget();
    // return the budget
    var budget = budgetCtrl.getBudget();
    // Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  // function to calculate and update percentages
  var updatePercentages = function () {
    // calculate percentages
    budgetCtrl.calculatePercentages();
    // get percentages
    var perc = budgetCtrl.getPercentages();
    // display the percentages
    UIController.displayPercentage(perc);
  };

  // function to delete item from the UI
  var ctrlDelete = function (event) {
    var itemID, splitID, type, id;
    //  1. inc-1
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      id = parseInt(splitID[1]);
      // 2. delete the item
      budgetCtrl.deleteItem(type, id);
      // 3. update the UI
      UICtrl.deleteListItem(itemID);
      // 4. update the budget and budget ui
      updateBudget();
      // 5. calculate and update percentages
      updatePercentages();
    }
  };

  // function to get input values from UI
  var ctrlAddItem = function () {
    // 1. select the add field (WORKING)
    var input = UICtrl.getInput();
    if (input.description != "" && !isNaN(input.value) && input.value > 0) {
      // 2. add item to budget
      var item = budgetCtrl.addItem(input.type, input.description, input.value);
      // 3. add the item to the UI
      UIController.addListItem(item, input.type);
      // 4. clear fields
      UIController.clearFields();
      // 5. calculate the budget and display the budget on the UI
      updateBudget();
      // 6. Calculate and update percentages
      updatePercentages();
    }
  };

  return {
    init: function () {
      console.log("APPLICATION STARTED");
      UICtrl.displayBudget({
        budget: 0,
        totalExp: 0,
        totalInc: 0,
        percentage: 0,
      });
      setupEventListeners();
    },
  };
})(budgetController, UIController);

Controller.init();
