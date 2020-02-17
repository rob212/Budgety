
// BUDGET CONTROLLER
var budgetController = (function() {

    var Expense = function(id, description, value) {
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
            inc: []
        }, 
        totals: {
            exp: 0,
            inc: 0
        }
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
        enterKeyCode: 13
    }

   
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOM_STRINGS.inputType).value, // will be either inc or exp
                description: document.querySelector(DOM_STRINGS.inputDescription).value,
                value: document.querySelector(DOM_STRINGS.inputValue).value
            };
        },

        getDOMStrings: function() {
            return DOM_STRINGS;
        }

    };


})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

        document.addEventListener('keydown', function (event) {
            var DOMStrings = UICtrl.getDOMStrings();
            // if the 'Enter' key is clicked. 'which' is for older browsers
            if (event.keyCode === DOMStrings.enterKeyCode || event.which === DOMStrings.enterKeyCode) {
                ctrlAddItem();
            }
        });
    }

    var ctrlAddItem = function() {
        var input, newItem
        // 1. Get the field input data from description text field
        input = UICtrl.getInput();

        // 2. Add the item to the budget calculator
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add the item to the UI

        // 4. Calculate the budget

        // 5. Display the budget in the UI
        console.log(input);
    };

    return {
        init: function() {
            console.log('The application has started.')
            setupEventListeners();
        }
    };


})(budgetController, UIController);


controller.init();

