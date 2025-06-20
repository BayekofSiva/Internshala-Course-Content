document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const studentForm = document.getElementById('studentForm');
    const recordsList = document.getElementById('recordsList');
    const searchInput = document.getElementById('searchInput');
    const submitBtn = document.getElementById('submitBtn');
    
    // Modal Elements
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <h3 class="modal-title">Confirm Deletion</h3>
            <p>Are you sure you want to delete this student record?</p>
            <div class="confirm-buttons">
                <button class="cancel-btn">Cancel</button>
                <button class="confirm-btn">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Toast Element
    const toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
    
    // Student Data
    let students = JSON.parse(localStorage.getItem('students')) || [];
    let currentEditIndex = -1;
    
    // Initialize the app
    renderStudentList(students);
    
    // Event Listeners
    studentForm.addEventListener('submit', handleFormSubmit);
    searchInput.addEventListener('input', handleSearch);
    modal.querySelector('.close-btn').addEventListener('click', closeModal);
    modal.querySelector('.cancel-btn').addEventListener('click', closeModal);
    modal.querySelector('.confirm-btn').addEventListener('click', confirmDelete);
    
    // Form Submission
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate inputs
        const name = document.getElementById('studentName').value.trim();
        const id = document.getElementById('studentId').value.trim();
        const email = document.getElementById('studentEmail').value.trim();
        const contact = document.getElementById('studentContact').value.trim();
        const editIndex = parseInt(document.getElementById('editIndex').value);
        
        // Validation
        if (!validateName(name) || !validateId(id) || !validateEmail(email) || !validateContact(contact)) {
            showToast('Please fill all fields correctly', 'error');
            return;
        }
        
        // Create student object
        const student = { name, id, email, contact };
        
        // Add or update student
        if (editIndex >= 0) {
            students[editIndex] = student;
            showToast('Student record updated successfully');
            currentEditIndex = -1;
            document.getElementById('editIndex').value = '-1';
            submitBtn.textContent = 'Register Student';
        } else {
            // Check for duplicate ID
            if (students.some(s => s.id === id)) {
                showToast('Student ID already exists', 'error');
                return;
            }
            students.push(student);
            showToast('Student registered successfully');
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
        
        document.getElementById('studentName').value = student.name;
        document.getElementById('studentId').value = student.id;
        document.getElementById('studentEmail').value = student.email;
        document.getElementById('studentContact').value = student.contact;
        document.getElementById('editIndex').value = index;
        
        currentEditIndex = index;
        submitBtn.textContent = 'Update Student';
        
        // Scroll to form
        document.querySelector('.registration-form').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Handle Delete
    function handleDelete(e) {
        const index = parseInt(e.target.getAttribute('data-index'));
        currentEditIndex = index;
        openModal();
    }
    
    // Confirm Delete
    function confirmDelete() {
        students.splice(currentEditIndex, 1);
        saveToLocalStorage();
        renderStudentList(students);
        closeModal();
        showToast('Student record deleted');
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
    
    // Modal Functions
    function openModal() {
        modal.style.display = 'block';
    }
    
    function closeModal() {
        modal.style.display = 'none';
    }
    
    // Toast Notification
    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = 'toast';
        toast.classList.add(type);
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
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
    
    // Initialize input validation
    document.getElementById('studentName').addEventListener('input', function() {
        validateInput(this, validateName(this.value));
    });
    
    document.getElementById('studentId').addEventListener('input', function() {
        validateInput(this, validateId(this.value));
    });
    
    document.getElementById('studentEmail').addEventListener('input', function() {
        validateInput(this, validateEmail(this.value));
    });
    
    document.getElementById('studentContact').addEventListener('input', function() {
        validateInput(this, validateContact(this.value));
    });
    
    function validateInput(inputElement, isValid) {
        const inputGroup = inputElement.closest('.input-group');
        if (isValid) {
            inputGroup.classList.remove('error');
        } else {
            inputGroup.classList.add('error');
        }
    }
});