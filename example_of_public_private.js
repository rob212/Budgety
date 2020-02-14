
// This is how private and public works in JS using IIFE(Immediately Invoked Function Expressions) and Closures
// The budgetController function is run instantly when this starts due to the () on line 16. This returns the publicTest
// function that is assigned to budgetController. Therefore the only method or property I can call on budgetController is 
// publicTest(b) therefore making it a public method. The publicTest method will always have access to the x and add function due even
// after they have been invoked due to the fact that publicTest is a closure. 
var budgetController = (function() {
    var x = 23;

    var add = function(a) {
        return x + a;
    }

    return {
        publicTest: function(b) {
            console.log(add(b));
        }
    }
})();



var UIcontroller = (function() {

    // Some code 

})();
