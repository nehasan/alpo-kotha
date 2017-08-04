var socket = io.connect(),
    chat_form = $('#chat-form'),
    message_input = $('#message-box'),
    chat_display = $('#chat-display'),
    room_name = '';

$(document).ready(function () {
    var user_id = $('#user-id').val(),
        user_name = $('#user-name').val();
//    $(document).on('click', '.start-button', function () {
//        user_name = $('.user-name-input').val();
//        id = Math.floor(Math.random() * 500).toString() + user_name;
//        console.log(id);
//        if (user_name !== '') {
//            socket.emit('new user', {'id': id, 'user_name': user_name});
//        } else {
//        }
//    });
    init_socket(user_id, user_name);

    $(document).on('click', '.new-room-button', function () {
        $('#create-new-room-dialog').modal('show');
    });

    $(document).on('click', '#create-room-button', function () {
        // socket = io.connect();
        room_name = $('.room-name').val();
        socket.emit('create new room', {'id': id, 'user_name' : user_name, 'room_name': room_name});
    });

    $(document).on('click', '.join-room-button', function () {
        room_name = $(this).attr('data-room-name');
        socket.emit('join room', {'id': id, 'user_name' : user_name, 'room_name': room_name});
    });

    chat_form.submit(function (e) {
        e.preventDefault();
        socket.emit('send message', {
            'id': id,
            'user_name': user_name,
            'room_name': room_name,
            'message': message_input.val()
        });
        message_input.val('');
    });

    socket.on('update available rooms', function (data) {
        console.log('AVAILABLE ROOMS: ' + data);
        var html = '';
        for (var i in data) {
            html += '<button class="btn btn-success join-room-button" data-room-name="'+ data[i]['room_name'] +'"><i class="fa fa-plus"></i> Join ' + data[i]['room_name'] + '</button>';
        }
        $('.available-rooms').html(html);
    });

    socket.on('incoming message', function (data) {
        var str = data['user_name'] + ': ' + data['message'];
        chat_display.append(str + '\n');
    });

    socket.on('new user success', function (data) {
        // chat_display.append('New user added: ' + data + '\n');
        if (data['user_id'] == user_id) {
            socket.emit('get available rooms', data);
//            $('.name-register-wrapper').css('display', 'none');
            $('.room-selection-wrapper').css('display', 'block');
        }
    });

    socket.on('new user error', function (data) {
        if (data['user_id'] == user_id) {
            alert('User name already taken');
        }
    });

    socket.on('create new room success', function (data) {
        if (data['id'] == id) {
            console.log(data);
            $('.room-selection-wrapper').css('display', 'none');
            $('.chat-display-wrapper').css('display', 'block');
            $('#title-room-name').text(data['room_name']);
            chat_display.append(data['user_name'] + ' just created a new room' + data['room_name'] + '\n');
        }
    });

    socket.on('join room success', function (data) {
        if (data['id'] == id) {
            console.log(data);
            $('.room-selection-wrapper').css('display', 'none');
            $('.chat-display-wrapper').css('display', 'block');
        }
        $('#title-room-name').text(data['room_name']);
        chat_display.append(data['user_name'] + ' has joined the room ' + data['room_name'] + '\n');
    })
});

function init_socket(user_id, user_name){
    console.log('STARTING SOCKET');
    console.log('STARTING SOCKET ', user_id);
    console.log('STARTING SOCKET', user_name);
    socket.emit('new user', {'user_id': user_id, 'user_name': user_name});
}