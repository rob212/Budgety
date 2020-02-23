
// BUDGET CONTROLLER
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calcuateTotal = function(type) {
        var sum = 0;

        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    };

    var data = { 
        allItems: {
            exp: [],
            inc: []
        }, 
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
 
    return {
        addItem: function(type, description, value) {
            var newItem, ID;

            // Create a new ID
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create newItem based on 'inc' or 'exp' type
            if(type === 'exp') {
                newItem = new Expense(ID, description, value); 
            } else if(type === 'inc') {
                newItem = new Income(ID, description, value);
            }

            // Push it to data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },

        deleteItem: function(type, id) {
            var ids, index;
        
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            index = ids.indexOf(id);
            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },

        calculateBudget: function() {
            // calculate total income and expenses
            calcuateTotal('exp');
            calcuateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calcluate the percentage of income that we spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPercentages = data.allItems.exp.map(function(current) {
                return current.getPercentage();
            });
            return allPercentages;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);
        }
    };
})();


// UI CONTROLLER
var UIController = (function() {

    var DOM_STRINGS = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        enterKeyCode: 13,
        incomeList: '.income__list',
        expenseList: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'

    }

   
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOM_STRINGS.inputType).value, // will be either inc or exp
                description: document.querySelector(DOM_STRINGS.inputDescription).value,
                value: parseFloat(document.querySelector(DOM_STRINGS.inputValue).value)
            };
        },

        addListItem: function(item, type) {
            var htmlTemplate, newHTML;

            // Create HTML string with placeholder text
            if(type === 'inc') {
                htmlTemplate = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp') {
                htmlTemplate = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace placeholder text with some actual data
            newHTML = htmlTemplate.replace('%id%', item.id);
            newHTML = newHTML.replace('%description%', item.description);
            newHTML = newHTML.replace('%value%', item.value);

            // Insert the HTML into the DOM
            var d1 = document.querySelector(type === 'inc' ? DOM_STRINGS.incomeList: DOM_STRINGS.expenseList);
            d1.insertAdjacentHTML('beforeend', newHTML);
        },

        deleteListItem: function(selectorId) {
            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);
        },

        clearFields: function() {
            var fields, fieldsArray;
            // this creates a list of strings rather than an array of strings
            fields = document.querySelectorAll(DOM_STRINGS.inputDescription + ', ' + DOM_STRINGS.inputValue);

            // We borrow the slice method of the Array prototype passing it a list and it successfully converts that to an array of strings
            fieldsArray = Array.prototype.slice.call(fields);

            // Clear all the fields
            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArray[0].focus();
        },

        getDOMStrings: function() {
            return DOM_STRINGS;
        },

        displayBudget: function(obj) {
            document.querySelector(DOM_STRINGS.budgetLabel).textContent = obj.budget;
            document.querySelector(DOM_STRINGS.incomeLabel).textContent = obj.totalIncome;
            document.querySelector(DOM_STRINGS.expensesLabel).textContent = obj.totalExpenses;
            var percentageLabel = obj.percentage <= 0 ? '---' : obj.percentage + '%';
            document.querySelector(DOM_STRINGS.percentageLabel).textContent = percentageLabel;
        }

    };


})();


// APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOMStrings = UICtrl.getDOMStrings();
        
        document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

        document.addEventListener('keydown', function (event) {
            // if the 'Enter' key is clicked. 'which' is for older browsers
            if (event.keyCode === DOMStrings.enterKeyCode || event.which === DOMStrings.enterKeyCode) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOMStrings.container).addEventListener('click', ctrlDeleteItem);
    }

    var updateBudget = function() {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget in the UI
        UICtrl.displayBudget(budget);
    };

    var updateItemPercentages = function() {
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentages
        console.log(percentages);
    };

    var ctrlAddItem = function() {
        var input, newItem
        // 1. Get the field input data from description text field
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget calculator
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the current UI fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();

            // 6. Calculate and update perectanges
            updateItemPercentages();
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemId, splitID, type, ID;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemId) {

            // inc-1
            splitID = itemId.split('-')
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemId);

            // 3. Update and show the new budget
            updateBudget();
        };
    };

    return {
        init: function() {
            console.log('The application has started.')
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };


})(budgetController, UIController);


controller.init();

