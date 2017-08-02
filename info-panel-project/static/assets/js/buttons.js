//*********** RELOAD ******************
$('#reload').click(function(e) {
    e.preventDefault();
    location.reload();
});


//*********** RESET ******************
$('#reset').click(function(e) {
    e.preventDefault();
    // reset title
    $('.titre').each(function(index) {
        $(this).val('');
    });

    // rest displayed logo
    $('.logoDisplayed').each(function(index) {
        if (index==0) {console.log($(this).attr('src'));}
        $(this).attr('src', 'assets/images/CISL.png');
    });

    // fit text into text boxes
    $(function() {
        $('.titre').each(function(index) {
            shrinkToFill($(this), 36, "", 'AkzidenzGroteskBlack');
        });
    });
});

//**********PUBLISH *****************
$('#publish').click(function(e) {
    e.preventDefault();
    var posts = [];
    for (var i = 1; i <= 10; i++) {
        var block = {};
        block.id = i;
        block.title = $('#titre' + i).val();
        block.logosrc = $('#logo' + i).attr('src');
        block.pictosrc = $('#picto' + i).attr('src');
        posts.push(block);
    }
    socket.emit('new info', posts);
});