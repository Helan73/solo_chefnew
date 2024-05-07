let addIngredientsBtn = document.getElementById('addIngredientsBtn');
let ingredientList = document.querySelector('.ingredientList');
let ingredientDiv = document.querySelectorAll('.ingredientDiv')[0];

addIngredientsBtn.addEventListener('click', function(){
    let newIngredients = ingredientDiv.cloneNode(true);
    let input = newIngredients.getElementsByTagName('input')[0];
    input.value = '';
    
    // Create a button to remove the ingredient
    let removeButton = document.createElement('button');
    removeButton.textContent = '-';
    removeButton.classList.add('btn', 'btn-outline-danger', 'mx-2');
    removeButton.type = 'button';
    removeButton.addEventListener('click', function() {
        newIngredients.remove();
    });
    
    // Append the remove button
    newIngredients.appendChild(removeButton);
    
    ingredientList.appendChild(newIngredients);
});
