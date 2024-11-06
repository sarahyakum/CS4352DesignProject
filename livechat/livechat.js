// livechat.js

let currentUrl = window.location.href; // Store the initial URL

// Event listener for the send message button
document.getElementById('send-button').addEventListener('click', sendMessage);

// Event listener for the enter key press to send message
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Event listener for the "Send URL" button
document.getElementById('send-url-button').addEventListener('click', sendUrlMessage);

// Function to send the user's message
function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();

    if (userInput === "") {
        return;
    }

    // Display user's message
    addMessageToChat(userInput, 'user-message');

    // Clear the input field
    document.getElementById('user-input').value = '';

    // Simulate bot response
    setTimeout(() => {
        const botResponse = getBotResponse(userInput);
        addMessageToChat(botResponse, 'bot-message');
    }, 500);
}

// Function to send the URL as a message
function sendUrlMessage() {
    addMessageToChat('URL sent: ' + currentUrl, 'user-message');
}

// Function to add messages to the chat
function addMessageToChat(message, className) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);

    // Scroll to the bottom after new message
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Simple function to simulate bot responses
function getBotResponse(userInput) {
    const lowerCaseInput = userInput.toLowerCase();
    if (lowerCaseInput.includes('hello')) {
        return 'Hello! How can I assist you today?';
    } else if (lowerCaseInput.includes('help')) {
        return 'I am here to help you. Ask me anything!';
    } else if (lowerCaseInput.includes('bye')) {
        return 'Goodbye! Have a great day!';
    } else {
        return "I'm sorry, I don't understand that. Can you try again?";
    }
}

// Function to update the current URL when it changes
function updateCurrentUrl() {
    currentUrl = window.location.href; // Update the stored URL
}

// Listen for URL changes using hashchange, popstate, and intercept pushState/replaceState
(function(history) {
    const pushState = history.pushState;
    const replaceState = history.replaceState;

    // Intercept pushState
    history.pushState = function(state, title, url) {
        const result = pushState.apply(history, arguments);
        window.dispatchEvent(new Event('urlchange')); // Custom event to signal URL change
        return result;
    };

    // Intercept replaceState
    history.replaceState = function(state, title, url) {
        const result = replaceState.apply(history, arguments);
        window.dispatchEvent(new Event('urlchange')); // Custom event to signal URL change
        return result;
    };

    // Also handle back/forward navigation (popstate)
    window.addEventListener('popstate', function() {
        window.dispatchEvent(new Event('urlchange')); // Custom event to signal URL change
    });

    // Handle hash change (for changes in the fragment identifier)
    window.addEventListener('hashchange', function() {
        window.dispatchEvent(new Event('urlchange')); // Custom event to signal URL change
    });

})(window.history);

// Listen for the custom 'urlchange' event and update the URL
window.addEventListener('urlchange', updateCurrentUrl);
