// Get HTML elements
const cuisineButtons = document.querySelectorAll(".cuisine-button");
const categoryInput = document.querySelector("#category-input");
const ingredientInput = document.querySelector("#ingredient-input");
const toneSelect = document.querySelector("#tone-select");
const generateButton = document.querySelector("#generate-button");
const outputTitle = document.querySelector("#output-title");
const outputDescription = document.querySelector("#output-description");
const otherCuisineInput = document.querySelector("#other-cuisine-input");

// Add event listeners
cuisineButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.value === "Other") {
      otherCuisineInput.style.display = "block";
    } else {
      otherCuisineInput.style.display = "none";
    }
  });
});

generateButton.addEventListener("click", async () => {
  // Get user inputs
  const cuisine = document.querySelector('input[name="cuisine"]:checked').value;
  const category = categoryInput.value.trim();
  const ingredients = ingredientInput.value.trim();
  const tone = toneSelect.value;
  const prompt = `Generate an item name and description for a ${cuisine.toLowerCase()} dish that is ${tone.toLowerCase()}. The dish is a ${category.toLowerCase()} made with ${ingredients.toLowerCase()}.{}`;

  let body = {prompt, model: "text-davinci-003", "max_tokens": 100, stop: "{}", temperature: 0.5, n: 1}
  const headers =  { Authorization : "Bearer REPLACEMEWITHTOKEN", "Content-Type": "application/json"};

  try {
    body = JSON.stringify(body);
    const response = await fetch("https://api.openai.com/v1/completions", { method: "POST", headers , body });

    const reader = response.body.getReader();
    const stream = new ReadableStream({
      start(controller) {
        return pump();
        function pump() {
          return reader.read().then(({ done, value }) => {
            // When no more data needs to be consumed, close the stream
            if (done) {
              controller.close();
              return;
            }
            // Enqueue the next data chunk into our target stream
            controller.enqueue(value);
            return pump();
          });
        }
      },
    });

    let result = await new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
    result = JSON.parse(result)

    const output = result.choices[0].text.trim();
    const [title, description] = output.split(" - ");

    outputTitle.textContent = title;
    outputDescription.textContent = description;
  } catch (error) {
    console.log(error)
  }
});
