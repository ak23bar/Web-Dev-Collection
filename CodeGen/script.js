document.addEventListener('DOMContentLoaded', () => {
    // Form handling
    const lessonForm = document.getElementById('lesson-generator-form');
    const contactForm = document.getElementById('contact-form');
    const sampleLessonsSection = document.getElementById('sample-lessons');

    // Validation state tracking
    let formIsValid = false;

    // Form submission handling
    if (lessonForm && sampleLessonsSection) {
        // Form validation
        const validateForm = () => {
            const requiredFields = lessonForm.querySelectorAll('[required]');
            formIsValid = Array.from(requiredFields).every(field => field.validity.valid);

            // Update generate button state
            const generateBtn = lessonForm.querySelector('.generate-btn');
            if (generateBtn) {
                generateBtn.disabled = !formIsValid;
                generateBtn.style.opacity = formIsValid ? '1' : '0.7';
            }

            return formIsValid;
        };

        // Initial validation
        validateForm();

        // Input field validation handling
        const inputs = lessonForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            // Show validation feedback when input loses focus
            input.addEventListener('blur', () => {
                if (!input.validity.valid && input.value !== '') {
                    input.classList.add('invalid-input');

                    // Create validation message if doesn't exist
                    let validationMsg = input.parentNode.querySelector('.validation-message');
                    if (!validationMsg) {
                        validationMsg = document.createElement('p');
                        validationMsg.className = 'validation-message';
                        validationMsg.style.color = '#dc3545';
                        validationMsg.style.fontSize = '0.85rem';
                        validationMsg.style.marginTop = '5px';
                        input.parentNode.appendChild(validationMsg);
                    }

                    validationMsg.textContent = input.validationMessage || 'This field is required';
                }
            });

            // Remove validation styling on input
            input.addEventListener('input', () => {
                if (input.classList.contains('invalid-input')) {
                    input.classList.remove('invalid-input');

                    // Remove validation message if exists
                    const validationMsg = input.parentNode.querySelector('.validation-message');
                    if (validationMsg) {
                        validationMsg.remove();
                    }
                }

                // Revalidate form on any input change
                validateForm();
            });
        });

        // Form submission
        lessonForm.addEventListener('submit', (event) => {
            event.preventDefault();

            if (validateForm()) {
                // Show loading state
                const generateBtn = lessonForm.querySelector('.generate-btn');
                const originalBtnText = generateBtn.innerHTML;
                generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
                generateBtn.disabled = true;

                // Gather form data
                const formData = new FormData(lessonForm);
                const data = Object.fromEntries(formData.entries());

                // Simulate API request with a timeout
                setTimeout(() => {
                    console.log('Lesson plan request:', data);

                    // Create a new lesson card
                    createNewLessonCard(data);

                    // Reset button state
                    generateBtn.innerHTML = originalBtnText;
                    generateBtn.disabled = false;

                    // Scroll to lessons section
                    sampleLessonsSection.scrollIntoView({ behavior: 'smooth' });

                    // Show success message
                    showNotification('Lesson plan generated successfully!', 'success');
                }, 1500);
            } else {
                // Highlight all invalid fields
                inputs.forEach(input => {
                    if (!input.validity.valid) {
                        input.classList.add('invalid-input');
                    }
                });

                showNotification('Please fill in all required fields correctly.', 'error');
            }
        });
    }

    // Contact form handling
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // Basic validation
            const email = contactForm.querySelector('input[type="email"]');
            const message = contactForm.querySelector('textarea');

            if (email.validity.valid && message.validity.valid) {
                // Show loading state
                const submitBtn = contactForm.querySelector('.contact-btn');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                // Simulate form submission
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;

                    showNotification('Thank you for your message!', 'success');
                }, 1000);
            }
        });
    }

    // Create a new lesson card from form data
    function createNewLessonCard(data) {
        const lessonGrid = document.querySelector('.lesson-grid');

        if (!lessonGrid) return;

        // Determine the language class
        let languageClass = data.language.toLowerCase();
        let languageIcon = 'fa-code';

        // Set appropriate icon
        switch (languageClass) {
            case 'python':
                languageIcon = 'fab fa-python';
                break;
            case 'javascript':
                languageIcon = 'fab fa-js-square';
                break;
            case 'scratch':
                languageIcon = 'fas fa-cat';
                break;
            case 'java':
                languageIcon = 'fab fa-java';
                break;
        }

        // Generate a relevant project idea based on topic and experience
        const projectIdeas = {
            beginner: {
                'variables': 'Create a simple calculator that stores user input in variables.',
                'loops': 'Build a program that counts from 1 to 10 using a loop.',
                'functions': 'Make a greeting program that uses a function to say hello.'
            },
            intermediate: {
                'variables': 'Build a data tracker that stores and manipulates multiple variables.',
                'loops': 'Create a nested loop program that generates patterns.',
                'functions': 'Design a program with functions that accept parameters and return values.'
            },
            advanced: {
                'variables': 'Implement a complex state management system using variables and objects.',
                'loops': 'Create an efficient sorting algorithm using optimized loops.',
                'functions': 'Build a program with recursive functions and callbacks.'
            }
        };

        // Try to match topic to keywords
        const topic = data['topic-focus'].toLowerCase();
        const experience = data['experience-level'].toLowerCase();
        let projectIdea = 'Create a project that demonstrates understanding of ' + data['topic-focus'] + '.';

        // Find a relevant project idea if possible
        for (const keyword in projectIdeas[experience]) {
            if (topic.includes(keyword)) {
                projectIdea = projectIdeas[experience][keyword];
                break;
            }
        }

        // Create the new lesson card
        const newCard = document.createElement('div');
        newCard.className = 'lesson-card';
        newCard.innerHTML = `
            <div class="lesson-header ${languageClass}">
                <i class="${languageIcon}"></i> ${data.language}: ${data['topic-focus']}
            </div>
            <div class="lesson-details">
                <p><strong>Target:</strong> Age ${data['age-range']}, ${data['experience-level']}</p>
                <p><strong>Objective:</strong> ${data['learning-goals']}</p>
                <p><strong>Activities:</strong> Interactive exercises, guided practice, and group challenges.</p>
                <p><strong>Project Idea:</strong> ${projectIdea}</p>
            </div>
        `;

        // Add animation class
        newCard.classList.add('new-lesson');

        // Insert the new card at the beginning
        lessonGrid.insertBefore(newCard, lessonGrid.firstChild);

        // Scroll to the new card with highlight effect
        setTimeout(() => {
            newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Add highlight effect
            newCard.style.boxShadow = '0 0 15px rgba(40, 167, 69, 0.7)';

            // Remove highlight after a few seconds
            setTimeout(() => {
                newCard.style.boxShadow = '';
            }, 3000);
        }, 100);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Create notification container if it doesn't exist
        let notifContainer = document.querySelector('.notification-container');
        if (!notifContainer) {
            notifContainer = document.createElement('div');
            notifContainer.className = 'notification-container';
            notifContainer.style.position = 'fixed';
            notifContainer.style.top = '20px';
            notifContainer.style.right = '20px';
            notifContainer.style.zIndex = '1000';
            document.body.appendChild(notifContainer);
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.padding = '12px 20px';
        notification.style.marginBottom = '10px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 3px 6px rgba(0,0,0,0.16)';
        notification.style.transition = 'all 0.3s ease';
        notification.style.cursor = 'pointer';
        notification.style.fontSize = '0.9rem';

        // Set color based on type
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#28a745';
                notification.style.color = 'white';
                notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
                break;
            case 'error':
                notification.style.backgroundColor = '#dc3545';
                notification.style.color = 'white';
                notification.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
                break;
            default:
                notification.style.backgroundColor = '#007bff';
                notification.style.color = 'white';
                notification.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
        }

        // Add close functionality
        notification.addEventListener('click', () => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        });

        // Add to container
        notifContainer.appendChild(notification);

        // Animate in
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Add interactivity to existing lesson cards
    const lessonCards = document.querySelectorAll('.lesson-card');
    lessonCards.forEach(card => {
        card.addEventListener('click', () => {
            // Toggle expanded class to show more details if needed
            card.classList.toggle('expanded');

            // Additional functionality could be added here
        });
    });

    // Add CSS for animations and transitions
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .lesson-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .lesson-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
        }
        
        .new-lesson {
            animation: fadeIn 0.6s ease-out;
        }
        
        .invalid-input {
            border-color: #dc3545 !important;
            box-shadow: 0 0 0 2px rgba(220,53,69,.25) !important;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(styleElement);
});