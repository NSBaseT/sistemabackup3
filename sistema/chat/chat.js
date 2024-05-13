function sendMessage() {
    var messageInput = document.getElementById("message-input");
    var message = messageInput.value.trim();

    if (message !== "") {
        var messageContainer = document.createElement("div");
        messageContainer.classList.add("message", "sent");
        var messageText = document.createTextNode(message);
        var messageInfo = document.createElement("div");
        messageInfo.classList.add("message-info");
        var now = new Date();
        var time = now.getHours() + ":" + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
        var timeText = document.createTextNode(time);
        
        messageContainer.appendChild(messageText);
        messageInfo.appendChild(timeText);
        messageContainer.appendChild(messageInfo);

        document.getElementById("chat-messages").appendChild(messageContainer);

        // Scroll para a última mensagem enviada
        document.getElementById("chat-messages").scrollTop = document.getElementById("chat-messages").scrollHeight;

        // Limpar o campo de entrada
        messageInput.value = "";
    }
}

function toggleChat() {
    var chatPopup = document.getElementById("chat-popup");
    if (chatPopup.style.display === "none" || chatPopup.style.display === "") {
        chatPopup.style.display = "block";
    } else {
        chatPopup.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    var profiles = document.getElementsByClassName("profile");
    for (var i = 0; i < profiles.length; i++) {
        profiles[i].addEventListener("click", function() {
            // Código para abrir a conversa com o perfil clicado
            console.log("Abrir conversa com " + this.dataset.name);
        });
    }

    var emojiButton = document.createElement("button");
    emojiButton.innerHTML = "&#x1F642;";
    emojiButton.addEventListener("click", function() {
        var emojiPicker = document.getElementById("emoji-picker");
        if (emojiPicker.style.display === "none") {
            emojiPicker.style.display = "block";
        } else {
            emojiPicker.style.display = "none";
        }
    });
    document.getElementById("message-input").insertAdjacentElement("afterend", emojiButton);
});


