function updateDisplay(stateDB) {
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
}
