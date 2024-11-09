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

    // Show help chat frame when button is clicked
    EditButton.addEventListener('click', () => {
        frame1.classList.remove('active'); // Hide main frame
        editingFrame.classList.add('active'); // Show help chat frame
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
                'hello': 'Hi! Welcome to Walmart assistance!',
                'product': 'You can use the search bar at the top of the page to find products.',
                'return policy': 'You can return items within 90 days of purchase.',
                'help': 'Sure! What do you need help with?',
                'cart': 'You can view your cart by clicking on the cart icon in the top right corner.'
            }
        },
        'amazon.com': {
            keywords: {
                'hello': 'Hello! How can I assist you with Amazon today?',
                'prime': 'With Prime, you get free shipping and access to Prime Video.',
                'track order': 'Go to Your Orders to track your package.',
                'help': 'Sure! What do you need help with?',
                'cart': 'You can view your cart by clicking on the cart icon in the top right of the screen.'
            }
        },
        'target.com': {
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

document.getElementById("EditButton").addEventListener("click", function () {
    const editContainer = document.getElementById('editContainer');

    // Add HTML code inside the editContainer
    editContainer.innerHTML = `
        <div class="edit-container">
            <div class="edit-header">Edit Websites Text</div>
            <button id="backButton"> Back</button> 
            <label for="fontType">Font Type:</label>
            <select id="fontType">
                <option value="Arial">Arial</option>
                <option value="Courier New">Courier New</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
            </select>

            <label for="fontSize">Font Size:</label>
            <input id="fontSize" type="number" min="8" max="48" value="16">

            <button id="applyBtn">Apply Settings</button>
            <button id="resetBtn">Reset</button>
            
        </div>
    `;
    
    //Back button functionality
    const frame1 = document.getElementById('frame1');
    const editingFrame = document.getElementById('editingFrame');

    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', () => {
        editingFrame.classList.remove('active'); // Hide help chat frame
        frame1.classList.add('active'); // Show main frame
    });
    //calls script to change fonts
    document.getElementById("applyBtn").addEventListener("click", () => {
        const fontType = document.getElementById("fontType").value;
        const fontSize = document.getElementById("fontSize").value;
      
        // Get the active tab and inject the script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: changeFontStyle,
            args: [fontType, fontSize]
          });
        });
      });
      // Reset Font Settings
    document.getElementById("resetBtn").addEventListener("click", () => {
        // Query the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id }, // Target the active tab
            func: resetFontStyle // Function to reset the font style
        });
        });
    });
  
      
      // Function to change the font style on the webpage
      function changeFontStyle(fontType, fontSize) {
        document.body.style.fontFamily = fontType;
        document.body.style.fontSize = fontSize + "px";
      }
      // Function to reset the font style on the webpage
    function resetFontStyle() {
        document.body.style.fontFamily = ''; // Reset font family
        document.body.style.fontSize = ''; // Reset font size
    }

});


