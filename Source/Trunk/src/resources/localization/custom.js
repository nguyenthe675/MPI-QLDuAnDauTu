// Make sure jQuery has been loaded
var jQuery = require('jquery');

+function ($) {
    var Selector = {
        button        : '[data-toggle="push-menu"]'
    }

    $(document).on('click', Selector.button, function (e) {
        e.preventDefault()
        if($('.sidebar-collapse').length) {
            $(".main-header .sidebar-toggle").append("<style>.fa-arrow-circle-o-left:before{content:'\\f0a9' !important}</style>")
        } else {
            $(".main-header .sidebar-toggle").append("<style>.fa-arrow-circle-o-left:before{content:'\\f0a8' !important}</style>");
        }
    })

}(jQuery);