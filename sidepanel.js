console.log('sidepanel.js');

document.addEventListener('DOMContentLoaded', () => {
    const helpChatButton = document.getElementById('helpChatButton');
    const frame1 = document.getElementById('frame1');
    const helpChatFrame = document.getElementById('helpChatFrame');
    const editingFrame = document.getElementById('editingFrame');
    const EditButton = document.getElementById('EditButton');

    // Show help chat frame when button is clicked
    helpChatButton.addEventListener('click', () => {
        frame1.classList.remove('active'); // Hide main frame
        helpChatFrame.classList.add('active'); // Show help chat frame
    });

    // Show editing frame when button is clicked
    EditButton.addEventListener('click', () => {
        frame1.classList.remove('active'); // Hide main frame
        editingFrame.classList.add('active'); // Show help chat frame
    });

    const switchCheckbox = document.querySelector('.switch-container input[type="checkbox"]');
    
    // Set initial checkbox state from chrome.storage
    chrome.storage.sync.get('tooltipEnabled', (data) => {
        switchCheckbox.checked = false;
    });

    // Update chrome.storage when checkbox state changes
    switchCheckbox.addEventListener('change', () => {
        chrome.storage.sync.set({ tooltipEnabled: switchCheckbox.checked });
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

    // Back button functionality
    const frame1 = document.getElementById('frame1');
    const helpChatFrame = document.getElementById('helpChatFrame');

    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', () => {
        helpChatFrame.classList.remove('active'); // Hide help chat frame
        frame1.classList.add('active'); // Show main frame
    });

    // Predefined responses for URLs
    const urlResponses = {
        'walmart.com': 'Thank you for sharing the Walmart website. How can I assist you navigate?',
        'memorialhermann.org': 'This is the Memorial Hermann website. Let me know how I can assist you with their services.',
        'txdmv.gov': 'This is the Texas DMV website. I can help with information on licenses, registration, and more.'
    };

    // Hardcoded responses based on base URLs
    const responses = {
        'walmart.com': {
            keywords: {
                'hello': ['Welcome to Golden Access!', 'How can I assist you with Walmart?'],
                'buy': ['You can use the search bar at the top of the page to find products.', 'Just type in the name of the product you are looking for.', 'You can also browse through the categories.'],
                'return': ['You can return items within 90 days of purchase.', 'Please visit the Returns Center for more information.', 'You can find the Returns Center link by searching "Return" in the search bar and selecting "How to return".'],
                'help': ['Sure! What do you need help with?', 'You can ask me about products, orders, or the shopping process.'],
                'cart': ['You can view your cart by clicking on the cart icon in the top right corner.', 'It will show you all the items you have added.', 'You can also proceed to checkout from there.'],
                'store': ['You can find the nearest Walmart store by using the Store Finder.', 'Just enter your location or ZIP code to find the closest store.', 'At the top left of the screen, select "How do you want your itens?" and at the bottom there will be an "Add Address" button.', "You can use this to find the closest store to you, find the store's hours, and see if you can use their services such as delivery, curb-side pick up, or at-home shipping."],
                'department': ['You can find different departments by clicking on the "Department" tab at the top of the screen.', 'There you will find a list of categories to choose from.'],
                'service': ['You can find services such as Pharmacy by clicking on the "Services" tab at the top of the screen.', 'There you will find information on services like Auto Care Center, Walmart+ Membership, Photo Services, and more.'],
                'hours':['Walmart store hours vary depending on the location but are typically open from 6AM to 11PM.', 'You can use the Store Finder to find the hours of a specific store and the services provided at the store.'],
            }
        },
        'memorialhermann.org': {
            keywords: {
                'hello': ['Welcome to Golden Access!', 'How can I help you use Memorial Hermann today?'],
                'near me': ['You can use the "Locations" tab at the top of the screen to find the nearest Memorial Hermann location.', 'Just enter your location or ZIP code to find the closest facility or allow the website to use your location to find the closest facility to you..'],
                'doctor': ['You can use the "Find a Doctor" tab at the top of the screen to search for doctors.', 'You can search by name, specialty, condition, or location.', 'You can also schedule an appointment online or call the number provided next to your Doctor\'s name.'],
                'appointment': ['You can schedule an appointment by clicking on the "Schedule Online" Tab at the very top of the screen', "Next enter your Doctor\'s name, the service you need, or your location.", 'Select the facility that you need and then choose "Schedule Now" to book your appointment.', 'This will bring up a page that asks for basic information such as reason for visit, age, and if you are a new patient. After this you will have a list of available times to choose from.'],
                'records': ['You can access your medical records by clicking on the "Patient Portal" tab at the top of the screen.', 'You can log in to your account or create a new account to access your records.', 'If you need help with the portal, you can call the number provided on the website.'],
                'portal': ['In order to sign up for the patient portal, you will need to click on the "Patient Portal" tab at the top of the screen.', 'Then click on the "Sign Up" button.', 'You will need to enter the activation code your doctor gives you, your ZIP code and Date of Birth. If you do not have an activation code, you can select the "Sign up online" Button on the right hand side of the screen which prompts you for all your information for you to make an account', 'Next you should be able to create a username and password for future logins' ,'After this you will be able to access your medical records, schedule appointments, and communicate with your doctor.'],
            }
        },
        'txdmv.gov': {
            keywords: {
                'hello': ['Welcome to Golden Access!', 'How can I help you navigate the Texas DMV website?'],
                'hours': ['Their business hours are Monday through Friday, 8AM - 5PM (Central Time).', 'Due to the large number of calls, you may experience longer hold times.'],
                'phone': ['The Toll-Free number is 1 (888) 368-4689'],
                'help': ['Sure! What do you need help with?'],
                'license': ['Here are the steps to renew your driver\'s license:', '1. Click on the "Renew Driver License at DPS" tab which is located towards the middle of the screen.', '2. You will be redirected to the Texas DPS website.', '3. Select "New Appointment Scheduling System"', '4. Scroll down and select "Schedule a driver license appointment"', '5. Follow the prompts to schedule your appointment.'],
                'registration': ['Here are the steps to renew your vehicle registration:', '1. Click on the "Motorists" tab which is located towards the top of the screen.', '2. Move your cursor to "Vehicle Registration" and then slide the cursor over to register your vehicle.', '3. This page has links to register your vehicle and provides extra resources if you have any unanswered questions.'],

            }
        },
        'dps.texas.gov':{
            'license':['1. Choose "Driver License & IDs" Tab at the top of the screen','2. Select "New Appointment Scheduling System"', '3. Scroll down and select "Schedule a driver license appointment"', '4. Follow the prompts to schedule your appointment.']

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

    // Function to show typing indicator
    function showTypingIndicator() {
        const typingMessage = document.createElement('div');
        typingMessage.classList.add('message', 'auto', 'typing');
        typingMessage.textContent = 'Typing...';
        chatMessages.appendChild(typingMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingMessage;
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

            const typingMessage = showTypingIndicator();

            // Get the current URL of the active tab
            getCurrentTabUrl((currentUrl) => {
                setTimeout(() => {
                    chatMessages.removeChild(typingMessage);

                    const userText = userMessage.textContent.toLowerCase();

                    // Check for keyword responses based on the base URL
                    let foundResponse = false;
                    for (const baseUrl in responses) {
                        if (currentUrl.includes(baseUrl)) {
                            const urlResponses = responses[baseUrl]?.keywords || {};

                            for (const keyword in urlResponses) {
                                if (userText.includes(keyword)) {
                                    const responseList = urlResponses[keyword];

                                    responseList.forEach((response, index) => {
                                        setTimeout(() => {
                                            const nextTypingMessage = showTypingIndicator();
                                            setTimeout(() => {
                                                chatMessages.removeChild(nextTypingMessage);
                                                const autoMessage = document.createElement('div');
                                                autoMessage.classList.add('message', 'auto');
                                                autoMessage.textContent = response;
                                                chatMessages.appendChild(autoMessage);
                                                chatMessages.scrollTop = chatMessages.scrollHeight;
                                            }, 1000);
                                        }, index*1500);
                                    });

                                    foundResponse = true;
                                    break;
                                }
                            }
                            if (foundResponse) break;
                        }
                    }

                    if (!foundResponse) {
                        setTimeout(() => {
                            const noMatchMessage = document.createElement('div');
                            noMatchMessage.classList.add('message', 'auto');
                            noMatchMessage.textContent = 'I\'m sorry, I didn\'t understand that.';
                            chatMessages.appendChild(noMatchMessage);
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                        }, 1000);
                    }
                }, 1000);
            });
        }
    }

    // Event listener for the send button
    sendBtn.addEventListener('click', sendMessage);
    // Send URL as a message and respond with predefined response
    sendURL.addEventListener('click', () => {
        getCurrentTabUrl((currentUrl) => {
            const urlMessage = document.createElement('div');
            urlMessage.classList.add('message', 'user');
            urlMessage.textContent = currentUrl;
            chatMessages.appendChild(urlMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            const typingMessage = showTypingIndicator();

            // Respond with a predefined response if available
            setTimeout(() => {
                chatMessages.removeChild(typingMessage);
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

        });
    });
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
            <button id="editBackButton"> Back</button> 
            <label for="fontType">Font Type:</label>
            <select id="fontType">
                <option value="">Original Font</option>
                <option value="Arial">Arial</option>
                <option value="Courier New">Courier New</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Georgia">Georgia</option>
                <option value="Garamond">Garamond</option>
                <option value="Palatino">Palatino</option>
                <option value="Brush Script MT">Brush Script MT</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
                <option value="Impact">Impact</option>
                <option value="Lucida Console">Lucida Console</option>
                <option value="Consolas">Consolas</option>
            </select>
            <div class="hide">Click to Change Font Type!</div>
            <br>
            <label for="fontSize">Font Size:</label>
            <div class="slider-container" style ="margin: 10px auto 0 auto;">
                <br>
                <input id="fontSize" class="font-size-slider" type="range" min="8" max="32" value="16" step="1">
            </div>
            <div class="hide">Slide the Cursor to Adjust Font Size!</div>
            <label for="fontSize">Font Style:</label>
            <div class="checkbox-container" style ="margin: 10px auto 0 auto;">
                <label style="font-weight: bold; font-size: 20px"><input type="checkbox" id="bold"> Bold</label>
                <br>
                <label style="font-style: italic; font-size: 20px"><input type="checkbox" id="italic"> Italic</label>
                <br>
                <label style="text-decoration: underline; font-size: 20px "><input type="checkbox" id="underline"> Underline</label>
                <br>
            </div>
            <div class="hide">Click the Checkboxes to Change Font Style!</div>
            
            
            <br>
            <button id="applyBtn">Apply Settings</button>
            <div class="hide">Click to Save Your Changes</div>
            <button id="resetBtn">Reset</button>
            <div class="hide">Click to Reset to Original Settings</div>
            
        </div>
        
        <script>
            const fontSizeSlider = document.getElementById('fontSize');
            const fontSizeValue = document.getElementById('fontSizeValue');
            
            fontSizeValue.textContent = fontSizeSlider.value;

            // Update the font size value when the slider changes
            fontSizeSlider.addEventListener('input', function() {
                fontSizeValue.textContent = fontSizeSlider.value;  // Change the displayed value
            });
        </script>
        `;
    
    //calls script to change fonts
    document.getElementById("applyBtn").addEventListener("click", () => {
        const fontType = document.getElementById("fontType").value;
        const fontSize = document.getElementById("fontSize").value;
        

        const isBold = document.getElementById("bold").checked; // Check if bold is selected
        const isItalic = document.getElementById("italic").checked; // Check if italic is selected
        const isUnderline = document.getElementById("underline").checked; // Check if underline is selected

      
        // Get the active tab and inject the script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id }, // Target the active tab
              func: changeFontStyle, // Function to change the font style
              args: [fontType, fontSize, isBold, isItalic, isUnderline] // Pass all style options as arguments
            });
          });
      });

      //Back button functionality
     const frame1 = document.getElementById('frame1');
     const editingFrame = document.getElementById('editingFrame');
 
     const backButton = document.getElementById('editBackButton');
     backButton.addEventListener('click', () => {
         editingFrame.classList.remove('active'); // Hide help chat frame
         frame1.classList.add('active'); // Show main frame
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
      function changeFontStyle(fontType, fontSize, isBold, isItalic, isUnderline) {
        const elements = document.querySelectorAll("body, p, h1, h2, h3, h4, h5, h6, span, div, a");
        elements.forEach((element) => {
          element.style.fontFamily = fontType || ''; // Apply font family if selected
          element.style.fontSize = fontSize ? fontSize + "px" : ''; // Apply font size if provided
          
          element.style.fontWeight = isBold ? "bold" : "normal"; // Apply bold if selected
          element.style.fontStyle = isItalic ? "italic" : "normal"; // Apply italic if selected
          element.style.textDecoration = isUnderline ? "underline" : "none"; // Apply underline if selected
        });
      }
      // Function to reset the font style on the webpage
      function resetFontStyle() {
        const elements = document.querySelectorAll("body, p, h1, h2, h3, h4, h5, h6, span, div, a");
        elements.forEach((element) => {
          element.style.fontFamily = '';
          element.style.fontSize = '';
          element.style.fontWeight = '';
          element.style.fontStyle = '';
          element.style.textDecoration = '';
        });
      }

});