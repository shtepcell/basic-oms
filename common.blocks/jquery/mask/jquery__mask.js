modules.define('jquery', (provide, jQuery) => {
  window.jQuery = jQuery;
  /* borschik:include:../../libs/jquery.mask.min.js */

  provide(jQuery);
});