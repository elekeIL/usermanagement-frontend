// Copyright [2023] [MadeByRaymond (Daniel Raymond Obiekwe)] [www.madebyraymond.io]

function addEvent(parent, evt, selector, handler) {
    parent.addEventListener(evt, function(event) {
      if (event.target.matches(selector + ', ' + selector + ' *')) {
        handler.apply(event.target.closest(selector), arguments);
      }
    }, false);
}

addEvent(document, 'click', '[data-bs-toggle="sidebar"]', function(e) {
    document.querySelector('.sidebar').classList.toggle('active');
});

addEvent(document, 'click', '.sidebar.active .sidebar-overlay, .sidebar a, .sidebar .nav-link, .sidebar button, .dash-header a', function(e) {
    document.querySelector('.sidebar').classList.remove('active');
});
