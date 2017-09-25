var socket = io.connect(),
    user_id = '',
    user_name = '',
    available_rooms = [];
$(document).ready(function () {
    var chat_form = $('#chat-form'),
        message_input = $('#message-box'),
        chat_display = $('#chat-display'),
        room_name = '';
    user_id = $('#user-id').val(),
    user_name = $('#user-name').val();
    
    init_socket(user_id, user_name);

    $(document).on('click', '.new-room-button', function () {
        $('#create-new-room-dialog').modal('show');
    });

    $(document).on('click', '#create-room-button', function () {
        // socket = io.connect();
        room_name = $('.room-name').val();
        socket.emit('create_new_room', {'user_id': user_id, 'user_name' : user_name, 'room_name': room_name});
    });

    $(document).on('click', '.join-room-button', function () {
        room_name = $(this).attr('data-room-name');
        socket.emit('join_room', {'user_id': user_id, 'user_name' : user_name, 'room_name': room_name});
    });

    chat_form.submit(function (e) {
        e.preventDefault();
        socket.emit('send_message', {
            'user_id': user_id,
            'user_name': user_name,
            'room_name': room_name,
            'message': message_input.val()
        });
        message_input.val('');
    });
    
    $(document).on('click', '.chat-user', function(){
//        console.log($(this).attr('data_user_id'));
//        console.log($(this).attr('data_user_name'));
        var new_chat_bubble = $('.frame');
        new_chat_bubble.attr('id', 'chat-bubble-' + $(this).attr('data_user_id'));
        new_chat_bubble.find('.chat-header').html($(this).attr('data_user_name'));
        new_chat_bubble.css('display', 'block');
//        var new_chat_bubble = '<div class="col-sm-3 col-sm-offset-4 frame" id="chat-bubble-' + $(this).attr('data_user_id') + '">' +
//            '<div class="col-sm-12 chat-header">' + $(this).attr('data_user_name') +'</div>' +
//            '<div class="chat-body">' +
//            '<ul>' +
//            '<div>' +
//            '<div class="msj-rta macro" style="margin:auto">' +
//            '<div class="text text-r" style="background:whitesmoke !important">' +
//            '<input class="mytext" placeholder="Type a text">' +
//            '</div>' +
//            '</div>' +
//            '</div>' +
//            '</ul>' +
//            '</div>' +
//            '</div>';
        $('.chat-bubbles').html(new_chat_bubble);
    });
    
    socket.on('update_users_online_status', function(data){
//        console.log(data);
        var html = '';
        for(var i in data){
            if(data[i]._id != user_id){
                var online_div = '';
                if(data[i]['online']){
                    online_div = '<div class="online" style="background:green"></div>';
                }else{
                    online_div = '<div class="online" style="background:gray"></div>';
                }
                html += '<a href="#" class="list-group-item chat-user" data_user_id="' + data[i]._id + '" data_user_name="' + data[i]['user_name'] + '">' +
                    '<div class="row">' + 
                    '<div class="col-md-10">' + data[i]['user_name'] + '</div>' +
                    '<div class="col-md-2">' +
                    online_div +
                    '</div>' +
                    '</div>' +
                    '</a>';
            }
        }
//        console.log(html);
        $('#chat-users').html(html);
    });

    socket.on('update_available_rooms', function (data) {
//        console.log('AVAILABLE ROOMS: ' + data);
        available_rooms = data;
        var html = '';
        for (var i in data) {
            if(data[i]['creator_id'] != user_id){
                html += '<button class="btn btn-success join-room-button" data-room-name="'+ data[i]['room_name'] +'"><i class="fa fa-plus"></i> Join ' + data[i]['room_name'] + '</button>';
            }
        }
        $('.available-rooms').html(html);
    });

    socket.on('incoming_message', function (data) {
        var str = data['user_name'] + ': ' + data['message'];
        chat_display.append(str + '\n');
    });

    socket.on('user_online_success', function (data) {
        // chat_display.append('New user added: ' + data + '\n');
        if (data['user_id'] == user_id) {
            socket.emit('get_available_rooms', data);
            $('.room-selection-wrapper').css('display', 'block');
        }
    });

    socket.on('user_already_online', function (data) {
        if (data['user_id'] == user_id) {
//            console.log('User already online');
            socket.emit('get_available_rooms', data);
            $('.room-selection-wrapper').css('display', 'block');
        }
    });

    socket.on('create_new_room_success', function (data) {
//        console.log('CREATE NEW ROOM SUCCESS');
//        console.log(data);
        if (data['user_id'] == user_id) {
            $('.room-selection-wrapper').css('display', 'none');
            $('.chat-display-wrapper').css('display', 'block');
            $('#title-room-name').text(data['room_name']);
            chat_display.append(data['user_name'] + ' just created a new room : ' + data['room_name'] + '\n');
        }
    });

    socket.on('join_room_success', function (data) {
        if (data['user_id'] == user_id) {
//            console.log(data);
            $('.room-selection-wrapper').css('display', 'none');
            $('.chat-display-wrapper').css('display', 'block');
        }
        $('#title-room-name').text(data['room_name']);
        chat_display.append(data['user_name'] + ' has joined the room ' + data['room_name'] + '\n');
    })
});

function init_socket(user_id, user_name){
    if(user_id && user_name){
        socket.emit('user_online', {'user_id': user_id, 'user_name': user_name});
    }
}