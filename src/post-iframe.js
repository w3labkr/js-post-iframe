(function() {
  // Constructor function for PostIframe: sets up and manages an iframe element.
  function PostIframe(options) {
    options = options || {};
    // Retrieve the target element using either the element property or a selector.
    var element = options.element || (options.selector && document.querySelector(options.selector));
    if (!element) {
      console.error('PostIframe: A valid element must be provided using the "element" or "selector" option.');
      return;
    }
    // Ensure that either a src or srcdoc option is provided.
    if (!options.src && !options.srcdoc) {
      console.error('PostIframe: Either the "src" or "srcdoc" option is required.');
      return;
    }
    // Reset any previously associated PostIframe instance on the element.
    if (element._instance) {
      element._instance = null;
    }
    this.element = element;
    this.src = options.src;
    this.srcdoc = options.srcdoc || '';
    // Set the sandbox value with a default if none is provided.
    this.sandbox = options.sandbox || 'allow-forms allow-scripts allow-same-origin';
    // Callback executed when the iframe has loaded.
    this.onComplete = typeof options.onComplete === 'function' ? options.onComplete : null;
    // Callback executed when initialization starts.
    this.onStart = typeof options.onStart === 'function' ? options.onStart : null;
    // Message to be posted to the iframe; defaults to sending referrer information.
    this.postMessageMessage = options.postMessageMessage || {
      type: 'referrer',
      referrer: window.location.origin + window.location.pathname
    };
    // Target origin for postMessage; defaults to the current origin.
    this.postMessageTargetOrigin = options.postMessageTargetOrigin || window.location.origin;
    // Associate this PostIframe instance with the element.
    element._instance = this;
    this.initialize();
  }

  // Initialize method: sets up the iframe and attaches event listeners.
  PostIframe.prototype.initialize = function() {
    var self = this;
    var element = this.element;
    // Call onStart callback if provided.
    if (self.onStart) self.onStart(element);
    element.onload = null;
    // Define the load event handler for the iframe.
    var loadHandler = function() {
      // If a src is provided and the iframe's contentWindow is accessible, post a message to it.
      if (self.src && element.contentWindow) {
        element.contentWindow.postMessage(self.postMessageMessage, self.postMessageTargetOrigin);
      }
      // Execute onComplete callback if provided.
      if (self.onComplete) self.onComplete(element);
      // Remove the load event listener to avoid duplicate calls.
      element.removeEventListener('load', loadHandler);
    };
    // Attach the load event listener to the iframe.
    element.addEventListener('load', loadHandler);
    if (this.srcdoc !== '') {
      // If srcdoc is provided, remove the src attribute and set srcdoc.
      element.removeAttribute('src');
      element.srcdoc = this.srcdoc;
    } else if (this.src) {
      // If src is provided, remove the srcdoc attribute.
      element.removeAttribute('srcdoc');
      // If sandbox is set to '*' then remove the sandbox attribute; otherwise, set it.
      if (this.sandbox === '*') {
        element.removeAttribute('sandbox');
      } else {
        element.setAttribute('sandbox', this.sandbox);
      }
      // Append a version parameter to the src URL to avoid caching issues.
      var separator = (this.src.indexOf('?') !== -1) ? '&' : '?';
      element.src = this.src + separator + "ver=" + Date.now();
    }
  };

  // Expose PostIframe to the global window object.
  window.PostIframe = PostIframe;
})();