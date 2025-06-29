// Quote database
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "work" },
    { text: "Life is what happens when you're busy making other plans.", category: "life" },
    { text: "In the middle of difficulty lies opportunity.", category: "inspiration" },
    { text: "Simplicity is the ultimate sophistication.", category: "wisdom" },
    { text: "Stay hungry, stay foolish.", category: "motivation" },
    { text: "Nothing lasts for ever, both good and bad.", category: "mystery" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

// Initialize the application
function init() {
    // Load quotes from local storage
    loadQuotes();
    
    // Create the form for adding quotes
    createAddQuoteForm();
    
    // Create category selector
    createCategorySelector();
    
    // Show last viewed quote or a random one
    const lastQuote = sessionStorage.getItem('lastQuote');
    if (lastQuote) {
        const quote = JSON.parse(lastQuote);
        quoteDisplay.innerHTML = 
            <blockquote>"${quote.text}"</blockquote>
            <p class="category">— ${quote.category.charAt(0).toUpperCase() + quote.category.slice(1)}</p>
        ;
    } else {
        showRandomQuote();
    }
    
    // Event listener for new quote button
    newQuoteBtn.addEventListener('click', showRandomQuote);
    
    // Periodic server sync (every 30 seconds)
    setInterval(syncWithServer, 30000);
}

// Load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
    updateCategorySelector();
    filterQuotes();
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    updateCategorySelector();
    filterQuotes();
}

// Create form for adding new quotes
function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.className = 'input-group';
    formContainer.innerHTML = 
        <h2>Add New Quote</h2>
        <label for="newQuoteText">Quote:</label>
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <label for="newQuoteCategory">Category:</label>
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
    ;
    document.body.insertBefore(formContainer, document.getElementById('importFile').parentNode);
}

// Create category selector dropdown
function createCategorySelector() {
    const selectorContainer = document.createElement('div');
    selectorContainer.className = 'input-group';
    selectorContainer.innerHTML = 
        <label for="categorySelect">Filter by Category:</label>
        <select id="categorySelect" onchange="filterQuotes()">
            <option value="all">All Categories</option>
        </select>
    ;
    document.body.insertBefore(selectorContainer, quoteDisplay);
    updateCategorySelector();
}

// Update category selector options
function updateCategorySelector() {
    const categorySelect = document.getElementById('categorySelect');
    const currentCategory = localStorage.getItem('selectedCategory') || 'all';
    
    // Get unique categories
    const categories = ['all', ...new Set(quotes.map(quote => quote.category))];
    
    // Repopulate selector
    categorySelect.innerHTML = '';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category === 'all' ? 'All Categories' : 
                           category.charAt(0).toUpperCase() + category.slice(1);
        categorySelect.appendChild(option);
    });
    
    // Restore selected category
    categorySelect.value = currentCategory;
}
// Display a random quote
function showRandomQuote() {
    const categorySelect = document.getElementById('categorySelect');
    const selectedCategory = categorySelect.value;
    
    // Filter quotes by selected category
    let filteredQuotes = selectedCategory === 'all' ? 
        quotes : 
        quotes.filter(quote => quote.category === selectedCategory);
    
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes found in this category.</p>';
        return;
    }
    
    // Get random quote
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    
    // Display the quote
    quoteDisplay.innerHTML = 
        <blockquote>"${quote.text}"</blockquote>
        <p class="category">— ${quote.category.charAt(0).toUpperCase() + quote.category.slice(1)}</p>
    ;
    
    // Save to session storage
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

// Filter quotes by selected category
function filterQuotes() {
    const categorySelect = document.getElementById('categorySelect');
    const selectedCategory = categorySelect.value;
    localStorage.setItem('selectedCategory', selectedCategory);
    
    let filteredQuotes = selectedCategory === 'all' ? 
        quotes : 
        quotes.filter(quote => quote.category === selectedCategory);
    
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes found in this category.</p>';
    } else {
        quoteDisplay.innerHTML = filteredQuotes.map(quote => 
            <blockquote>"${quote.text}"</blockquote>
            <p class="category">— ${quote.category.charAt(0).toUpperCase() + quote.category.slice(1)}</p>
        ).join('');
    }
}

// Add a new quote
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim().toLowerCase();
    
    if (quoteText && quoteCategory) {
        const newQuote = { text: quoteText, category: quoteCategory };
        quotes.push(newQuote);
        saveQuotes();
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('Quote added successfully!');
        syncWithServer();
    } else {
        alert('Please enter both a quote and a category');
    }
}

// Export quotes to JSON file
function exportToJsonFile() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                alert('Quotes imported successfully!');
                syncWithServer();
            } else {
                alert('Invalid JSON format. Please upload a valid quotes array.');
            }
        } catch (e) {
            alert('Error importing quotes: ' + e.message);
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Simulate server syncing with JSONPlaceholder
async function syncWithServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quotes)
        });
        const serverData = await response.json();
// Simulate server response with IDs
        const serverQuotes = quotes.map((quote, index) => ({
            ...quote,
            id: index + 1
        }));
        
        const conflicts = checkForConflicts(quotes, serverQuotes);
        const notification = document.getElementById('conflictNotification');
        if (conflicts.length > 0) {
            notification.innerHTML = 
                <p>Conflicts detected! Server data takes precedence. 
                <button onclick="resolveConflicts()">Resolve Manually</button></p>
            ;
            notification.style.display = 'block';
        } else {
            quotes = serverQuotes;
            saveQuotes();
            notification.textContent = 'Data synced with server successfully!';
            notification.style.display = 'block';
            setTimeout(() => { notification.style.display = 'none'; }, 3000);
        }
    } catch (error) {
        console.error('Error syncing with server:', error);
        const notification = document.getElementById('conflictNotification');
        notification.textContent = 'Error syncing with server.';
        notification.style.display = 'block';
    }
}

// Check for conflicts
function checkForConflicts(localQuotes, serverQuotes) {
    const conflicts = [];
    localQuotes.forEach((localQuote, index) => {
        const serverQuote = serverQuotes[index];
        if (serverQuote && (localQuote.text !== serverQuote.text || localQuote.category !== serverQuote.category)) {
            conflicts.push({ local: localQuote, server: serverQuote });
        }
    });
    return conflicts;
}

// Resolve conflicts (placeholder)
function resolveConflicts() {
    alert('Manual conflict resolution not implemented. Using server data.');
    quotes = quotes.map((quote, index) => ({
        ...quote,
        id: index + 1
    }));
    saveQuotes();
    document.getElementById('conflictNotification').style.display = 'none';
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);        
