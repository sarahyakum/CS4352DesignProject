console.log('sidepanel.js');

document.addEventListener('DOMContentLoaded', () => {
    const helpChatButton = document.getElementById('helpChatButton');
    const frame1 = document.getElementById('frame1');
    const helpChatFrame = document.getElementById('helpChatFrame');

    // Show help chat frame when button is clicked
    helpChatButton.addEventListener('click', () => {
        frame1.classList.remove('active'); // Hide main frame
        helpChatFrame.classList.add('active'); // Show help chat frame
    });
});

document.getElementById("helpChatButton").addEventListener("click", function () {
    const chatContainer = document.getElementById('chatContainer');

    // Add HTML code inside the chatContainer
    chatContainer.innerHTML = `
        <div class="chat-container">
            <div class="chat-header">Help Chat</div> 
            <button id="backButton"> Back</button>
            <div class="chat-messages" id="chatMessages"></div>
            <div class="chat-input-container">
                <input type="text" id="chatInput" placeholder="Enter your message..." autocomplete="off">
                <button id="sendBtn">Send</button>
                <button id="sendURL">Send Link</button> <!-- Add this button to send the URL -->
            </div>
        </div>
    `;

    const chatInput = document.getElementById('chatInput'); // User input
    const chatMessages = document.getElementById('chatMessages'); // Message area
    const sendBtn = document.getElementById('sendBtn'); // Send button
    const sendURL = document.getElementById('sendURL'); // Send URL button
    
    //Back button functionality
    const frame1 = document.getElementById('frame1');
    const helpChatFrame = document.getElementById('helpChatFrame');

    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', () => {
        helpChatFrame.classList.remove('active'); // Hide help chat frame
        frame1.classList.add('active'); // Show main frame
    });

    // Hardcoded responses based on base URLs
    const responses = {
        'walmart.com': {
            keywords: {
                'hello': 'Hi! How can I assist you with Walmart?',
                'product': 'You can use the search bar at the top of the page to find products.',
                'return policy': 'You can return items within 90 days of purchase.',
                'help': 'Sure! What do you need help with?',
                'cart': 'You can view your cart by clicking on the cart icon in the top right corner.'
            }
        },
        'memorialhermann.org': {
            keywords: {
                'hello': 'Hello! How can I help you use Memorial Hermann today?',
                'prime': 'With Prime, you get free shipping and access to Prime Video.',
                'track order': 'Go to Your Orders to track your package.',
                'help': 'Sure! What do you need help with?',
                'cart': 'You can view your cart by clicking on the cart icon in the top right of the screen.'
            }
        },
        'txdmv.gov': {
            keywords: {
                'hello': 'Hi there! How can I help you navigate the Texas DMV website?',
                'hours': 'Their business hours are Monday through Friday, 8AM - 5PM (Central Time). Due to the large number of calls they receive, you may experience longer than average hold times during certain hours. The busiest times during the week are Mondays, Tuesdays, and daily 11AM to 2PM. Customers calling outside these times may experience shorter hold times.',
                'call': 'The Toll-Free number is 1 (888) 368-4689',
                'help': 'Sure! What do you need help with?',
                'license': 'Here are the steps to renew your driver\'s license: \n\n1. Click on the "Driver License & IDs" tab at the top of the screen.\n\n2. Follow the instructions to renew your license online.'
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

                    // Check for keyword responses based on the base URL (ignoring the path)
                    let foundResponse = false;
                    for (const baseUrl in responses) {
                        if (currentUrl.includes(baseUrl)) {
                            const urlResponses = responses[baseUrl]?.keywords || {};
                            
                            // Check if user input matches any keyword in the URL responses
                            for (const keyword in urlResponses) {
                                if (userText.includes(keyword)) {
                                    autoMessage.textContent = urlResponses[keyword]; // Set response if keyword is found
                                    foundResponse = true;
                                    break;
                                }
                            }
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
