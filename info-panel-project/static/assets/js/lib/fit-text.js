/* Shrinking font-size at a user types to fit in an input */

// txt is the text to measure, font is the full CSS font declaration,
// e.g. "bold 12px Verdana"
function measureText(txt, font) {
    var id = 'text-width-tester',
        $tag = $('#' + id);
    if (!$tag.length) {
        $tag = $('<span id="' + id + '" style="display:none;text-transform: uppercase; font:' + font + ';">' + txt + '</span>');
        $('body').append($tag);
    } else {
        $tag.css({ font: font }).html(txt);
    }
    return {
        width: $tag.width(),
        height: $tag.height()
    }
}



function shrinkToFill(input, fontSize, fontWeight, fontFamily) {
    var $input = $(input),
        txt = $input.val(),
        maxWidth = $input.width() + 5, // add some padding
        font = fontWeight + " " + fontSize + "px " + fontFamily;
    // see how big the text is at the default size
    var textWidth = measureText(txt, font).width;
    if (textWidth > maxWidth) {
        // if it's too big, calculate a new font size
        // the extra .9 here makes up for some over-measures
        fontSize = fontSize * maxWidth / textWidth * .9;
        font = fontWeight + " " + fontSize + "px " + fontFamily;
        // and set the style on the input
        $input.css({ font: font });
    } else {
        // in case the font size has been set small and 
        // the text was then deleted
        $input.css({ font: font });
    }
}

