function addEvent(parent, evt, selector, handler) {
  parent.addEventListener(evt, function(event) {
    if (event.target.matches(selector + ', ' + selector + ' *')) {
      handler.apply(event.target.closest(selector), arguments);
    }
  }, false);
}

addEvent(document, 'click', '.menu-toggle-btn', function(e) {
  document.querySelector('.site-header').classList.toggle('show');
});
