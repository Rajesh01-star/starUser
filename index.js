let isEditing = false;  // Track if we are in editing mode
let currentEditId = null;  // Store the ID of the user being edited

// Handle the submit button click for both adding and editing users
const submitBtn = document.querySelector(".submitBtn");
submitBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const nameField = document.querySelector("#name").value; // Get the name from the input field
    const ratingField = document.querySelector("#rating").value; // Get the rating from the input field

    if (isEditing && currentEditId) {
        // Call the function to submit the edited user
        await submitEditedUser(currentEditId, nameField, ratingField);
    } else {
        // Call the function to add a new user
        await addNewUser(nameField, ratingField);
    }
});

// Fetch and display users
async function getUsers() {
    console.log("here again")
    try {
        const response = await fetch("https://ca7e9e9c574b6329206f.free.beeceptor.com/api/users/");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Fetched Data:", data);

        const nameList = document.querySelector(".nameList");
        nameList.innerHTML = ""; // Clear any existing list items before adding new ones

        data.forEach((user) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${user.name} - ${user.rating}
                <button class="editBtn">Edit</button>
                <button class="deleteBtn">Delete</button>
            `;
            nameList.appendChild(li);

            // Add event listener for the delete button
            const deleteBtn = li.querySelector(".deleteBtn");
            deleteBtn.addEventListener("click", () => deleteUser(user.id));

            // Add event listener for the edit button
            const editBtn = li.querySelector(".editBtn");
            editBtn.addEventListener("click", () => editUser(user.id, user.name, user.rating));
        });
    } catch (err) {
        console.error("There was a problem fetching the users:", err);
    }
}

// Function to add a new user
async function addNewUser(name, rating) {
    try {
        const response = await fetch("https://ca7e9e9c574b6329206f.free.beeceptor.com/api/users/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, rating: rating }),
        });

        if (!response.ok) {
            throw new Error("Could not add the user");
        }

        const newUser = await response.json(); // Get the added user data from the response
        console.log("User added successfully:", newUser);

        // Reset the form and fetch the updated user list
        resetForm();
        await getUsers(); // Wait for the users to be fetched
    } catch (error) {
        console.error("Error adding user:", error);
    }
}

// Delete user function
async function deleteUser(id) {
    try {
        const response = await fetch(`https://ca7e9e9c574b6329206f.free.beeceptor.com/api/users/${id}`, { method: "DELETE" });
        if (!response.ok) {
            throw new Error("Failed to delete user");
        }
        console.log(`User with ID ${id} deleted successfully`);
        await getUsers(); // Wait for the users to be fetched
    } catch (err) {
        console.error("There was a problem deleting the user:", err);
    }
}

// Edit user function: populate fields and prepare for edit submission
function editUser(id, name, rating) {
    const nameField = document.querySelector("#name");
    const ratingField = document.querySelector("#rating");
    submitBtn.innerText = "Edit"; // Change button text to indicate editing
    nameField.value = name; // Populate the name field
    ratingField.value = rating; // Populate the rating field
    
    // Set edit state
    isEditing = true;
    currentEditId = id; // Store the current user's id for editing
}

// Submit edited user details
async function submitEditedUser(id, name, rating) {
    try {
        const response = await fetch(`https://ca7e9e9c574b6329206f.free.beeceptor.com/api/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, rating: rating }),
        });

        if (!response.ok) {
            throw new Error("Could not edit the user");
        }

        const updatedUser = await response.json();
        console.log("User updated successfully:", updatedUser);

        // Reset form and fetch updated users
        resetForm();
        await getUsers(); // Wait for the users to be fetched
    } catch (error) {
        console.error("Error updating user:", error);
    }
}

// Reset form and button state
function resetForm() {
    document.querySelector("#name").value = ""; // Clear the name field
    document.querySelector("#rating").value = "1"; // Reset to default rating
    submitBtn.innerText = "Submit"; // Reset button text to "Submit"
    isEditing = false;
    currentEditId = null; // Clear the current edit ID
}

// Load users when the page is ready
window.addEventListener("DOMContentLoaded", ()=>{
    getUsers();
});
