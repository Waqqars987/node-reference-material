const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const socket = io();

// Get username and room from URL
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

// Join Chat Room
socket.emit('joinRoom', { username, room });

// Get Room and users
socket.on('roomUsers', ({ room, users }) => {
	outputRoomName(room);
	outputUsers(users);
});

// Message from server
socket.on('message', message => {
	// console.log(message);
	outputMessage(message);

	// Scroll Down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', event => {
	event.preventDefault();

	// Get message text
	const msg = event.target.elements.msg.value;

	// Emit message to server
	socket.emit('chatMessage', msg);

	// Clear Input
	event.target.elements.msg.value = '';
	event.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage (message) {
	const div = document.createElement('div');
	div.classList.add('message');
	div.innerHTML = `
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">${message.text}</p>
    `;
	document.querySelector('.chat-messages').appendChild(div);
}

// Output Room Name to DOM
function outputRoomName (room) {
	roomName.innerText = room;
}

// Output users to DOM
function outputUsers (users) {
	userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
