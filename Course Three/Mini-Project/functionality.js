document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const studentForm = document.getElementById('studentForm');
    const recordsList = document.getElementById('recordsList');
    const searchInput = document.getElementById('searchInput');
    const submitBtn = document.getElementById('submitBtn');
    const addNewRowBtn = document.getElementById('addNewRow');
    
    // Form input fields
    const nameInput = document.getElementById('studentName');
    const idInput = document.getElementById('studentID');
    const emailInput = document.getElementById('studentEmail');
    const contactInput = document.getElementById('studentContact');
    
    // Error message elements
    const nameError = document.getElementById('nameError');
    const idError = document.getElementById('idError');
    const emailError = document.getElementById('emailError');
    const contactError = document.getElementById('error-message');

    // Student Data
    let students = JSON.parse(localStorage.getItem('students')) || [];
    let currentEditIndex = -1;
    let isAddingNewRow = false;
    
    // Initialize the app
    renderStudentList(students);
    
    // Event Listeners
    studentForm.addEventListener('submit', handleFormSubmit);
    searchInput.addEventListener('input', handleSearch);
    addNewRowBtn.addEventListener('click', startAddNewRow);
    
    // Input validation listeners
    nameInput.addEventListener('input', () => validateInput(nameInput, validateName(nameInput.value), nameError));
    idInput.addEventListener('input', () => validateInput(idInput, validateId(idInput.value), idError));
    emailInput.addEventListener('input', () => validateInput(emailInput, validateEmail(emailInput.value), emailError));
    contactInput.addEventListener('input', () => validateInput(contactInput, validateContact(contactInput.value), contactError));
    
    // Form Submission
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Get form values
        const name = nameInput.value.trim();
        const id = idInput.value.trim();
        const email = emailInput.value.trim();
        const contact = contactInput.value.trim();
        
        // Validate all inputs
        const isNameValid = validateInput(nameInput, validateName(name), nameError);
        const isIdValid = validateInput(idInput, validateId(id), idError);
        const isEmailValid = validateInput(emailInput, validateEmail(email), emailError);
        const isContactValid = validateInput(contactInput, validateContact(contact), contactError);
        
        if (!isNameValid || !isIdValid || !isEmailValid || !isContactValid) {
            showToast('Please fix the errors in the form', 'error');
            return;
        }
        
        // Create student object
        const student = { name, id, email, contact };
        
        // Add or update student
        if (currentEditIndex >= 0) {
            students[currentEditIndex] = student;
            showToast('Student updated successfully!');
            currentEditIndex = -1;
            submitBtn.textContent = 'Register Student';
        } else {
            // Check for duplicate ID
            if (students.some(s => s.id === id)) {
                showToast('Student ID already exists!', 'error');
                idInput.classList.add('error');
                idError.style.display = 'block';
                return;
            }
            students.push(student);
            showToast('Student registered successfully!');
        }
        
        // Save and update UI
        saveToLocalStorage();
        renderStudentList(students);
        studentForm.reset();
    }
    
    // Render Student List
    function renderStudentList(studentsToRender) {
        if (studentsToRender.length === 0) {
            recordsList.innerHTML = `
                <div class="no-records">
                    <img src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" alt="No records" class="empty-icon">
                    <p>No student records found</p>
                </div>
            `;
            return;
        }
        
        recordsList.innerHTML = '';
        studentsToRender.forEach((student, index) => {
            const row = document.createElement('div');
            row.className = 'record-row';
            row.setAttribute('data-index', index);
            row.innerHTML = `
                <div class="record-cell">${student.name}</div>
                <div class="record-cell">${student.id}</div>
                <div class="record-cell">${student.email}</div>
                <div class="record-cell">${student.contact}</div>
                <div class="record-cell action-buttons">
                    <button class="action-btn edit-btn" data-index="${index}">✏️</button>
                    <button class="action-btn delete-btn" data-index="${index}">🗑️</button>
                </div>
            `;
            recordsList.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', startEditRow);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
    }
    
    // Start editing a row
    function startEditRow(e) {
        e.stopPropagation();
        const index = parseInt(e.target.getAttribute('data-index'));
        const row = e.target.closest('.record-row');
        const student = students[index];
        
        // Convert row to editable mode
        row.classList.add('editing');
        row.innerHTML = `
            <div class="editable-cell">
                <input type="text" value="${student.name}" class="edit-name">
            </div>
            <div class="editable-cell">
                <input type="text" value="${student.id}" class="edit-id">
            </div>
            <div class="editable-cell">
                <input type="email" value="${student.email}" class="edit-email">
            </div>
            <div class="editable-cell">
                <input type="tel" value="${student.contact}" class="edit-contact">
            </div>
            <div class="record-cell action-buttons">
                <button class="save-btn" data-index="${index}">Save</button>
                <button class="cancel-btn" data-index="${index}">Cancel</button>
            </div>
        `;
        
        // Add event listeners to save/cancel buttons
        row.querySelector('.save-btn').addEventListener('click', saveEditedRow);
        row.querySelector('.cancel-btn').addEventListener('click', cancelEditRow);
    }
    
    // Save edited row
    function saveEditedRow(e) {
        const index = parseInt(e.target.getAttribute('data-index'));
        const row = e.target.closest('.record-row');
        
        // Get edited values
        const name = row.querySelector('.edit-name').value.trim();
        const id = row.querySelector('.edit-id').value.trim();
        const email = row.querySelector('.edit-email').value.trim();
        const contact = row.querySelector('.edit-contact').value.trim();
        
        // Validate inputs
        if (!validateName(name) || !validateId(id) || !validateEmail(email) || !validateContact(contact)) {
            showToast('Please enter valid information', 'error');
            return;
        }
        
        // Check for duplicate ID (except current record)
        if (students.some((s, i) => s.id === id && i !== index)) {
            showToast('Student ID already exists!', 'error');
            return;
        }
        
        // Update student data
        students[index] = { name, id, email, contact };
        saveToLocalStorage();
        renderStudentList(students);
        showToast('Student updated successfully!');
    }
    
    // Cancel editing
    function cancelEditRow(e) {
        renderStudentList(students);
    }
    
    // Start adding new row
    function startAddNewRow() {
        if (isAddingNewRow) return;
        
        isAddingNewRow = true;
        const emptyRow = document.createElement('div');
        emptyRow.className = 'record-row editing';
        emptyRow.innerHTML = `
            <div class="editable-cell">
                <input type="text" placeholder="Name" class="edit-name">
            </div>
            <div class="editable-cell">
                <input type="text" placeholder="ID" class="edit-id">
            </div>
            <div class="editable-cell">
                <input type="email" placeholder="Email" class="edit-email">
            </div>
            <div class="editable-cell">
                <input type="tel" placeholder="Contact" class="edit-contact">
            </div>
            <div class="record-cell action-buttons">
                <button class="save-btn" id="saveNewRow">Save</button>
                <button class="cancel-btn" id="cancelNewRow">Cancel</button>
            </div>
        `;
        
        recordsList.prepend(emptyRow);
        emptyRow.scrollIntoView({ behavior: 'smooth' });
        
        // Add event listeners
        document.getElementById('saveNewRow').addEventListener('click', saveNewRow);
        document.getElementById('cancelNewRow').addEventListener('click', cancelNewRow);
    }
    
    // Save new row
    function saveNewRow() {
        const row = document.querySelector('.record-row.editing');
        
        // Get values
        const name = row.querySelector('.edit-name').value.trim();
        const id = row.querySelector('.edit-id').value.trim();
        const email = row.querySelector('.edit-email').value.trim();
        const contact = row.querySelector('.edit-contact').value.trim();
        
        // Validate inputs
        if (!validateName(name) || !validateId(id) || !validateEmail(email) || !validateContact(contact)) {
            showToast('Please enter valid information', 'error');
            return;
        }
        
        // Check for duplicate ID
        if (students.some(s => s.id === id)) {
            showToast('Student ID already exists!', 'error');
            return;
        }
        
        // Add new student
        students.unshift({ name, id, email, contact });
        saveToLocalStorage();
        isAddingNewRow = false;
        renderStudentList(students);
        showToast('Student added successfully!');
    }
    
    // Cancel new row
    function cancelNewRow() {
        isAddingNewRow = false;
        renderStudentList(students);
    }
    
    // Handle Delete
    function handleDelete(e) {
        e.stopPropagation();
        const index = parseInt(e.target.getAttribute('data-index'));
        const studentName = students[index].name;
        
        // Confirm deletion
        if (confirm(`Are you sure you want to delete ${studentName}'s record?`)) {
            students.splice(index, 1);
            saveToLocalStorage();
            renderStudentList(students);
            showToast('Student record deleted');
        }
    }
    
    // Search Functionality
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredStudents = students.filter(student => 
            student.name.toLowerCase().includes(searchTerm) || 
            student.id.toLowerCase().includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm) ||
            student.contact.toLowerCase().includes(searchTerm)
        );
        renderStudentList(filteredStudents);
    }
    
    // Toast Notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // Save to Local Storage
    function saveToLocalStorage() {
        localStorage.setItem('students', JSON.stringify(students));
    }
    
    // Validation Functions
    function validateName(name) {
        const regex = /^[a-zA-Z\s]+$/;
        return regex.test(name);
    }
    
    function validateId(id) {
        const regex = /^\d+$/;
        return regex.test(id);
    }
    
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    function validateContact(contact) {
        const regex = /^\d{10}$/;
        return regex.test(contact);
    }
    
    // Validate input and show error if needed
    function validateInput(inputElement, isValid, errorElement) {
        const inputGroup = inputElement.closest('.input-group');
        if (isValid) {
            inputGroup.classList.remove('error');
            errorElement.style.display = 'none';
            return true;
        } else {
            inputGroup.classList.add('error');
            errorElement.style.display = 'block';
            return false;
        }
    }
});