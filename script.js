document.addEventListener('DOMContentLoaded', function() {
    // Form Navigation
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const progressSteps = document.querySelectorAll('.progress-steps .step');
    let currentStep = 0;

    // Show current step
    function showStep(stepIndex) {
        formSteps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        updateProgress();
    }

    // Update progress indicator
    function updateProgress() {
        progressSteps.forEach((step, index) => {
            if (index < currentStep + 1) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    // Next button click handler
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    // Previous button click handler
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentStep--;
            showStep(currentStep);
        });
    });

    // Form validation
    function validateStep(stepIndex) {
        const currentStep = formSteps[stepIndex];
        const inputs = currentStep.querySelectorAll('[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ff4444';
                isValid = false;
                
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                    const error = document.createElement('span');
                    error.className = 'error-message';
                    error.textContent = 'This field is required';
                    error.style.color = '#ff4444';
                    error.style.fontSize = '0.8rem';
                    error.style.display = 'block';
                    error.style.marginTop = '5px';
                    input.insertAdjacentElement('afterend', error);
                }
            } else {
                input.style.borderColor = '#ddd';
                const error = input.nextElementSibling;
                if (error && error.classList.contains('error-message')) {
                    error.remove();
                }
            }
        });
        
        return isValid;
    }

    // Add experience field
    document.getElementById('addExperience').addEventListener('click', function() {
        const experienceFields = document.getElementById('experienceFields');
        const newExperience = document.querySelector('.experience-entry').cloneNode(true);
        
        // Clear values in cloned fields
        newExperience.querySelectorAll('input, textarea').forEach(field => {
            field.value = '';
        });
        
        // Add remove button
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn-remove';
        removeBtn.innerHTML = '<i class="fas fa-trash"></i> Remove';
        removeBtn.addEventListener('click', function() {
            if (document.querySelectorAll('.experience-entry').length > 1) {
                newExperience.remove();
                updateResumePreview();
            } else {
                alert("You need at least one experience entry");
            }
        });
        
        newExperience.appendChild(removeBtn);
        experienceFields.appendChild(newExperience);
    });

    // Add education field
    document.getElementById('addEducation').addEventListener('click', function() {
        const educationFields = document.getElementById('educationFields');
        const newEducation = document.querySelector('.education-entry').cloneNode(true);
        
        // Clear values in cloned fields
        newEducation.querySelectorAll('input').forEach(field => {
            field.value = '';
        });
        
        // Add remove button
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn-remove';
        removeBtn.innerHTML = '<i class="fas fa-trash"></i> Remove';
        removeBtn.addEventListener('click', function() {
            if (document.querySelectorAll('.education-entry').length > 1) {
                newEducation.remove();
                updateResumePreview();
            } else {
                alert("You need at least one education entry");
            }
        });
        
        newEducation.appendChild(removeBtn);
        educationFields.appendChild(newEducation);
    });

    // Generate Resume Button
    document.getElementById('generateResumeBtn').addEventListener('click', function() {
        if (validateStep(currentStep)) {
            updateResumePreview();
            document.getElementById('downloadBtn').style.display = 'block';
            alert("Resume generated successfully! Click Download PDF to save it.");
        }
    });

    // Download PDF Button (mock functionality)
    document.getElementById('downloadBtn').addEventListener('click', function() {
        // In a real implementation, this would generate an actual PDF
        alert("In a full implementation, this would download a PDF. For now, you can print the page (Ctrl+P) and save as PDF.");
    });

    // Update resume preview in real-time
    function updateResumePreview() {
        // Personal Info
        document.getElementById('previewName').textContent = document.getElementById('fullName').value || 'Your Name';
        document.getElementById('previewContact').textContent = 
            `${document.getElementById('email').value || 'email@example.com'} | ` +
            `${document.getElementById('phone').value || '(123) 456-7890'} | ` +
            `${document.getElementById('address').value || 'City, Country'}`;
        
        // Summary
        document.getElementById('previewSummary').textContent = 
            document.getElementById('summary').value || 'Experienced professional seeking new opportunities...';
        
        // Experience
        const experiencePreview = document.getElementById('previewExperience');
        experiencePreview.innerHTML = '';
        document.querySelectorAll('.experience-entry').forEach(entry => {
            const jobTitle = entry.querySelector('.jobTitle').value || 'Job Title';
            const company = entry.querySelector('.company').value || 'Company';
            const startDate = entry.querySelector('.startDate').value || 'Start Date';
            let endDate = entry.querySelector('.endDate').value;
            if (entry.querySelector('.currentJob').checked) endDate = 'Present';
            
            const description = entry.querySelector('.jobDescription').value || 'Job responsibilities and achievements...';
            
            const expEntry = document.createElement('div');
            expEntry.className = 'preview-entry';
            expEntry.innerHTML = `
                <p><strong>${jobTitle}</strong> | ${company}</p>
                <p class="date">${formatDate(startDate)} - ${formatDate(endDate)}</p>
                <ul><li>${description.replace(/\n/g, '</li><li>')}</li></ul>
            `;
            experiencePreview.appendChild(expEntry);
        });
        
        // Education
        const educationPreview = document.getElementById('previewEducation');
        educationPreview.innerHTML = '';
        document.querySelectorAll('.education-entry').forEach(entry => {
            const degree = entry.querySelector('.degree').value || 'Degree';
            const institution = entry.querySelector('.institution').value || 'Institution';
            const graduationDate = entry.querySelector('.graduationDate').value || 'Graduation Date';
            const fieldOfStudy = entry.querySelector('.fieldOfStudy').value || 'Field of Study';
            
            const eduEntry = document.createElement('div');
            eduEntry.className = 'preview-entry';
            eduEntry.innerHTML = `
                <p><strong>${degree}</strong> | ${institution}</p>
                <p class="date">${formatDate(graduationDate)} | ${fieldOfStudy}</p>
            `;
            educationPreview.appendChild(eduEntry);
        });
        
        // Skills
        const skillsPreview = document.getElementById('previewSkills');
        const techSkills = document.getElementById('technicalSkills').value || 'Technical skills...';
        const softSkills = document.getElementById('softSkills').value || 'Soft skills...';
        
        skillsPreview.innerHTML = `
            <p><strong>Technical:</strong> ${techSkills}</p>
            <p><strong>Soft Skills:</strong> ${softSkills}</p>
        `;
    }

    // Helper function to format dates
    function formatDate(dateString) {
        if (!dateString) return 'Present';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }

    // Update preview when any input changes
    document.querySelectorAll('#resumeForm input, #resumeForm textarea').forEach(input => {
        input.addEventListener('input', updateResumePreview);
    });

    // Initialize with first step
    showStep(0);
    updateResumePreview();
});