//grocery.js

//add buttons and their inputs
var groceryInput = document.getElementById("new-grocery");
var groceryButton = document.getElementById("groceryButton");
var inStockInput = document.getElementById("new-instock");
var inStockButton = document.getElementById("inStockButton");
var ingredientInput = document.getElementById("new-ingredient");
var ingredientButton = document.getElementById("ingredientButton");
var recipeInput = document.getElementById("new-recipe");
var recipeButton = document.getElementById("recipeButton");

//auto-populate buttons
var resetButton = document.getElementById("zero");
var fourButton = document.getElementById("four");
var threeButton = document.getElementById("three");
var twoButton = document.getElementById("two");
var oneButton = document.getElementById("one");
var commitButton = document.getElementById("commit");

//holders for the list items
var groceryListHolder = document.getElementById("to-buy");
var inStockListHolder = document.getElementById("in-stock");
var ingredientListHolder = document.getElementById("ingredients");
var recipeListHolder = document.getElementById("recipes");

//adds a list item from input to appropriate list
var addItem = function(type) {
	return function() {
	    var listItem;
		var label;
	    if(type === "grocery") {
	       label = groceryInput.value.toLowerCase().trim();
		   if (label !== ""){
			   listItem = createBasicListItem(label, type);
	    	   groceryListHolder.appendChild(listItem);
	    	   bindTaskEvents(listItem, itemBought);
			   addData(label, type);
			   groceryInput.value = "";
		    }
    	} else if (type === "instock") {
			label = inStockInput.value.toLowerCase().trim();
			if (label !== ""){
			    listItem = createBasicListItem(label, type);
    		    inStockListHolder.appendChild(listItem);
	    	    bindTaskEvents(listItem, itemOutOfStock);
				addData(label, type);
			    inStockInput.value = "";
			}
    	} else if (type === "ingredient") {
			label = ingredientInput.value.toLowerCase().trim();
			if (label !== ""){	
			   listItem = createBasicListItem(label, type);
    		   ingredientListHolder.appendChild(listItem);
    		   bindTaskEvents(listItem);
			   addData(label, type);
			   ingredientInput.value = "";
		   }
    	} else if (type === "recipe") {
			label = recipeInput.value.toLowerCase().trim();
			if (label !== ""){
			   listItem = createBasicListItem(label, type);
			   if (recipeListHolder.children.length === 0) {
			    	listItem.querySelector("input[type=checkbox]").checked = true;
			   }
	    	   recipeListHolder.appendChild(listItem);
	    	   bindTaskEvents(listItem, recipeSelect);
			   addData(label, type);
			   recipeInput.value = "";
		   }
	    } else {
	    	console.log("error function addItem: type unknown");
	    }
		console.log("add " + type);
		console.log(listItem);
	};
}

//takes added items and effects those changes in the local storage data
var addData = function(label, type) {
    if(type === "grocery") {
		var arr = localStorage.getItem('groceryList').split(',');
		arr.push(label);
		localStorage.setItem('groceryList', arr.toString());
	} else if (type === "instock") {
		var arr = localStorage.getItem('inStock').split(',');
		arr.push(label);
		localStorage.setItem('inStock', arr.toString());
	} else if (type === "ingredient") {
		var recipeLabel = getCurrentRecipe();
		if (recipeLabel !== null) {
			var recipeList = JSON.parse(localStorage.getItem('recipeList'));
			var ingredients = recipeList[recipeLabel];
			ingredients.push(label);
			recipeList[recipeLabel] = ingredients;
			localStorage.setItem('recipeList', JSON.stringify(recipeList));
		} else {
			console.log("error ingredients in function addData could not find parent recipe")
		}
	} else if (type === "recipe") {
		var recipeList = JSON.parse(localStorage.getItem('recipeList'));
		recipeList[label] = [];
		localStorage.setItem('recipeList', JSON.stringify(recipeList));	
    } else {
    	console.log("error function addData: type unknown");
    }
}

