
// BUDGET CONTROLLER
var budgetController = (function() {
 
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
        // 1. Get the field input data from description text field
        var input = UICtrl.getInput();

        // 2. Add the item to the budget calculator

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

