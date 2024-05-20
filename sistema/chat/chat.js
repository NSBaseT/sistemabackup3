// RYAN  1

let from = ""
let to = ""

function generateContainer(message) {
        var activeProfileName = document.getElementById("chat-name").textContent;
    

        var messageContainer = document.createElement("div");

        if (message.from === from) {
            messageContainer.style="margin-left: auto"
        }

        messageContainer.classList.add("message", "sent");
        var messageText = document.createElement("span");
        messageText.textContent = message.content;
        var messageInfo = document.createElement("div");
        messageInfo.classList.add("message-info");
        var moment = new Date(message.createdAt);
        var time = moment.getHours() + ":" + (moment.getMinutes() < 10 ? '0' : '') + moment.getMinutes();
        var timeText = document.createTextNode(time);
        
        var messageStatus = document.createElement("span");
        messageStatus.classList.add("message-status");
        messageStatus.innerHTML = '<i class="bi bi-check-all"></i>'; // Ícone de confirmação de leitura
        
        // var messageDelete = document.createElement("span");
        // messageDelete.classList.add("message-delete");
        // messageDelete.innerHTML = '<i class="bi bi-trash"></i>'; // Ícone de lixeira
        // messageDelete.onclick = function() {
        //     var index = chats[activeProfileName].indexOf(messageContainer);
        //     if (index !== -1) {
        //         chats[activeProfileName].splice(index, 1); // Remover do array de mensagens
        //         messageContainer.remove();
        //     }
        // };

        // var messageEdit = document.createElement("span");
        // messageEdit.classList.add("message-edit");
        // messageEdit.innerHTML = '<i class="bi bi-pencil"></i>'; // Ícone de edição
        // messageEdit.onclick = function() {
        //     var newMessage = prompt("Editar mensagem:", messageText.textContent);
        //     if (newMessage !== null) {
        //         messageText.textContent = newMessage;
        //     }
        // };

        messageContainer.appendChild(messageText);
        messageInfo.appendChild(timeText); // Horário
        messageInfo.appendChild(document.createTextNode(" · ")); // Dois pontinhos separando
        messageInfo.appendChild(messageStatus);
        // messageInfo.appendChild(messageEdit);
        // messageInfo.appendChild(messageDelete);
        messageContainer.appendChild(messageInfo);

       return messageContainer
}

async function setup() {
    const token = localStorage.getItem(CHAVE)

    const response = await fetch('/verify', {
        body: JSON.stringify({ token }),
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const data = await response.json()
    from = data.id;

    const response2 = await fetch('/users')
    const data2 = await response2.json()


    const element = document.getElementById("profile-list")

    data2.filter(arg=>arg.id !== data.id).forEach((arg, index) => {
        element.innerHTML += `
        
        <div class="profile" data-name="${arg.Nome}" data-to="${arg.id}" data-status="online" onclick="openChat(this)">
            <img src="https://source.unsplash.com/random/?Person&${index}" alt="${arg.Nome}" class="profile-pic" id="nayara-pic">
            <span class="profile-name">${arg.Nome}</span>
        </div>
        
        `
    })

}

setInterval(async () => {
    if (to === "" || from === "") return

    const response = await fetch('/chat', {
        body: JSON.stringify({ to, from }),
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const data = await response.json()

    const messages = data.map(generateContainer)

     // Scroll para a última mensagem enviada
     var chatMessages = document.getElementById("chat-messages");
     chatMessages.innerHTML = ""

    messages.forEach(arg => (
        chatMessages.appendChild(arg)
    ))

     chatMessages.scrollTop = chatMessages.scrollHeight;
}, 5000);


setup()




function sendMessage() {
    var messageInput = document.getElementById("message-input");
    var message = messageInput.value.trim();

    if (message !== "") {       
        fetch('/chat/message', {
            method: 'POST',
            body: JSON.stringify({
                content: message,
                from, to
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

         // Limpar o campo de entrada
         messageInput.value = "";
    }
}


// FIM RYAN 1

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

    to =  profileElement.getAttribute('data-to');

    document.getElementById("chat-title").style.display = "none";
    document.getElementById("chat-avatar").style.display = "block";
    document.getElementById("chat-avatar").src = profileElement.querySelector('img').src;
    document.getElementById("chat-name").textContent = name;
    document.getElementById("chat-status").textContent = status === "online" ? "Online" : "Offline";
    document.getElementById("chat-popup").style.display = "block";

    // Limpar mensagens antigas
    var chatMessagesContainer = document.getElementById("chat-messages");
    chatMessagesContainer.innerHTML = '';

}
