var chats = {}; // Objeto para armazenar as conversas

function sendMessage() {
    var messageInput = document.getElementById("message-input");
    var message = messageInput.value.trim();

    if (message !== "") {
        var activeProfileName = document.getElementById("chat-name").textContent;
        
        if (!chats[activeProfileName]) {
            chats[activeProfileName] = [];
        }

        var messageContainer = document.createElement("div");
        messageContainer.classList.add("message", "sent");
        var messageText = document.createElement("span");
        messageText.textContent = message;
        var messageInfo = document.createElement("div");
        messageInfo.classList.add("message-info");
        var now = new Date();
        var time = now.getHours() + ":" + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
        var timeText = document.createTextNode(time);
        
        var messageStatus = document.createElement("span");
        messageStatus.classList.add("message-status");
        messageStatus.innerHTML = '<i class="bi bi-check-all"></i>'; // Ícone de confirmação de leitura
        
        var messageDelete = document.createElement("span");
        messageDelete.classList.add("message-delete");
        messageDelete.innerHTML = '<i class="bi bi-trash"></i>'; // Ícone de lixeira
        messageDelete.onclick = function() {
            var index = chats[activeProfileName].indexOf(messageContainer);
            if (index !== -1) {
                chats[activeProfileName].splice(index, 1); // Remover do array de mensagens
                messageContainer.remove();
            }
        };

        var messageEdit = document.createElement("span");
        messageEdit.classList.add("message-edit");
        messageEdit.innerHTML = '<i class="bi bi-pencil"></i>'; // Ícone de edição
        messageEdit.onclick = function() {
            var newMessage = prompt("Editar mensagem:", messageText.textContent);
            if (newMessage !== null) {
                messageText.textContent = newMessage;
            }
        };

        messageContainer.appendChild(messageText);
        messageInfo.appendChild(timeText); // Horário
        messageInfo.appendChild(document.createTextNode(" · ")); // Dois pontinhos separando
        messageInfo.appendChild(messageStatus);
        messageInfo.appendChild(messageEdit);
        messageInfo.appendChild(messageDelete);
        messageContainer.appendChild(messageInfo);

        // Adicionar a mensagem ao array de mensagens do perfil ativo
        chats[activeProfileName].push(messageContainer);

        // Adicionar a mensagem ao chat atual
        document.getElementById("chat-messages").appendChild(messageContainer);

        // Scroll para a última mensagem enviada
        var chatMessages = document.getElementById("chat-messages");
        chatMessages.scrollTop = chatMessages.scrollHeight;

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

function triggerFileInput(event) {
    event.stopPropagation();
    var fileInput = event.target.parentElement.querySelector('.upload-photo-input');
    fileInput.click();
}

function uploadPhoto(event) {
    var input = event.target;
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var img = input.parentElement.querySelector('.profile-pic');
            img.src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function openChat(profileElement) {
    var name = profileElement.getAttribute('data-name');
    var status = profileElement.getAttribute('data-status');
    document.getElementById("chat-title").style.display = "none";
    document.getElementById("chat-avatar").style.display = "block";
    document.getElementById("chat-avatar").src = profileElement.querySelector('img').src;
    document.getElementById("chat-name").textContent = name;
    document.getElementById("chat-status").textContent = status === "online" ? "Online" : "Offline";
    document.getElementById("chat-popup").style.display = "block";

    // Limpar mensagens antigas
    var chatMessagesContainer = document.getElementById("chat-messages");
    chatMessagesContainer.innerHTML = '';

    // Mostrar mensagens do perfil ativo, se existirem
    if (chats[name]) {
        chats[name].forEach(function(message) {
            chatMessagesContainer.appendChild(message);
        });
    }
}
