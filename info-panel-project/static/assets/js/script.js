$(document).ready(function() {
    $('.picker').imagepicker(); // load image picker script
    var idLogo;

    $('img.logoDisplayed').click(function(e) { // selection of the line to modify
        idLogo = this.id;
        $('.frame2').hide();
        $('.frame2').css({ 'top': e.pageY - 50, 'left': e.pageX });
        $('.frame2').show();

        var altSelectedLogo;
        var srcSelectedLogo;

        $('.okbtn').unbind().click(function() {
            $('.frame2').hide();
            srcSelectedLogo = $('option:selected', '.picker').attr('data-img-src');
            $('img#' + idLogo + '.logoDisplayed').attr('src', srcSelectedLogo);
        });

        $('.js-cropok').click(function() {
            $('.frame3').hide();
            $('.frame1').show();
            $('.frame2').show();
            $('.picker').val(logoDisplayed.value).attr('data-img-src', logoDisplayed.src);
        });
    });

    $('html').click(function() {
        $('.frame2').hide();
        srcSelectedLogo = $('option:selected', '.picker').attr('data-img-src');
        $('img#' + idLogo + '.logoDisplayed').attr('src', srcSelectedLogo);
    });

    $('.frame2').click(function(event) {
        event.stopPropagation();
    });

    $('img.logoDisplayed').click(function(event) {
        event.stopPropagation();
    });
});

function reset() {
    var fields = $('.titre');
    for (var i = 0; i < fields.length; i++) {
        fields[i].value = "";
    }
}
