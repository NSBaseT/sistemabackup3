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
        
        var messageStatus = document.createElement("span");
        messageStatus.classList.add("message-status");
        messageStatus.textContent = "✓✓";
        
        messageContainer.appendChild(messageText);
        messageInfo.appendChild(timeText);
        messageContainer.appendChild(messageInfo);
        messageContainer.appendChild(messageStatus);

        document.getElementById("chat-messages").appendChild(messageContainer);

        // Scroll para a última mensagem enviada
        document.getElementById("chat-messages").scrollTop = document.getElementById("chat-messages").scrollHeight;

        // Limpar o campo de entrada
        messageInput.value = "";
        
        // Simular que a mensagem foi lida após 2 segundos
        setTimeout(function() {
            messageStatus.classList.add("read");
        }, 2000);
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
            var name = this.dataset.name;
            var status = this.dataset.status;
            var avatar = this.querySelector("img").src;
            
            // Atualizar cabeçalho do chat
            document.getElementById("chat-title").style.display = "none";
            document.getElementById("chat-name").textContent = name;
            document.getElementById("chat-status").textContent = status === "online" ? "Online" : "Offline";
            document.getElementById("chat-avatar").src = avatar;
            document.getElementById("chat-avatar").style.display = "block";

            // Limpar mensagens anteriores
            document.getElementById("chat-messages").innerHTML = "";
            
            console.log("Abrir conversa com " + name);
        });
    }
});
