let quotes = [];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const addQuoteButton = document.getElementById("addQuoteBtn");
const exportButton = document.getElementById("exportQuotes");
const importFileInput = document.getElementById("importFile");
const categoryFilter = document.getElementById("categoryFilter");

// ========== STORAGE ==========
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    quotes = [
      { text: "The only limit is your mind.", category: "Motivation" },
      { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
      { text: "This too shall pass.", category: "Wisdom" }
    ];
    saveQuotes();
  }
}

// ========== CATEGORY MANAGEMENT ==========
function getUniqueCategories() {
  const categories = new Set(quotes.map(q => q.category));
  return Array.from(categories);
}

function populateCategories() {
  const categories = getUniqueCategories();
  categoryFilter.innerHTML = <option value="all">All Categories</option>;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
    filterQuotes();
  }
}

// ========== DISPLAY ==========
function showRandomQuote() {
  let filteredQuotes = quotes;

  const selectedCategory = categoryFilter.value;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = "${quote.text}" - (${quote.category});

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// ========== ADD ==========
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Both quote and category are required.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();

  textInput.value = "";
  categoryInput.value = "";
  alert("Quote added!");

  populateCategories(); // Update dropdown
  filterQuotes(); // Refresh display
}

// ========== FILTER ==========
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  showRandomQuote(); // Show a quote from the selected category
}

// ========== IMPORT/EXPORT ==========
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported!");

        populateCategories();
        filterQuotes();
      } else {
        alert("Invalid file format. Must be an array of quotes.");
      }
    } catch (error) {
      alert("Failed to import JSON: " + error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
}
// ========== EVENT LISTENERS ==========
newQuoteButton.addEventListener("click", showRandomQuote);
addQuoteButton.addEventListener("click", addQuote);
exportButton.addEventListener("click", exportToJsonFile);
importFileInput.addEventListener("change", importFromJsonFile);
categoryFilter.addEventListener("change", filterQuotes);

// ========== INIT ==========
loadQuotes();
populateCategories();

// Restore last quote if available
const last = sessionStorage.getItem("lastQuote");
if (last) {
  const quote = JSON.parse(last);
  quoteDisplay.textContent = "${quote.text}" - (${quote.category});
} else {
  showRandomQuote();
}