//set default values in localStorage
var defaultValues = function () {
	var recipes = JSON.stringify({
		"tacos":["beans", "tortillas", "tomato", "onion", "jalapenos"],
		"chicken and rice":["chicken", "rice", "onion", "carrot", "celery"],
		"mac and cheese": ["macaroni", "cheese", "milk", "butter", "flour"],
		"beef and broccoli": ["beef", "broccoli", "soy sauce", "garlic", "corn starch"],
		"burgers": ["ground beef", "buns", "tomato", "spinach", "onion"],
		"salad": ["spinach", "tomato", "avocado", "vinegar", "olive oil"],
	});
	localStorage.setItem('groceryList', ["bananas", "chicken",]);
	localStorage.setItem('inStock', ["tortillas", "tomato", "onion", "celery", "butter", "flour", "garlic", "soy sauce", "ground beef", "buns", "spinach", "vinegar", "olive oil"]);
	localStorage.setItem('recipeList', recipes);
	console.log("defaultValues set");
};

//reports whether local storage has been set or not
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
	//makes sure any leftover potential autopopulate data is cleared
	if (localStorage.getItem('potentialGroceryList') !== null){
		localStorage.removeItem('potentialGroceryList');
	}
	console.log("localStorage intact");
	//defaultValues();
};

//load page from localStorage
var loadPage = function() {
   var recipes = JSON.parse(localStorage.getItem('recipeList'));
   flushGhostItems();
   //grocery list
	loadList(createBasicListItem, localStorage.getItem('groceryList').split(","), "grocery");
   //instock
    loadList(createBasicListItem, localStorage.getItem('inStock').split(","), "instock");
   //ingredients
	loadList(createBasicListItem, recipes[Object.keys(recipes)[0]], "ingredient");
   //recipes
	loadList(createBasicListItem, Object.keys(recipes), "recipe");
}

//ghost items can appear when all items in grocery or instock lists are deleted and then new ones are added.
//i think this is due to the way local storage deals with having zero items stored in a defined variable.
//not the most efficent way to deal with this issue but this function keeps them out of my hair
var flushGhostItems = function() {
	var gList = localStorage.getItem('groceryList').split(",");
	var iList = localStorage.getItem('inStock').split(",");
	for(var i = 0; i < gList.length; i++) {
		if(gList[i] === ""){
			gList.splice(i, 1);
		}
	}
	localStorage.setItem('groceryList', gList);
	
	for(var i = 0; i < iList.length; i++) {
		if(iList[i] === ""){
			iList.splice(i, 1);
		}
	}
	localStorage.setItem('inStock', iList);
}

