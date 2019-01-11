//Creating a Chat Functionality Middleware.
//make connection
//Query DOM
var message=document.getElementById('message');
handle=document.getElementById('handle'),
    btn=document.getElementById('send'),
    output=document.getElementById('output'),
    feedback=document.getElementById('feedback');

//Emit events

var socket=io('http://localhost:4000');

$('#chat-form').submit(function(e){
    e.preventDefault(); //prevents page reloading
    socket.emit('chat',{
        message: message.value,
        handle: handle.value
    });
    message.value="";
    return false;
})

message.addEventListener('keypress',function(){
    socket.emit('typing',handle.value);
});
//Listen for events
socket.on('chat',function(data){
    feedback.innerHTML='';
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing',function(data){
    feedback.innerHTML='<p><em>'+data+'is typing a message...</em></p>';
});

//for the layout and chatbox popup

$(document).on('click', '.panel-heading span.icon_minim', function (e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('focus', '.panel-footer input.chat_input', function (e) {
    var $this = $(this);
    if ($('#minim_chat_window').hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideDown();
        $('#minim_chat_window').removeClass('panel-collapsed');
        $('#minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});

$(document).on('click', '.icon_close', function (e) {
    //$(this).parent().parent().parent().parent().remove();
    $( "#chat_window_1" ).remove();
});

