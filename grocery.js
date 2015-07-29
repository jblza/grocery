//grocery.js



/*console.log(JSON.parse(localStorage.getItem('recipeList')));
//initLocalStorage();
var test = JSON.parse(localStorage.getItem('recipeList'));
console.log(test["tacos"]);
console.log(localStorage.getItem('inStock'));
test = localStorage.getItem('groceryList');
console.log(test);
console.log(test.split(","));
console.log(test.toString());*/

var groceryListHolder = document.getElementById("to-buy");
var inStockListHolder = document.getElementById("in-stock");
var ingredientsListHolder = document.getElementById("ingredients");
var recipeListHolder = document.getElementById("recipes");

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
	console.log("localStorage intact");
};

//load page from localStorage
var loadPage = function() {
  
   //grocery list
	loadList(createBasicListItem, localStorage.getItem('groceryList').split(","));
   //instock
   //ingredients
   //recipes
    //create new taskitem for each element
    //append each one where it needs to go
	
}

var loadList = function(createListItems, lables) {
	for(var i = 0; i < lables.length; i++) {
		var listItem = createListItems(lables[i]);
		groceryListHolder.appendChild(listItem);  //<--------
		bindTaskEvents(listItem, itemBought);
	}
	
}

//mark an item as bought and append it to the instock list
var itemBought = function() {
	console.log("item marked bought");
	//append item to #in-stock
	var listItem = this.parentNode;
	inStockListHolder.appendChild(listItem);
	bindTaskEvents(listItem, itemOutOfStock);
	
	//need remove item for localStorage GroceryList
	//and add to localStorage instock
}

var bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
	console.log("bind list item events");
    //select taskListItem's children
    var checkBox = taskListItem.querySelector("input[type=checkbox]");
    var editButton = taskListItem.querySelector("button.edit");
    var deleteButton = taskListItem.querySelector("button.delete");
	
      //bind editTask to edit button
    editButton.onclick = editItem;
  
        //bind deleteTask to delete button
    deleteButton.onclick = deleteItem;
  
        //bind checkBoxEventHandler to the check box
    checkBox.onchange = checkBoxEventHandler;
}

var editItem = function () {
	console.log("edit task");             ///<----- edit to reflect changes in local storage
  
	  var listItem = this.parentNode;
  
	  var editInput = listItem.querySelector("input[type=text]");
	  var label = listItem.querySelector("label");
  
	    // if the class of the parent is .editMode
	  var containsClass = listItem.classList.contains("editMode");
  
	  if(containsClass) {
	    // switch from .editMode
	    // label text become the input's value
	    label.innerText = editInput.value;
	  } else{
	    // switch to .editMode
	    // input value becomes the labels text
	    editInput.value = label.innerText;
	  }
	    // Toggle .editMode on the listItem
	    listItem.classList.toggle("editMode");
}

var deleteItem = function () {
	console.log("delete task...");
	  // remove parent list item from the ul
	  var listItem = this.parentNode;
	  var ul = listItem.parentNode;
  
	  //remove the parent list item from the ul
	  ul.removeChild(listItem);
}

//mark item as out of stock append to grocery list
var itemOutOfStock = function() {
	console.log("item marked out of stock");
	var listItem = this.parentNode;
	groceryListHolder.appendChild(listItem);
	bindTaskEvents(listItem, itemBought);
	
	//need remove item for localStorage instock
	//and add to localStorage groceryList
}


//new Grocery List Item
var createBasicListItem = function(labelString, type) {
	//create list item
	var listItem = document.createElement("li");
	//input checkbox
	var checkBox = document.createElement("input");
  // label
    var label = document.createElement("label");
    // input (text)
    var editInput = document.createElement("input"); //text
    // button.edit
    var editButton = document.createElement("button");
    // button.delete
    var deleteButton = document.createElement("button");
	
	//modify each element
	checkBox.type = "checkbox";
	editInput.type = "text";
	editButton.textContent = "Edit";
	editButton.className = "edit";
	deleteButton.textContent = "Delete";
	deleteButton.className = "delete";
	label.textContent = labelString;
	
	//append everything to the li
	listItem.appendChild(checkBox);
	listItem.appendChild(label);
	listItem.appendChild(editInput);
	listItem.appendChild(editButton);
	listItem.appendChild(deleteButton);
  
	return listItem;
}





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

initLocalStorage();
loadPage();