'use strict';

const users = [
    {
        "username": "Yaser Habrat",
        "phone": "050-3443181",
        "email": "yaser@gmail.com",
        "photo": "images/boy.png",
        "address":"Kfar Kanna"
    },
    {
        "username": "Jana Khlaily",
        "email": "jana@gmail.com",
        "phone": "050-8531114",
        "photo": "images/girl.png" ,
        "address":"Majd al-krum "
    },
    {
        "username": "Also Bondeg",
        "email": "also@gmail.com",
        "phone": "050-1234567",
        "photo": "images/girl.png",
        "address":"Haifa"
    },
    {
        "username": "Christian Levi",
        "email": "christian@gmail.com",
        "phone": "050-1112245",
        "photo": "images/boy.png",
        "address":"Tel-aviv"
    },
    {
        "username": "Alex Rody ",
        "email": "alec9d@gmail.com",
        "phone": "050-1112223",
        "photo": "images/boy.png",
        "address":"Nazareth"
    },
    {
        "username": "sbestian valero ",
        "email": "wdistian@gmail.com",
        "phone": "050-1111223",
        "photo": "images/boy.png",
        "address":"Nof Hagalil"
    },



];
const list = document.querySelector(".list");
const searchInput = document.getElementById('searchInput');
const searchActivePage = document.getElementById('searchActivePage');

// Load contacts into the HTML page
function loadContacts(filteredUsers = users) {
  filteredUsers.sort((a, b) => a.username.localeCompare(b.username));

  list.innerHTML = '';
  filteredUsers.forEach((user, index) => {
    const item = document.createElement('li');
    item.className = "contact-item";
    item.innerHTML = `
      <img src="${user.photo}" alt="${user.username}'s photo" class="contact-img">
      <div class="contact-info">
        <span class="contact-name">${user.username}</span>
        <p>${user.phone}</p>
      </div>
      <div class="actions">
        <button onclick="showContactInfo(${index})"><img src="images/information.png" alt="Info"></button>
        <button onclick="editContact(${index})"><img src="images/edit.png" alt="Edit"></button>
        <button onclick="deleteContact(${index})"><img src="images/delete.png" alt="Delete"></button>
      </div>
    `;
    list.appendChild(item);
  });
  updatePeopleCount();
}

// Show detailed contact information in a modal
function showContactInfo(index) {
  const user = users[index];
  document.getElementById('infoName').textContent = `Name: ${user.username}`;
  document.getElementById('infoPhone').textContent = `Phone: ${user.phone}`;
  document.getElementById('infoAddress').textContent = `Address: ${user.address || 'N/A'}`;
  document.getElementById('infoEmail').textContent = `Email: ${user.email || 'N/A'}`;
  document.getElementById('infoModal').style.display = 'flex';
}

// Close the information modal
function closeInfoPopup() {
  document.getElementById('infoModal').style.display = 'none';
}

// Open the popup to add or edit a contact
function openPopup() {
  document.getElementById('popupTitle').innerText = 'Add Contact';
  document.getElementById('contactIndex').value = '';
  document.getElementById('inputUserName').value = '';
  document.getElementById('inputUserPhone').value = '';
  document.getElementById('inputUserAddress').value = '';
  document.getElementById('inputUserEmail').value = '';
  document.getElementById('inputUserPhoto').value = '';
  document.getElementById('myModal').style.display = 'flex';
}

// Close the modal
function closeModal(event) {
  if (event.target === document.getElementById('myModal') || event.target === document.getElementById('closeModalBtn')) {
    document.getElementById('myModal').style.display = 'none';
  }
}

// Save the contact (add or edit)
function saveContact() {
  const index = document.getElementById('contactIndex').value;
  const name = document.getElementById('inputUserName').value.trim();
  const phone = document.getElementById('inputUserPhone').value.trim();
  const address = document.getElementById('inputUserAddress').value.trim();
  const email = document.getElementById('inputUserEmail').value.trim();
  const photoInput = document.getElementById('inputUserPhoto');
  let photo = '';

  // Check for duplicate contacts (same name or phone number)
  const duplicateUser = users.find((user, idx) => 
    (user.phone === phone || user.username === name) && idx.toString() !== index
  );

  if (duplicateUser) {
    alert("Contact with the same name or phone number already exists.");
    return;
  }

  // Process photo input
  if (photoInput.files && photoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      photo = e.target.result;
      saveOrUpdateUser(index, name, phone, address, email, photo);
    }
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    saveOrUpdateUser(index, name, phone, address, email, 'images/default.jpg');
  }
}

// Save or update user function
function saveOrUpdateUser(index, name, phone, address, email, photo) {
  if (index === '') {
    // Add new contact
    users.push({ id: (users.length + 1).toString(), username: name, phone: phone, address: address, email: email, photo: photo });
  } else {
    // Update existing contact
    users[index] = { ...users[index], username: name, phone: phone, address: address, email: email, photo: photo };
  }
  closeModal({ target: document.getElementById('myModal') });
  loadContacts();
}

// Edit a contact
function editContact(index) {
  document.getElementById('popupTitle').innerText = 'Edit Contact';
  document.getElementById('contactIndex').value = index;
  document.getElementById('inputUserName').value = users[index].username;
  document.getElementById('inputUserPhone').value = users[index].phone;
  document.getElementById('inputUserAddress').value = users[index].address || '';
  document.getElementById('inputUserEmail').value = users[index].email || '';
  document.getElementById('inputUserPhoto').value = ''; // Clear photo input
  document.getElementById('myModal').style.display = 'flex';
}

// Delete a contact with confirmation
function deleteContact(index) {
  const contactName = users[index].username;
  const confirmDelete = window.confirm(`Are you sure you want to delete ${contactName}?`);
  if (confirmDelete) {
    users.splice(index, 1);
    updatePeopleCount();
    loadContacts();
  }
}

// Delete all contacts with confirmation
function deleteAllContacts() {
  const confirmDeleteAll = window.confirm("Are you sure you want to delete all contacts?");
  if (confirmDeleteAll) {
    users.length = 0;
    updatePeopleCount();
    loadContacts();
  }
}

// Filter contacts based on search input
function filterContacts() {
  const query = searchInput.value.toLowerCase();
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(query) || user.phone.includes(query)
  );

  if (query.length > 0) {
    searchActivePage.style.display = 'block';
    loadContacts(filteredUsers);
  } else {
    searchActivePage.style.display = 'none';
    loadContacts(users);
  }
}

// Update the displayed count of contacts
function updatePeopleCount() {
  const count = users.length;
  document.getElementById('peopleCount').textContent = `${count} People`;
}

document.addEventListener('DOMContentLoaded', () => {
  loadContacts();
});

// Update the search after filtering
searchInput.addEventListener('input', filterContacts);
