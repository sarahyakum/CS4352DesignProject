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

    // Track the last known URL to detect changes
    let lastUrl = '';

    // Predefined responses for URLs
    const urlResponses = {
        'walmart.com': 'Thank you for sharing the Walmart website. How can I assist you navigate?',
        'memorialhermann.org': 'This is the Memorial Hermann website. Let me know how I can assist you with their services.',
        'txdmv.gov': 'This is the Texas DMV website. I can help with information on licenses, registration, and more.'
    };

    // // Function to get the current URL of the active tab
    // function getCurrentTabUrl(callback) {
    //     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //         if (tabs.length > 0) {
    //             callback(tabs[0].url);
    //         }
    //     });
    // }

    // Function to toggle the "Send URL" button based on URL change
    function toggleSendURLButton(currentUrl) {
        if (lastUrl !== currentUrl) {
            lastUrl = currentUrl;
            sendURL.style.display = 'inline'; // Show the button on URL change
        }
    }

    // Hardcoded responses based on base URLs
    const responses = {
        'walmart.com': {
            keywords: {
                'hello': ['Welcome to Golden Access!', 'How can I assist you with Walmart?'],
                'product': ['You can use the search bar at the top of the page to find products.', 'Just type in the name of the product you are looking for.', 'You can also browse through the categories.'],
                'return policy': ['You can return items within 90 days of purchase.', 'Please visit the Returns Center for more information.', 'You can find the Returns Center link at the bottom of the page.'],
                'help': ['Sure! What do you need help with?', 'You can ask me about products, orders, or the shopping process.'],
                'cart': ['You can view your cart by clicking on the cart icon in the top right corner.', 'It will show you all the items you have added.', 'You can also proceed to checkout from there.']
            }
        },
        'memorialhermann.org': {
            keywords: {
                'hello': ['Welcome to Golden Access!', 'How can I help you use Memorial Hermann today?'],
                '': ['With Prime, you get free shipping and access to Prime Video.'],
                'track order': ['Go to Your Orders to track your package.'],
                'help': ['Sure! What do you need help with?'],
                'cart': ['You can view your cart by clicking on the cart icon in the top right of the screen.']
            }
        },
        'txdmv.gov': {
            keywords: {
                'hello': ['Welcome to Golden Access!','How can I help you navigate the Texas DMV website?'],
                'hours': ['Their business hours are Monday through Friday, 8AM - 5PM (Central Time). Due to the large number of calls they receive, you may experience longer than average hold times during certain hours. The busiest times during the week are Mondays, Tuesdays, and daily 11AM to 2PM. Customers calling outside these times may experience shorter hold times.'],
                'call': ['The Toll-Free number is 1 (888) 368-4689'],
                'help': ['Sure! What do you need help with?'],
                'license': ['Here are the steps to renew your driver\'s license:', '1. Click on the "Driver License & IDs" tab at the top of the screen.','2. Follow the instructions to renew your license online.']
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

                    // Check for keyword responses based on the base URL (ignoring the path)
                    let foundResponse = false;
                    for (const baseUrl in responses) {
                        if (currentUrl.includes(baseUrl)) {
                            const urlResponses = responses[baseUrl]?.keywords || {};
                            
                            // Check if user input matches any keyword in the URL responses
                            for (const keyword in urlResponses) {
                                if (userText.includes(keyword)) {
                                    const responseList = urlResponses[keyword];
                                    responseList.forEach(response => {
                                        const autoMessage = document.createElement('div');
                                        autoMessage.classList.add('message', 'auto');
                                        autoMessage.textContent = response;
                                        chatMessages.appendChild(autoMessage);
                                    });
                                    foundResponse = true;
                                    break;
                                }
                            }
                            break;
                        }
                    }

                    // Default response if no keyword matched
                    if (!foundResponse) {
                        const autoMessage = document.createElement('div');
                        autoMessage.classList.add('message', 'auto');
                        autoMessage.textContent = 'I\'m sorry, I didn\'t understand that.';
                        chatMessages.appendChild(autoMessage);
                    }
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1500);
            });
        }
    }


// Send URL as a message and respond with predefined response
sendURL.addEventListener('click', () => {
    getCurrentTabUrl((currentUrl) => {
        const urlMessage = document.createElement('div');
        urlMessage.classList.add('message', 'user');
        urlMessage.textContent = `Current URL: ${currentUrl}`;
        chatMessages.appendChild(urlMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Respond with a predefined response if available
        setTimeout(() => {
            const autoMessage = document.createElement('div');
            autoMessage.classList.add('message', 'auto');

            let baseUrlMatched = false;
            for (const baseUrl in urlResponses) {
                if (currentUrl.includes(baseUrl)) {
                    autoMessage.textContent = urlResponses[baseUrl];
                    baseUrlMatched = true;
                    break;
                }
            }

            if (!baseUrlMatched) {
                autoMessage.textContent = 'I don\'t have specific information for this site.';
            }

            chatMessages.appendChild(autoMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1500);

        // Hide the "Send URL" button after use
        sendURL.style.display = 'none';
    });
});


    // When the 'SEND' button is clicked, send the message.
    sendBtn.addEventListener('click', sendMessage);

     // Initial URL setup
     getCurrentTabUrl((currentUrl) => {
        toggleSendURLButton(currentUrl);
    });

    // The user can press 'Enter' on their keyboard to send the message.
    chatInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
