 var socket = io();
    var uploader = new SocketIOFileClient(socket);
    var form = document.getElementById('upload');

    //************* uploader states *******************
    // uploader.on('start', function(fileInfo) {
    //     console.log('Start uploading', fileInfo);
    // });
    // uploader.on('stream', function(fileInfo) {
    //     console.log('Streaming... sent ' + fileInfo.sent + ' bytes.');
    // });
    uploader.on('complete', function(fileInfo) {
        console.log('Upload Complete', fileInfo);
        srcSelectedLogo = $('option:selected', '.picker').attr('data-img-src');
        $('option:selected', '.picker').attr('data-img-src', "assets/images/" + fileInfo.name);
        $("select").imagepicker(); //reinit the picker
        var msg = {
            srcSelectedOption: srcSelectedLogo,
            infoNewFile: fileInfo
        };
        socket.emit('new logo', msg);
    });
    // uploader.on('error', function(err) {
    //     console.log('Error!', err);
    // });
    // uploader.on('abort', function(fileInfo) {
    //     console.log('Aborted: ', fileInfo);
    // });

    //******** form submit *****************
    form.onchange = function(ev) {
        ev.preventDefault();
        var fileEl = document.getElementById('file');
        var uploadIds = uploader.upload(fileEl);
        return false;
    };


    //*********** update from server ******************
    socket.on('update logo gallery', function(files) {
        var options = "";
        value = 1;
        files.forEach(function(fileName) {
            options += "<option class = 'logo' data-img-src='" + "assets/images/logo/" + fileName + "' value=" + value + "></option>";
            value += 1;
        });
        $('select.picker').html(options);
        $("select").imagepicker(); //reinit the picker
    });

    socket.on('update display', function(stateDB) {
        var arrayDB = stateDB.posts;
        for (var i = 1; i <= 10; i++) {
            var block = arrayDB[i - 1];
            $('#titre' + i).val(block.title);
            $('#logo' + i).attr('src', block.logosrc);
            $('#picto' + i).attr('src', block.pictosrc);
        }
        // fit text into text boxes
        $(function() {
            $('.titre').each(function(index) {
                shrinkToFill($(this), 36, "", 'AkzidenzGroteskBlack');
            });
        });
    });

    //*********** RELOAD ******************
    $('#reload').click(function(e) {
        e.preventDefault();
        location.reload();
    });



    //*********** RESET ******************
    $('#reset').click(function(e) {
        e.preventDefault();
        $('.titre').each(function(index) {
            $(this).val('');
        });
        for (var i = 1; i <= 10; i++) {
            $('#logo' + i).attr('src', 'assets/images/CISL.png');
        }
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