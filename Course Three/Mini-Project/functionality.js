document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const studentForm = document.getElementById('studentForm');
    const recordsList = document.getElementById('recordsList');
    const searchInput = document.getElementById('searchInput');
    const submitBtn = document.getElementById('submitBtn');
    
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
    
    // Initialize the app
    renderStudentList(students);
    
    // Event Listeners
    studentForm.addEventListener('submit', handleFormSubmit);
    searchInput.addEventListener('input', handleSearch);
    
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
            btn.addEventListener('click', handleEdit);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
    }
    
    // Handle Edit
    function handleEdit(e) {
        const index = parseInt(e.target.getAttribute('data-index'));
        const student = students[index];
        
        // Fill form with student data
        nameInput.value = student.name;
        idInput.value = student.id;
        emailInput.value = student.email;
        contactInput.value = student.contact;
        
        // Set edit mode
        currentEditIndex = index;
        submitBtn.textContent = 'Update Student';
        
        // Scroll to form
        document.querySelector('.registration-form').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Handle Delete
    function handleDelete(e) {
        const index = parseInt(e.target.getAttribute('data-index'));
        const studentName = students[index].name;
        
        // Confirm deletion
        if (confirm(`Are you sure you want to delete ${studentName}'s record?`)) {
            students.splice(index, 1);
            saveToLocalStorage();
            renderStudentList(students);
            showToast('Student record deleted!');
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