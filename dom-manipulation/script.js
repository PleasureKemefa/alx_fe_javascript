// Initial quote data
let quotes = [
  { text: "Believe you can and you're halfway there.", category: "Motivation" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
  { text: "Do what you can, with what you have, where you are.", category: "Motivation" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");
const addQuoteBtn = document.getElementById("addQuoteBtn");

// Show a random quote
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = "${filteredQuotes[randomIndex].text}" - (${filteredQuotes[randomIndex].category});
}

// Add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newQuoteText = textInput.value.trim();
  const newQuoteCategory = categoryInput.value.trim();

  if (!newQuoteText || !newQuoteCategory) {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);

  updateCategoryDropdown(newQuoteCategory);

  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
}

// Update the category dropdown
function updateCategoryDropdown(newCategory) {
  const options = Array.from(categorySelect.options).map(opt => opt.value.toLowerCase());

  if (!options.includes(newCategory.toLowerCase())) {
    const option = document.createElement("option");
    option.value = newCategory;
    option.textContent = newCategory;
    categorySelect.appendChild(option);
  }
}

// Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);