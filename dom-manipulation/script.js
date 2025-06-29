// Quote array with initial data
let quotes = [
  { text: "Believe you can and you're halfway there.", category: "Motivation" },
  { text: "Do what you can, with what you have, where you are.", category: "Action" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Resilience" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const categorySelect = document.getElementById("categorySelect");

// Function to display a random quote
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
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = "${quote.text}" - (${quote.category});
}

// Function to add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newText || !newCategory) {
    alert("Please fill in both the quote and category.");
    return;
  }

  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);

  // Update category dropdown if new
  updateCategoryDropdown(newCategory);

  // Clear inputs
  textInput.value = "";
  categoryInput.value = "";

  alert("New quote added successfully!");
}

// Function to update the category dropdown
function updateCategoryDropdown(category) {
  const exists = Array.from(categorySelect.options).some(
    option => option.value.toLowerCase() === category.toLowerCase()
  );

  if (!exists) {
    const newOption = document.createElement("option");
    newOption.value = category;
    newOption.textContent = category;
    categorySelect.appendChild(newOption);
  }
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// Populate dropdown with initial categories
quotes.forEach(q => updateCategoryDropdown(q.category));
