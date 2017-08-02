    $(function() {
        $('.titre').each(function(index) {
            $(this).keyup(function() {
                shrinkToFill(this, 36, "", 'AkzidenzGroteskBlack');
            });
        });
    });