//reads data from local storage and populates the lists
var loadList = function(createListItems, labels, type) {
	if(type === "grocery") {
	   for(var i = 0; i < labels.length; i++) {
		   if (labels[i] !== "") {
	   	       var listItem = createListItems(labels[i], type);
		       groceryListHolder.appendChild(listItem);  
		       bindTaskEvents(listItem, itemBought);
		   }
	   }
	} else if (type === "instock") {
 	   for(var i = 0; i < labels.length; i++) {
		   if (labels[i] !== "") {
 	   	       var listItem = createListItems(labels[i], type);
 		       inStockListHolder.appendChild(listItem);  
 		       bindTaskEvents(listItem, itemOutOfStock);
	       }
	   }
	} else if (type === "ingredient") {
		if(labels !== undefined){
  	        for(var i = 0; i < labels.length; i++) {
  	      	   var listItem = createListItems(labels[i], type);
			   //<<----------------------------------------------------------------------------
			   //listItem = ingredientColor(listItem);
  	     	   ingredientListHolder.appendChild(listItem);  
  		       bindTaskEvents(listItem); 
 	       }
	   }
	} else if (type === "recipe") {
   	   for(var i = 0; i < labels.length; i++) {
   	   	   var listItem = createListItems(labels[i], type);
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
	var recipeList = JSON.parse(localStorage.getItem('recipeList'));
	
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
	loadList(createBasicListItem, recipeList[label], "ingredient");	
	
	//<--------------------------------------------------------------------------------------------
	ingredientColor(recipeList[label]);
}

var ingredientColor = function (list){
	
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

//removes an item from a list
var removeFromList = function(item, arr) {
	var i = arr.indexOf(item);
	if(i > -1) {
		arr.splice(i, 1);
	} else {
		console.log("error could not remove item from list");
	}
	return arr;
}

//assigns functions to onclick and onchange actions
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

//allows a list item to be edited 
var editItem = function () {
	  console.log("edit task");            
    
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
	    label.innerText = editInput.value.toLowerCase().trim();
		editData(listType, label.innerText, oldLabel);
	  } else{
	    // switch to .editMode
	    // input value becomes the labels text
	    editInput.value = label.innerText;
	  }
	    // Toggle .editMode on the listItem
	    listItem.classList.toggle("editMode");
}

//reflects the edit changes in local storage
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
		var label = getCurrentRecipe();
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

//returns the label of the current checked recipe
var getCurrentRecipe = function() {
	var children = document.getElementById("recipes").querySelectorAll("li");
	var i = 0;
	var label = null;
	while (label === null && i < children.length){
		if(children[i].querySelector("input[type=checkbox]").checked === true) {
			label = children[i].querySelector("label").innerText;
		}
		i++;
	}
	return label;
}

//deletes item from list
var deleteItem = function () {
	console.log("delete task...");
	  // remove parent list item from the ul
	  var listItem = this.parentNode;
	  var ul = listItem.parentNode;
	  var label = listItem.querySelector("label");
      var listType = this.parentNode.parentNode.id;
  
	  //remove the parent list item from the ul
	  ul.removeChild(listItem);
	  deleteData(listType, label.innerText);
}

//reflects delete changes in local storage
var deleteData = function(listType, label) {
	if (listType === 'to-buy') {
		var arr = localStorage.getItem('groceryList').split(',');
		var i = arr.indexOf(label);
		arr.splice(i, 1);
		localStorage.setItem('groceryList', arr.toString());
	} else if (listType === 'in-stock') {
		var arr = localStorage.getItem('inStock').split(',');
		var i = arr.indexOf(label);
		arr.splice(i, 1);
		localStorage.setItem('inStock', arr.toString());
	} else if (listType === 'ingredients') {
		var recipeLabel = getCurrentRecipe();
		if (recipeLabel !== null) {
			var recipeList = JSON.parse(localStorage.getItem('recipeList'));
			var ingredients = recipeList[recipeLabel];
			var j = ingredients.indexOf(label);
			ingredients.splice(j, 1);
			console.log(ingredients);
			if (ingredients.length === 0){
				console.log("123 delete recipe" + recipeLabel + "1");
				var listItem = returnListItemFromLabel(recipeLabel, "recipes");
				var ul = listItem.parentNode;
				ul.removeChild(listItem);
				deleteData('recipes', recipeLabel);
			} else {
			    recipeList[recipeLabel] = ingredients;
			    localStorage.setItem('recipeList', JSON.stringify(recipeList));
			}	
		} else {
			console.log("error ingredients in function deleteData could not find parent recipe")
		}
	} else if (listType === 'recipes') {
		var recipeList = JSON.parse(localStorage.getItem('recipeList'));
		delete recipeList[label];
		localStorage.setItem('recipeList', JSON.stringify(recipeList));
		recipeHelper();
	} else {
		console.log("error function deleteData: listType not valid");
	}
}

//returns a live list item of the provided label
var returnListItemFromLabel = function (label, id) {
	var ul = document.getElementById(id);
	var listItem;
	for(var i = 0; i < ul.children.length; i++){
		console.log(ul.children[i].querySelector("label").innerText);
	      if(ul.children[i].querySelector("label").innerText === label)
	      {
	         listItem = ul.children[i];
	      }
	    }    
	return listItem;
}

//used when a recipe is deleted, selects(checks) the first recipe item and loads its ingredients
var recipeHelper= function() {
	var label = getCurrentRecipe();
	if (label === null) {
		var children = document.getElementById("recipes").querySelectorAll("li");
		if (children.length !== 0){
		    label = children[0].querySelector("label").innerText;
		    children[0].querySelector("input[type=checkbox]").checked = true;
		}
	}
	while(ingredientListHolder.firstChild){
		ingredientListHolder.removeChild(ingredientListHolder.firstChild);
	}
	if (label !== null){
	    loadList(createBasicListItem, JSON.parse(localStorage.getItem('recipeList'))[label], "ingredient");
	}	
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


//new List Item
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

//shows the potential changes made in the grocery auto-populate feature
var stageList = function (num) {
	return function() {
		reLoad();
		compareIngredients(num);
	}
}

//function that does does the autopopulate feature
var compareIngredients = function (num){
	var inStock = localStorage.getItem('inStock').split(",");
	var recipeList = JSON.parse(localStorage.getItem('recipeList'));
	var recipes = Object.keys(recipeList);
	var ingredients = [];
	var potentialGroceryList = [];
	var matches = [];
	var allMatches = [];
	var differences = [];
	
	for(var i = 0; i < recipes.length; i++) {
		ingredients = recipeList[recipes[i]];
		console.log("ingredients: " + ingredients);
		if (ingredients.length > num){
			matches = returnMatches(ingredients, inStock);
			
			//how do i highlight ingredients?
			console.log("matches " + matches);
			if (matches.length >= num) {
				highlight(recipes[i], num, "recipes");
				allMatches = allMatches.concat(matches);
				potentialGroceryList = potentialGroceryList.concat(returnDifference(ingredients, inStock));
			}
		}
		
	}
	allMatches = removeDuplicates(allMatches);
	potentialGroceryList = removeDuplicates(potentialGroceryList);
	for(var k = 0; k < allMatches.length; k++){
		highlight(allMatches[k], num, "in-stock", true)
	}
	console.log("potential g list:  " + potentialGroceryList);
	console.log("instock:  " + allMatches);
	ingredientColor = backgroundWrapper(num, true, potentialGroceryList, "ingredients");
	ingredientColor(recipeList[getCurrentRecipe()]);
	console.log("BEFORE STAGE potential g list:  " + potentialGroceryList);
	
	stageResults(potentialGroceryList, num);
	console.log("AFTER STAGE potential g list:  " + potentialGroceryList);
	localStorage.setItem('potentialGroceryList', potentialGroceryList);
}

var backgroundWrapper = function(num, faded, arr, id) {
	console.log("glist 1: " + arr);
	return function (list) {
		var ingredients = returnMatches(list, arr);
		for (var i = 0; i < ingredients.length; i++){
			highlight(ingredients[i], num, id, faded);
		}
	}
}

//makes the visual changes to illustrate the autopopulate process
var stageResults = function(arr, num){
	var arr2 = arr.slice();
	var listItem;
	var groceryList = localStorage.getItem('groceryList').split(",");
	var matches = returnMatches(arr2, groceryList);
	for(var i = 0; i < matches.length; i++){
		highlight(matches[i], num, "to-buy", true);
		var j = arr2.indexOf(matches[i]);
		arr2.splice(j, 1);
	}
	for(var i = 0; i < arr2.length; i++){
		listItem = createBasicListItem(arr2[i], "grocery");
		listItem.style.background = numColor(num);
		groceryListHolder.insertBefore(listItem, groceryListHolder.firstChild);
	}
	
}

//helper function to help highlight listitems for the autopopulate
var highlight = function (label, num, id, faded){
	listItem = returnListItemFromLabel(label, id);
	listItem.style.background = numColor(num, faded);
}

//helper function returns color for appropriate situation
var numColor = function (num, faded) {
	if(num === 1){
		if (faded === true){
			return "#FFC0C0";
		}else {
		    return "red";
		}
	} else if (num === 2){
		if (faded === true){
			return "#FFDFA3";
		} else {
			return "orange";
		}
	} else if (num === 3){
		if (faded === true) {
			return "#FFFFC2";
		} else{
		    return "yellow";
		}
	} else if (num === 4){
		if (faded === true){
			return "#C0F3C0";
		}else {
		    return "#00cf00";
		}
	} else {
		return null;
	}
}

//helper function clears all listItems on page, then reloads from loacal storage
var reLoad = function () {
	while(groceryListHolder.firstChild){
		groceryListHolder.removeChild(groceryListHolder.firstChild);
	}
	while(inStockListHolder.firstChild){
		inStockListHolder.removeChild(inStockListHolder.firstChild);
	}
	while(recipeListHolder.firstChild){
		recipeListHolder.removeChild(recipeListHolder.firstChild);
	}
	while(ingredientListHolder.firstChild){
		ingredientListHolder.removeChild(ingredientListHolder.firstChild);
	}
	if (localStorage.getItem('potentialGroceryList') !== null){
		localStorage.removeItem('potentialGroceryList');
	}
	loadPage();
}

//helper returns an array of matches between 2 arrays
var returnMatches = function (ingredients, inStock){
	var matches = [];
	for(var i = 0; i < ingredients.length; i++) {
		for(var j = 0; j < inStock.length; j++){
			if(ingredients[i] === inStock[j]){
				matches.push(ingredients[i]);
			}
		}
	}
	return matches;
}

//helper returns an array of differences between 2 arrays
var returnDifference = function (ingredients, inStock){
	var difference = [];
	var matched = false;
	for(var i = 0; i < ingredients.length; i++) {
		for(var j = 0; j < inStock.length; j++){
			if(ingredients[i] === inStock[j]){
				matched = true;
			}
		}
		if(!matched){
			difference.push(ingredients[i]);
		}
		matched = false;
	}
	return difference;	
}

//helper takes an array, returns an array without duplicates
var removeDuplicates = function (arr){
	newArr = [];
	obj = {};
	for(var i = 0; i < arr.length; i++){
		obj[arr[i]] = 0;
	}
	for(var j in obj){
		newArr.push(j);
	}
	return newArr;
}

//commits the changes shown by the autopopulate feature, and reloads the page
var commitList = function() {
	if (localStorage.getItem('potentialGroceryList') !== null){
	    var newItems = localStorage.getItem('potentialGroceryList').split(",");
	    var groceryList;
	    if (newItems !== null && newItems !== undefined && (newItems.length > 0)){
	    	groceryList = localStorage.getItem('groceryList').split(",");
	    	groceryList = newItems.concat(groceryList);
			groceryList = removeDuplicates(groceryList);
	    	localStorage.setItem('groceryList', groceryList);
	    	localStorage.removeItem('potentialGroceryList');
	    }
	}
	ingredientColor = function(list) {};
	reLoad();
}

//shows the status of the localData in the console, for debugging purposes
var showData = function() {
	var recipes = JSON.parse(localStorage.getItem('recipeList'));
	console.log("grocery list: " + localStorage.getItem('groceryList').split(",") + " length " + localStorage.getItem('groceryList').split(",").length);
	console.log("instock list: " + localStorage.getItem('inStock').split(",") + " length " + localStorage.getItem('inStock').split(",").length);
	console.log("recipe list: " + Object.keys(recipes) + " length " + Object.keys(recipes).length);
	console.log("ingredient lists");
	for(var i = 0; i < Object.keys(recipes).length; i++){
		console.log(recipes[Object.keys(recipes)[i]] + " length " + recipes[Object.keys(recipes)[i]].length);
	}
	console.log("recipeListHolder children " + recipeListHolder.children + " length " + recipeListHolder.children.length);
	
}

groceryButton.onclick = addItem("grocery");
inStockButton.onclick = addItem("instock");
ingredientButton.onclick = addItem("ingredient");
recipeButton.onclick = addItem("recipe");
resetButton.addEventListener("click", function (){return window.location.reload();});
fourButton.addEventListener("click", stageList(4));
threeButton.addEventListener("click", stageList(3));
twoButton.addEventListener("click", stageList(2));
oneButton.addEventListener("click", stageList(1));
commitButton.addEventListener("click", commitList);


initLocalStorage();
loadPage();
//showData();

