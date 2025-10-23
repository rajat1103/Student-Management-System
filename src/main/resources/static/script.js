document.addEventListener('DOMContentLoaded', () => {
    const studentTableBody = document.getElementById('studentTableBody');
    const nameInput = document.getElementById('nameInput');
    const ageInput = document.getElementById('ageInput');
    const courseInput = document.getElementById('courseInput');
    const addStudentBtn = document.getElementById('addStudentBtn');
    // Modal elements
    const editModal = document.getElementById('editModal');
    const closeButton = document.querySelector('.close-button');
    const editStudentId = document.getElementById('editStudentId');
    const editName = document.getElementById('editName');
    const editAge = document.getElementById('editAge');
    const editCourse = document.getElementById('editCourse');
    const updateStudentBtn = document.getElementById('updateStudentBtn');
    const API_BASE_URL = '/api/students';

    //--- Utility Functions
    // Show modal
    function showModal() {
        editModal.style.display = 'flex'; // Use flex to center easily
    }
    // Hide modal
    function hideModal() {
        editModal.style.display = 'none';
    }

    // API Interactions
    async function fetchStudents() {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const students = await response.json();
            renderStudents(students);
        } catch (error) {
            console.error('Error fetching students:', error);
            studentTableBody.innerHTML = '<tr><td colspan="5">Error loading students. Please ensure the backend is running.</td></tr>';
        }
    }

    async function addStudent(student) {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(student)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Clear inputs after successful add
            nameInput.value = '';
            ageInput.value = '';
            courseInput.value = '';
            fetchStudents(); // Re-fetch to update the table
        } catch (error) {
            console.error('Error adding student:', error);
            alert('Failed to add student. Check console for details.');
        }
    }

    async function updateStudent(id, student) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(student)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            hideModal(); // Close modal after update
            fetchStudents(); // Re-fetch to update the table
        } catch (error) {
            console.error('Error updating student:', error);
            alert('Failed to update student. Check console for details.');
        }
    }

    async function deleteStudent(id) {
        if (!confirm('Are you sure you want to delete this student?')) {
            return; // User cancelled
        }
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                // If response is not ok, but not 404 (e.g., server error)
                if (response.status !== 404) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }
            fetchStudents(); // Re-fetch to update the table
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('Failed to delete student. Check console for details.');
        }
    }

    // Render Function
    function renderStudents(students) {
        studentTableBody.innerHTML = ''; // Clear existing rows
        if (students.length === 0) {
            studentTableBody.innerHTML = '<tr><td colspan="5">No students found.</td></tr>';
            return;
        }
        students.forEach(student => {
            const row = studentTableBody.insertRow();
            row.insertCell(0).textContent = student.id;
            row.insertCell(1).textContent = student.name;
            row.insertCell(2).textContent = student.age;
            row.insertCell(3).textContent = student.course;
            const actionsCell = row.insertCell(4);
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.classList.add('btn', 'edit-btn');
            editBtn.addEventListener('click', () => {
                // Populate modal with current student data
                editStudentId.value = student.id;
                editName.value = student.name;
                editAge.value = student.age;
                editCourse.value = student.course;
                showModal();
            });
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('btn', 'delete-btn');
            deleteBtn.addEventListener('click', () => deleteStudent(student.id));
            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
        });
    }

    // Event Listeners
    addStudentBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const age = parseInt(ageInput.value.trim(), 10);
        const course = courseInput.value.trim();
        if (!name || isNaN(age) || age <= 0 || !course) {
            alert('Please enter valid name, age, and course.');
            return;
        }
        const newStudent = { name, age, course };
        addStudent(newStudent);
    });

    updateStudentBtn.addEventListener('click', () => {
        const id = parseInt(editStudentId.value, 10);
        const name = editName.value.trim();
        const age = parseInt(editAge.value.trim(), 10);
        const course = editCourse.value.trim();
        if (!name || isNaN(age) || age <= 0 || !course || isNaN(id)) {
            alert('Please enter valid name, age, and course for update.');
            return;
        }
        const updatedStudent = { id, name, age, course }; // Ensure ID is part of the object for clarity, though it's passed in URL
        updateStudent(id, updatedStudent);
    });

    closeButton.addEventListener('click', hideModal);
    // Close modal if user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            hideModal();
        }
    });

    // Initial Load
    fetchStudents(); // Load students when the page loads
});
