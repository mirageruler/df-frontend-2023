// Sample data (placeholder)
let books = {
    "Book 1": { title: "Book 1", author: "Author 1", topic: "Topic 1" },
    "Book 2": { title: "Book 2", author: "Author 2", topic: "Topic 2" },
    "Book 3": { title: "Book 3", author: "Author 3", topic: "Topic 3" },
};

// Function to display books in the table
function displayBooks(filteredBooks) {
    const table = document.getElementById("bookTable");
    table.innerHTML = `
        <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Topic</th>
            <th>Action</th>
        </tr>
    `;
    for (const title in filteredBooks) {
        const book = filteredBooks[title];
        const row = table.insertRow();
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.topic}</td>
        <td>
            <button class="delete-button" onclick="openDeleteBookDialog('${title}')">Delete</button>
        </td>
        `;
    }
}

// Function to filter and display books in real-time
function filterBooks() {
    const searchTitle = document.getElementById("searchTitle").value.toLowerCase();
    const filteredBooks = {};
    for (const title in books) {
        if (title.toLowerCase().includes(searchTitle)) {
            filteredBooks[title] = books[title];
        }
    }
    displayBooks(filteredBooks);
}

// Function to open the Delete Confirmation Modal
function openDeleteBookDialog(bookTitle) {
    const deleteDialog = document.getElementById("deleteBookDialog");
    const deleteConfirmationText = document.getElementById("deleteConfirmationText");
    deleteConfirmationText.innerHTML = `Do you want to delete <strong>${bookTitle}</strong>?`;

    // Set up a click event for the "Delete" button
    const confirmButton = document.getElementById("modalDeleteButton");
    confirmButton.addEventListener("click", function () {
        deleteBook(bookTitle);
        closeDialog('deleteBookDialog');
    });
    // Display the dialog
    deleteDialog.style.display = "flex";
}

// Function to delete a book by title
function deleteBook(bookTitle) {
    delete books[bookTitle];
    filterBooks(); // Update the displayed books
}

// Function to open the Add Book Modal
function openAddBookDialog() {
    const addDialog = document.getElementById("addBookDialog");

    // Display the dialog
    addDialog.style.display = "flex";
}

// Function to add a new book from the modal
function addBookFromDialog() {
    const title = document.getElementById("modalTitle").value;
    const author = document.getElementById("modalAuthor").value;
    const topic = document.getElementById("modalTopic").value;
    
    if (title && author) {
        books[title] = { title, author, topic };
        displayBooks(books); // Update the displayed books
        closeDialog('addBookDialog'); // Close the modal
        // Clear input fields
        document.getElementById("modalTitle").value = "";
        document.getElementById("modalAuthor").value = "";
    }
}

// Function to close the modal
function closeDialog(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "none";
}

// Attach an input event listener to the search textbox
document.getElementById("searchTitle").addEventListener("input", filterBooks);

// Initial display of books
displayBooks(books);
