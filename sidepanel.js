console.log('sidepanel.js');

document.addEventListener('DOMContentLoaded', () => {
    const helpChatButton = document.getElementById('helpChatButton');
    const backButton = document.getElementById('backButton');
    const frame1 = document.getElementById('frame1');
    const helpChatFrame = document.getElementById('helpChatFrame');

    // Show help chat frame when button is clicked
    helpChatButton.addEventListener('click', () => {
        frame1.classList.remove('active'); // Hide main frame
        helpChatFrame.classList.add('active'); // Show help chat frame
    });

    // Show main frame when back button is clicked
    backButton.addEventListener('click', () => {
        helpChatFrame.classList.remove('active'); // Hide help chat frame
        frame1.classList.add('active'); // Show main frame
    });
});

document.getElementById("helpChatButton").addEventListener("click", function() {
    const chatContainer = document.getElementById('chatContainer');

    // Add HTML code inside the chatContainer
    chatContainer.innerHTML = `
        <div class="chat-container">
            <div class="chat-header">Help Chat</div>
            <div class="chat-messages" id="chatMessages"></div>
            <div class="chat-input-container">
                <input type="text" id="chatInput" placeholder="Enter your message..." autocomplete="off">
                <button id="sendBtn">SEND</button>
                <button id="sendURL">Send Link</button> <!-- Add this button to send the URL -->
            </div>
        </div>
    `;

    const chatInput = document.getElementById('chatInput'); // User input
    const chatMessages = document.getElementById('chatMessages'); // Message area
    const sendBtn = document.getElementById('sendBtn'); // Send button
    const sendURL = document.getElementById('sendURL'); // Send URL button

    // Hardcoded responses based on URLs
    const responses = {
        'https://www.walmart.com/': {
            keywords: {
                'hello': 'Hi! Welcome to Walmart assistance!',
                'product': 'You can use the search bar at the top of the page to find products.',
                'return policy': 'You can return items within 90 days of purchase.',
                'help': 'Sure! What do you need help with?',
                'cart': 'You can view your cart by clicking on the cart icon in the top right corner.'
            }
        },
        'https://www.amazon.com/': {
            keywords: {
                'hello': 'Hello! How can I assist you with Amazon today?',
                'prime': 'With Prime, you get free shipping and access to Prime Video.',
                'track order': 'Go to Your Orders to track your package.',
                'help': 'Sure! What do you need help with?',
                'cart': 'You can view your cart by clicking on the cart icon in the top right of the screen.'
            }
        },
        'https://www.target.com/': {
            keywords: {
                'hello': 'Hi there! Need help with Target?',
                'store hours': 'Most Target stores are open from 8 AM to 10 PM.',
                'online ordering': 'You can order online for pickup or delivery.',
                'help': 'Sure! What do you need help with?',
                'cart': 'You can view your cart by clicking on the cart icon in the top right of the main screen.'
            }
        }
    };

    // Function to get the current URL of the active tab
    function getCurrentTabUrl(callback) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                callback(tabs[0].url);
            }
        });
    }

    // Define a function to handle sending messages
    function sendMessage() {
        if (chatInput.value.trim() !== '') {
            const userMessage = document.createElement('div');
            userMessage.classList.add('message', 'user');
            userMessage.textContent = chatInput.value;
            chatMessages.appendChild(userMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            chatInput.value = '';

            const typingMessage = document.createElement('div');
            typingMessage.classList.add('message', 'auto', 'typing'); // Add typing style
            typingMessage.textContent = 'Typing...';
            chatMessages.appendChild(typingMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Get the current URL of the active tab
            getCurrentTabUrl((currentUrl) => {
                // Simulate an auto response based on user input after a delay
                setTimeout(() => {
                    chatMessages.removeChild(typingMessage);

                    const userText = userMessage.textContent.toLowerCase(); // Convert user input to lowercase
                    const autoMessage = document.createElement('div');
                    autoMessage.classList.add('message', 'auto');

                    // Check for keyword responses based on the current URL
                    const urlResponses = responses[currentUrl]?.keywords || {};
                    let foundResponse = false;

                    // Check for a keyword match
                    for (const keyword in urlResponses) {
                        if (userText.includes(keyword)) {
                            autoMessage.textContent = urlResponses[keyword]; // Set response if keyword is found
                            foundResponse = true;
                            break;
                        }
                    }

                    // Default response if no keyword matched
                    if (!foundResponse) {
                        autoMessage.textContent = 'I\'m sorry, I didn\'t understand that.'; // Default response
                    }

                    chatMessages.appendChild(autoMessage);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1500);
            });
        }
    }

    // Send URL as a message when the URL button is clicked
sendURL.addEventListener('click', () => {
    getCurrentTabUrl((currentUrl) => {
        const userMessage = document.createElement('div');
        userMessage.classList.add('message', 'user');
        userMessage.textContent = currentUrl; // Set URL as message text
        chatMessages.appendChild(userMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        const typingMessage = document.createElement('div');
        typingMessage.classList.add('message', 'auto', 'typing'); // Add typing style
        typingMessage.textContent = 'Typing...';
        chatMessages.appendChild(typingMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            // Create a bot response for the URL
            chatMessages.removeChild(typingMessage);
            const botResponse = document.createElement('div');
            botResponse.classList.add('message', 'auto');
            botResponse.textContent = 'Thank you for the link'; // Bot's response
            chatMessages.appendChild(botResponse);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1500);
    });
});


    // When the 'SEND' button is clicked, send the message.
    sendBtn.addEventListener('click', sendMessage);

    // The user can press 'Enter' on their keyboard to send the message.
    chatInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
