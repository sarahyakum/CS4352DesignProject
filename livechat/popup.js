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

    // Add some HTML code inside the chatContainer
    chatContainer.innerHTML = `
    <div class="chat-container">
      <div class="chat-header">
        Help Chat 
      </div>
      <div class="chat-messages" id="chatMessages"></div>
      <div class="chat-input-container">
        <input type="text" id="chatInput" placeholder="Enter your message..." autocomplete="off">
        <button id="sendBtn">SEND</button>
      </div>
    </div>
  `;

    const chatInput = document.getElementById('chatInput'); // This is the input box where the user will type their messages.
    const chatMessages = document.getElementById('chatMessages'); // This is the area where messages (both from the user and the bot) will appear.
    const sendBtn = document.getElementById('sendBtn'); // This is the button the user will click to send their message.

    // Define a function to handle sending messages
    function sendMessage() {

        // First, check if the input field is not empty (ignoring spaces).
        if (chatInput.value.trim() !== '') {

            // Create a new message element for the user
            const userMessage = document.createElement('div');
            userMessage.classList.add('message', 'user'); // Add the 'message' and 'user' styles to it.
            userMessage.textContent = chatInput.value;  // Set the text to what the user typed.

            // Add the user message to the chat area.
            chatMessages.appendChild(userMessage);

            // Scroll to the bottom of the chat to see the latest message.
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Clear the input field after sending the message.
            chatInput.value = '';

            // Simulate an auto response after a short delay
            setTimeout(() => {
                // Create a new message element for the auto.
                const autoMessage = document.createElement('div');
                autoMessage.classList.add('message', 'auto'); // Add 'message' and 'auto' styles.
                autoMessage.textContent = 'Hello! How can I help you?';  // The automatic response.

                // Add the auto message to the chat area.
                chatMessages.appendChild(autoMessage);

                // Scroll to the bottom of the chat to see the automatic message.
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);  //  waits 1 second (1000ms) before responding.
        }
    }

    // When the 'SEND' button is clicked, send the message.
    sendBtn.addEventListener('click', sendMessage);

    // The user can press 'Enter' on their keyboard to send the message.
    chatInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') { // Check if the 'Enter' key was pressed.
            sendMessage();
        }
    });
});