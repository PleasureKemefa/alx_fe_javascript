// Load saved quotes or fallback to default list
let quoteList = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only way to do great work is to love what you do.", category: "work" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "In the middle of difficulty lies opportunity.", category: "inspiration" },
  { text: "Simplicity is the ultimate sophistication.", category: "wisdom" },
  { text: "Stay hungry, stay foolish.", category: "motivation" },
  { text: "Nothing lasts forever, both good and bad.", category: "mystery" }
];

// DOM references
const quoteBox = document.getElementById('quoteBox');
const loadQuoteBtn = document.getElementById('loadQuoteBtn');
const submitQuoteBtn = document.getElementById('submitQuote');
const categorySelector = document.getElementById('filterSelect');

// On page load
document.addEventListener('DOMContentLoaded', () => {
  refreshCategoryList();
  renderRandomQuote();
  loadQuoteBtn.addEventListener('click', renderRandomQuote);
  submitQuoteBtn.addEventListener('click', handleQuoteSubmit);
  categorySelector.addEventListener('change', renderRandomQuote);
});

// Show a random quote (filtered if needed)
function renderRandomQuote() {
  const selected = categorySelector.value;
  const pool = selected === 'all' ? quoteList : quoteList.filter(q => q.category === selected);

  if (pool.length === 0) {
    quoteBox.innerHTML = <p>No quotes found for selected category.</p>;
    return;
  }

  const quote = pool[Math.floor(Math.random() * pool.length)];
  quoteBox.innerHTML = 
    <blockquote>"${quote.text}"</blockquote>
    <p class="quote-category">– ${capitalize(quote.category)}</p>
  ;
}

// Add a new quote
function handleQuoteSubmit() {
  const text = document.getElementById('quoteInput').value.trim();
  const category = document.getElementById('categoryInput').value.trim().toLowerCase();

  if (!text || !category) {
    alert("Please fill out both fields before submitting.");
    return;
  }

  const newEntry = { text, category };
  quoteList.push(newEntry);
  localStorage.setItem('quotes', JSON.stringify(quoteList));

  document.getElementById('quoteInput').value = '';
  document.getElementById('categoryInput').value = '';

  refreshCategoryList();
  renderRandomQuote();
}

// Populate category dropdown
function refreshCategoryList() {
  const seen = new Set(['all']);
  quoteList.forEach(q => seen.add(q.category));

  categorySelector.innerHTML = '';
  seen.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat === 'all' ? 'All Categories' : capitalize(cat);
    categorySelector.appendChild(option);
  });
}

// Capitalize first letter
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
