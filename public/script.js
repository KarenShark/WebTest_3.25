let currentMood = null;

document.querySelectorAll('.mood-btn').forEach(button => {
    button.addEventListener('click', () => {
        currentMood = button.dataset.mood;
        
        // 更新按钮状态
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        fetchRecipe();
    });
});

document.getElementById('new-recipe').addEventListener('click', fetchRecipe);

function fetchRecipe() {
    if (!currentMood) return;
    
    fetch(`/api/recipe/${currentMood}`)
        .then(response => response.json())
        .then(recipe => {
            document.getElementById('recipe-container').classList.remove('hidden');
            document.getElementById('recipe-name').textContent = recipe.name;
            document.getElementById('recipe-ingredients').textContent = recipe.ingredients.replace(/,/g, ', ');
            document.getElementById('recipe-instructions').textContent = recipe.instructions.replace(/\\n/g, '\n');
        })
        .catch(error => console.error('Error:', error));
} 