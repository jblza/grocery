//grocery.js


initLocalStorage();
/*console.log(JSON.parse(localStorage.getItem('recipeList')));
//initLocalStorage();
var test = JSON.parse(localStorage.getItem('recipeList'));
console.log(test["tacos"]);
console.log(localStorage.getItem('inStock'));
test = localStorage.getItem('groceryList');
console.log(test);
console.log(test.split(","));
console.log(test.toString());*/

//set default values in localStorage
var defaultValues = function () {
	var recipes = JSON.stringify({
		"tacos":["beans", "tortillas", "tomatoes", "onions", "jalapenos"],
		"chicken and rice":["chicken", "rice", "onion", "carrot"]
	});
	localStorage.setItem('groceryList', ["bananas", "chicken", "tortillas"]);
	localStorage.setItem('inStock', ["butter", "beans"]);
	localStorage.setItem('recipeList', recipes);
	console.log("defaultValues set");
};

var checkLocalStorage = function(){
	console.log("checking localStorage");
	if (localStorage.getItem('groceryList') === null || localStorage.getItem('inStock') === null || localStorage.getItem('recipeList') === null){
		return true;
	}else{
		return false;
	}
};

//check localStorage either initiate default values or load items to the page
var initLocalStorage = function(){
	if(checkLocalStorage()){
    //create default elements in local storage
		defaultValues();
	}
    //load elements into the page
	console.log("localStorage intact, loading page");
};

//load page from localStorage
  //cycle through localStorage
    //create new taskitem for each element
    //append each one where it needs to go




//add item
   //When the button is pressed
   //create a new list item with the text from #new-item
      //imput checkbox
      //label
      //input (text)
      //button.edit
      //button.delete
      //each element, needs to be modified and appended


//add item to stock or label item as bought
    //when checkbox is checked
       //append the task list item to the #in-stock

//mark item as out of stock and let it be added back to the list
    //when checkbox is unchecked
       //append the task list item to the #to-buy


//delete item 
   //when the delete button is pressed
      //remove the parent list item from th ul

//edit item
    //When the Edit button is pressed
       // if the class of the parent is .editMode
          //switch from editMode
          // label text become the input's value
       //else
          //switch to .editMode
          //input value becomes the labels text

       //toggle .editMode on the parent


//display ingedients for selected recipes
   //when recipe is selected


//store data


//populate grocery list