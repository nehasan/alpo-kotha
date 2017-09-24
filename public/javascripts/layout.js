//var socket = io.connect();
$(document).ready(function(){
//    console.log('--- USER ID: ', user_id);
//    console.log('--- USER NAME: ', user_name);
    $('#sign-out-link').on('click', function(){
        socket.emit('user_offline', { 'user_id': user_id });
    })
})