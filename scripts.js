// Get HTML elements
const cuisineButtons = document.querySelectorAll('.cuisine-button');
const categoryInput = document.querySelector('#category-input');
const ingredientInput = document.querySelector('#ingredient-input');
const toneSelect = document.querySelector('#tone-select');
const generateButton = document.querySelector('#generate-button');
const outputTitle = document.querySelector('#output-title');
const outputDescription = document.querySelector('#output-description');
const otherCuisineInput = document.querySelector('#other-cuisine-input');

// Set up OpenAI API client
const openai = new OpenAI('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');

// Add event listeners
cuisineButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.value === 'Other') {
      otherCuisineInput.style.display = 'block';
    } else {
      otherCuisineInput.style.display = 'none';
    }
  });
});

generateButton.addEventListener('click', () => {
  // Get user inputs
  const cuisine = document.querySelector('input[name="cuisine"]:checked').value;
  const category = categoryInput.value.trim();
  const ingredients = ingredientInput.value.trim();
  const tone = toneSelect.value;
  const prompt = `Generate an item name and description for a ${cuisine.toLowerCase()} dish that is ${tone.toLowerCase()}. The dish is a ${category.toLowerCase()} made with ${ingredients.toLowerCase()}.`;
  
  // Generate text with OpenAI API
  openai.complete({
    engine: 'text-davinci-002',
    prompt: prompt,
    maxTokens: 60,
    n: 1,
    stop: ['\n'],
    temperature: 0.5,
  })
  .then(response => {
    // Display output
    const output = response.data.choices[0].text.trim();
    const [title, description] = output.split(' - ');
    outputTitle.textContent = title;
    outputDescription.textContent = description;
  })
  .catch(error => {
    console.log(error);
  });
});
