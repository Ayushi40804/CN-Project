window.onload = function() {
    var app = new CNProject();
    app.init();
};

var CNProject = function() {
    this.socket = null;
    this.role = localStorage.getItem('cn_role') || 'writer'; // 'writer' or 'reader'
};

CNProject.prototype = {
    init: function() {
        var that = this;
        this.socket = io.connect();
        // Initialize role toggle UI
        var roleToggle = document.getElementById('roleToggle');
        if (roleToggle) {
            roleToggle.textContent = that.role === 'writer' ? 'Writer' : 'Reader';
            roleToggle.classList.toggle('reader', that.role === 'reader');
            roleToggle.addEventListener('click', function() {
                that.role = that.role === 'writer' ? 'reader' : 'writer';
                localStorage.setItem('cn_role', that.role);
                roleToggle.textContent = that.role === 'writer' ? 'Writer' : 'Reader';
                roleToggle.classList.toggle('reader', that.role === 'reader');
                that._updateRoleUI();
                that._displayNewMsg('system', 'Switched to ' + that.role + ' mode', 'red');
            }, false);
        }
        that._updateRoleUI();

        this.socket.on('connect', function() {
            document.getElementById('info').textContent = 'get yourself a nickname :)';
            document.getElementById('nickWrapper').style.display = 'block';
            document.getElementById('nicknameInput').focus();
        });

        this.socket.on('nickExisted', function() {
            document.getElementById('info').textContent = '!nickname is taken, choose another pls';
        });

        this.socket.on('loginSuccess', function() {
            document.title = 'cnproject | ' + document.getElementById('nicknameInput').value;
            document.getElementById('loginWrapper').style.display = 'none';
            document.getElementById('messageInput').focus();
        });

        this.socket.on('system', function(nickName, userCount, type) {
            var msg = nickName + (type === 'login' ? ' joined' : ' left');
            that._displayNewMsg('system', msg, 'red');
            document.getElementById('status').textContent =
                userCount + (userCount > 1 ? ' users' : ' user') + ' online';
        });

        this.socket.on('newMsg', function(user, msg, color) {
            that._displayNewMsg(user, msg, color);
        });

        this.socket.on('newImg', function(user, img, color) {
            that._displayImage(user, img, color);
        });

        document.getElementById('loginBtn').addEventListener('click', function() {
            var nickName = document.getElementById('nicknameInput').value;
            if (nickName.trim().length !== 0) {
                that.socket.emit('login', nickName);
            } else {
                document.getElementById('nicknameInput').focus();
            }
        }, false);

        document.getElementById('nicknameInput').addEventListener('keyup', function(e) {
            if (e.keyCode === 13) {
                var nickName = document.getElementById('nicknameInput').value;
                if (nickName.trim().length !== 0) {
                    that.socket.emit('login', nickName);
                }
            }
        }, false);

        document.getElementById('sendBtn').addEventListener('click', function() {
            if (that.role === 'reader') {
                that._displayNewMsg('system', 'You are in reader mode — switch to Writer to send messages.', 'red');
                return;
            }
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value,
                color = '#e6eef3';
            messageInput.value = '';
            messageInput.focus();
            if (msg.trim().length !== 0) {
                that.socket.emit('postMsg', msg, color);
                that._displayNewMsg('me', msg, color);
            }
        }, false);

        document.getElementById('messageInput').addEventListener('keyup', function(e) {
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value,
                color = '#e6eef3';
            if (e.keyCode === 13 && msg.trim().length !== 0) {
                if (that.role === 'reader') {
                    that._displayNewMsg('system', 'You are in reader mode — switch to Writer to send messages.', 'red');
                    return;
                }
                messageInput.value = '';
                that.socket.emit('postMsg', msg, color);
                that._displayNewMsg('me', msg, color);
            }
        }, false);

        document.getElementById('clearBtn').addEventListener('click', function() {
            document.getElementById('history').innerHTML = '';
        }, false);

        document.getElementById('sendImage').addEventListener('change', function() {
            if (that.role === 'reader') {
                that._displayNewMsg('system', 'You are in reader mode — switch to Writer to send images.', 'red');
                this.value = '';
                return;
            }
            if (this.files.length !== 0) {
                var file = this.files[0],
                    reader = new FileReader(),
                    color = '#e6eef3';
                if (!reader) {
                    that._displayNewMsg('system', '!your browser doesn\'t support FileReader', 'red');
                    this.value = '';
                    return;
                }
                reader.onload = function(e) {
                    that.socket.emit('img', e.target.result, color);
                    that._displayImage('me', e.target.result, color);
                };
                reader.readAsDataURL(file);
            }
        }, false);
    },

    _updateRoleUI: function() {
        var isReader = this.role === 'reader';
        var messageInput = document.getElementById('messageInput');
        var sendBtn = document.getElementById('sendBtn');
        var sendImage = document.getElementById('sendImage');
        if (messageInput) {
            messageInput.disabled = isReader;
            messageInput.placeholder = isReader ? 'Reader mode — sending disabled' : 'enter to send';
            messageInput.classList.toggle('disabled', isReader);
        }
        if (sendBtn) {
            sendBtn.disabled = isReader;
            sendBtn.classList.toggle('disabled', isReader);
        }
        if (sendImage) {
            sendImage.disabled = isReader;
        }
    },

    _displayNewMsg: function(user, msg, color) {
        var container = document.getElementById('history'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);
        msgToDisplay.style.color = color || '#e6eef3';
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg;
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    },

    _displayImage: function(user, imgData, color) {
        var container = document.getElementById('history'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);
        msgToDisplay.style.color = color || '#e6eef3';
        msgToDisplay.innerHTML =
            user + '<span class="timespan">(' + date + '): </span><br/>' +
            '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>';
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    }
};
