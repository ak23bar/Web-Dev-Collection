document.addEventListener('DOMContentLoaded', function () {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', function () {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Smooth scrolling for internal links
    document.querySelectorAll('a.scroll-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile nav if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Account for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });

    // Example tabs functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.chat-preview');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Chat demo functionality
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');

    // Course syllabus knowledge base (simplified for demo)
    const courseKnowledge = {
        'midterm': {
            answer: 'The midterm exam is scheduled for October 12th from 2:00-4:00 PM in Room CS 105. It will cover chapters 1-5 from the textbook and all topics discussed in lectures 1-8.',
            source: 'Course Syllabus, Section 4.1: Exams'
        },
        'late policy': {
            answer: 'The late policy allows submissions up to 3 days (72 hours) after the deadline with a 10% penalty per day. After 3 days, submissions will not be accepted without documented extenuating circumstances approved by the instructor.',
            source: 'Course Syllabus, Section 2.3: Assignment Policies'
        },
        'teams': {
            answer: 'For the final project, teams of 3-4 students will be formed through our team formation survey that opens on October 5th. You may request specific teammates, but final team composition requires instructor approval to ensure balanced skills across teams.',
            source: 'Final Project Guidelines, Page 1'
        },
        'office hours': {
            answer: 'Weekly office hours are held at the following times and locations:<br>- Prof. Johnson: Mondays 1-3pm, CS Building Room 302<br>- TA Alex: Tuesdays 10am-12pm, CS Lab 114<br>- TA Morgan: Wednesdays 4-6pm, Virtual (Zoom link on Canvas)<br>- TA Jamie: Thursdays 11am-1pm, CS Lab 114',
            source: 'Course Syllabus, Section 1.2: Contact & Office Hours'
        }
    };

    // Add event listeners for chat interaction
    if (sendBtn && userInput) {
        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Add event listeners for suggestion buttons
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            userInput.value = this.textContent;
            sendMessage();
        });
    });

    // Function to send message
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        // Add user message to chat
        addMessageToChat(message, 'student');

        // Clear input
        userInput.value = '';

        // Process the message and respond after a short delay
        setTimeout(() => {
            processMessage(message);
        }, 600);
    }

    // Function to add message to chat
    function addMessageToChat(message, sender, source = null) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', sender);

        const senderSpan = document.createElement('span');
        senderSpan.classList.add('message-sender');
        senderSpan.textContent = sender === 'student' ? 'Student:' : 'CourseBot:';

        const messageText = document.createElement('p');
        messageText.innerHTML = message;

        messageDiv.appendChild(senderSpan);
        messageDiv.appendChild(messageText);

        // Add source if provided (for bot messages)
        if (source && sender === 'coursebot') {
            const sourceSpan = document.createElement('span');
            sourceSpan.classList.add('message-source');
            sourceSpan.textContent = `Source: ${source}`;
            messageDiv.appendChild(sourceSpan);
        }

        chatContainer.appendChild(messageDiv);

        // Scroll to bottom of chat
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Function to process message and generate response
    function processMessage(message) {
        message = message.toLowerCase();
        let response = '';
        let source = '';

        // Look for keywords in the knowledge base
        if (message.includes('midterm') || message.includes('exam')) {
            response = courseKnowledge.midterm.answer;
            source = courseKnowledge.midterm.source;
        }
        else if (message.includes('late') || message.includes('deadline') || message.includes('due')) {
            response = courseKnowledge.late.answer;
            source = courseKnowledge.late.source;
        }
        else if (message.includes('team') || message.includes('group') || message.includes('partner')) {
            response = courseKnowledge.teams.answer;
            source = courseKnowledge.teams.source;
        }
        else if (message.includes('office') || message.includes('hours') || message.includes('help')) {
            response = courseKnowledge.office.answer;
            source = courseKnowledge.office.source;
        }
        else if (message.includes('project')) {
            // Example of referring to a previous thread
            response = 'This question was discussed in a previous thread. The final project is due December 5th, and you must submit both your code and a 5-minute video presentation.';
            source = 'Related Thread: <a href="#">Project Requirements Discussion #28</a>';
        }
        else {
            // Default response for questions not in the knowledge base
            response = "I don't have specific information about that in my knowledge base. Would you like me to escalate this question to a human TA? In the meantime, you might find relevant information in the course syllabus or lecture notes.";
            source = null;
        }

        // Add bot response to chat
        addMessageToChat(response, 'coursebot', source);
    }

    // Animation for elements as they scroll into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-item, .step, .stat-item, .testimonial');

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenHeight = window.innerHeight;

            if (elementPosition < screenHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state for animated elements
    document.querySelectorAll('.feature-item, .step, .stat-item, .testimonial').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Run animation check on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);

    // Fix knowledge base references
    courseKnowledge.late = courseKnowledge['late policy'];
    courseKnowledge.office = courseKnowledge['office hours'];
});