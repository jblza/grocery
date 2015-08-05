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
var ingredientListHolder = document.getElementById("ingredients");
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
	//defaultValues();
};

//load page from localStorage
var loadPage = function() {
   var recipes = JSON.parse(localStorage.getItem('recipeList'));
   //grocery list
	loadList(createBasicListItem, localStorage.getItem('groceryList').split(","), "grocery");
   //instock
    loadList(createBasicListItem, localStorage.getItem('inStock').split(","), "instock");
   //ingredients
	loadList(createBasicListItem, recipes[Object.keys(recipes)[0]], "ingredient");
   //recipes
	loadList(createBasicListItem, Object.keys(recipes), "recipe");
}

var loadList = function(createListItems, lables, type) {
	if(type === "grocery") {
	   for(var i = 0; i < lables.length; i++) {
	   	   var listItem = createListItems(lables[i], type);
		   groceryListHolder.appendChild(listItem);  
		   bindTaskEvents(listItem, itemBought);
	   }
	} else if (type === "instock") {
 	   for(var i = 0; i < lables.length; i++) {
 	   	   var listItem = createListItems(lables[i], type);
 		   inStockListHolder.appendChild(listItem);  
 		   bindTaskEvents(listItem, itemOutOfStock);
	   }
	} else if (type === "ingredient") {
  	   for(var i = 0; i < lables.length; i++) {
  	   	   var listItem = createListItems(lables[i], type);
  		   ingredientListHolder.appendChild(listItem);  
  		   bindTaskEvents(listItem);
 	   }
	} else if (type === "recipe") {
   	   for(var i = 0; i < lables.length; i++) {
   	   	   var listItem = createListItems(lables[i], type);
		   if (i === 0){
			   listItem.querySelector("input[type=checkbox]").checked = true;
		   }
   		   recipeListHolder.appendChild(listItem);  
   		   bindTaskEvents(listItem, recipeSelect); 
  	   }
	} else {
		console.log("loadList failed /type/ not set");
	}
	
}

//checkbox event for recipes
var recipeSelect = function() {
	//gets the label of the selected list item   
	var label = this.parentNode.querySelector("label").innerText;
	
	//gets a collection of the list items in the recipe section
	//loops through and deselects all check boxes
	var childList = this.parentNode.parentNode.children;
	for(var i = 0; i < childList.length; i++){
		childList[i].querySelector("input[type=checkbox]").checked = false;
	}
	//makes the current checkbox checked
	this.checked = true;
	
	//loads the ingridients from the selected recipe
	while(ingredientListHolder.firstChild){
		ingredientListHolder.removeChild(ingredientListHolder.firstChild);
	}
	loadList(createBasicListItem, JSON.parse(localStorage.getItem('recipeList'))[label], "ingredient");	
}

//mark an item as bought and append it to the instock list
var itemBought = function() {
	console.log("item marked bought");
	var listItem = this.parentNode;
	var label = this.parentNode.querySelector("label").innerText;
	var groceryList = localStorage.getItem('groceryList').split(',');
	var inStockList = localStorage.getItem('inStock').split(',');
	
	//append item to #in-stock
	inStockListHolder.appendChild(listItem);
	bindTaskEvents(listItem, itemOutOfStock);
	
	var balls = removeFromList(label, groceryList).toString();
	
	//need remove item for localStorage GroceryList
	localStorage.setItem('groceryList', balls);
	
	//and add to localStorage instock
	inStockList.push(label);
	localStorage.setItem('inStock', inStockList.toString());
}

var removeFromList = function(item, arr) {
	var i = arr.indexOf(item);
	if(i > -1) {
		arr.splice(i, 1);
	} else {
		console.log("error could not remove item from list");
	}
	return arr;
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
	if(checkBox !== null) {
        checkBox.onchange = checkBoxEventHandler;
	}
}

var editItem = function () {
	  console.log("edit task");             ///<----- edit to reflect changes in local storage
    
	  var listItem = this.parentNode;
      var listType = this.parentNode.parentNode.id;
	  var editInput = listItem.querySelector("input[type=text]");
	  var label = listItem.querySelector("label");
	  var oldLabel = label.innerText;
  
	    // if the class of the parent is .editMode
	  var containsClass = listItem.classList.contains("editMode");
  
	  if(containsClass) {
	    // switch from .editMode
	    // label text become the input's value
	    label.innerText = editInput.value;
		editData(listType, label.innerText, oldLabel);
	  } else{
	    // switch to .editMode
	    // input value becomes the labels text
	    editInput.value = label.innerText;
	  }
	    // Toggle .editMode on the listItem
	    listItem.classList.toggle("editMode");
}

var editData = function(listType, newLabel, oldLabel) {
	if (listType === "to-buy") {
		var arr = localStorage.getItem('groceryList').split(',');
		var i = arr.indexOf(oldLabel);
		arr[i] = newLabel;
		localStorage.setItem('groceryList', arr.toString());	
	} else if (listType === "in-stock") {
		var arr = localStorage.getItem('inStock').split(',');
		var i = arr.indexOf(oldLabel);
		arr[i] = newLabel;
		localStorage.setItem('inStock', arr.toString());	
	} else if (listType === "ingredients") {
		var children = document.getElementById("recipes").querySelectorAll("li");
		var i = 0;
		label = null;
		while (label === null && i < children.length){
			if(children[i].querySelector("input[type=checkbox]").checked === true) {
				label = children[i].querySelector("label").innerText;
			}
			i++;
		}
		if (label !== null) {
			var recipeList = JSON.parse(localStorage.getItem('recipeList'));
			var ingredients = recipeList[label];
			var j = ingredients.indexOf(oldLabel);
			ingredients[j] = newLabel;
			recipeList[label] = ingredients;
			localStorage.setItem('recipeList', JSON.stringify(recipeList));
		} else {
			console.log("error ingredients in function editData could not find parent recipe")
		}
			
	} else if (listType === "recipes") {
		var recipeList = JSON.parse(localStorage.getItem('recipeList'));
		recipeList[newLabel] = recipeList[oldLabel];
		delete recipeList[oldLabel];
		localStorage.setItem('recipeList', JSON.stringify(recipeList));
	} else {
		console.log("error function editData: invalid list ID");
	}
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
	var label = this.parentNode.querySelector("label").innerText;
	var groceryList = localStorage.getItem('groceryList').split(",");
	var inStockList = localStorage.getItem('inStock').split(",");
	
	groceryListHolder.appendChild(listItem);
	bindTaskEvents(listItem, itemBought);
	
	//need remove item for localStorage instock
	localStorage.setItem('inStock', removeFromList(label, inStockList).toString());
	
	//and add to localStorage groceryList
	groceryList.push(label);
	localStorage.setItem('groceryList', groceryList.toString());
}


//new Grocery List Item
var createBasicListItem = function(labelString, type) {
	//create list item
	var listItem = document.createElement("li");
    // label
    var label = document.createElement("label");
    // input (text)
    var editInput = document.createElement("input"); //text
    // button.edit
    var editButton = document.createElement("button");
    // button.delete
    var deleteButton = document.createElement("button");
	
	//modify each element
	editInput.type = "text";
	editButton.textContent = "Edit";
	editButton.className = "edit";
	deleteButton.textContent = "Delete";
	deleteButton.className = "delete";
	label.textContent = labelString;
	
	//if ingredient type leave off checkbox
	if (type !== "ingredient") {
		var checkBox = document.createElement("input");
		checkBox.type = "checkbox";
		if(type === "instock"){
			checkBox.checked = true;
			console.log("checked");
		}
		listItem.appendChild(checkBox);
		
	}
	
	//append everything to the li
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