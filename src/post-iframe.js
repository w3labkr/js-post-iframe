(function() {
    // Constructor function for PostIframe: sets up and manages an iframe element.
    function PostIframe(options) {
      options = options || {}; // Ensure options is an object even if not provided

      // Get the target element using either the element or selector option
      var element = options.element || (options.selector && document.querySelector(options.selector));
      if (!element) {
        console.error('PostIframe: A valid element must be provided using the "element" or "selector" option.');
        return; // Exit if no valid element is found
      }

      // Ensure that at least one of src or srcdoc options is provided
      if (!options.src && !options.srcdoc) {
        console.error('PostIframe: Either the "src" or "srcdoc" option is required.');
        return; // Exit if neither is provided
      }

      // Reset any previously associated PostIframe instance on the element
      if (element._instance) {
        element._instance = null;
      }

      // Set up properties for the PostIframe instance
      this.element = element; // The iframe element to manage
      this.src = options.src; // URL to be loaded into the iframe
      this.srcdoc = options.srcdoc || ''; // HTML content for the iframe, if provided
      // Define sandbox attributes with a default if none is provided
      this.sandbox = options.sandbox || 'allow-forms allow-scripts allow-same-origin';
      // Callback to execute when the iframe has loaded, if provided
      this.onLoaded = typeof options.onLoaded === 'function' ? options.onLoaded : null;
      // Message to post to the iframe; defaults to sending referrer information
      this.postMessageMessage = options.postMessageMessage || {
        type: 'referrer',
        referrer: window.location.origin + window.location.pathname
      };
      // Target origin for postMessage; defaults to the current origin
      this.postMessageTargetOrigin = options.postMessageTargetOrigin || window.location.origin;

      // Associate this PostIframe instance with the element
      element._instance = this;

      // Start initializing the iframe
      this.initialize();
    }

    // Define the initialize method on the PostIframe prototype: sets up and initializes the iframe.
    PostIframe.prototype.initialize = function() {
      var self = this; // Keep reference for callbacks
      var element = this.element; // Reference to the iframe element
      element.onload = null; // Clear any existing onload event

      // Define the load event handler for the iframe
      var loadHandler = function() {
        // If a src is provided and the iframe's contentWindow is accessible, post a message to it.
        if (self.src && element.contentWindow) {
          element.contentWindow.postMessage(self.postMessageMessage, self.postMessageTargetOrigin);
        }

        // If an onLoaded callback is provided, call it with the iframe element.
        if (self.onLoaded) self.onLoaded(element);

        // Remove this load event listener to avoid duplicate calls.
        element.removeEventListener('load', loadHandler);
      };

      // Add the load event listener to the iframe.
      element.addEventListener('load', loadHandler);

      // If srcdoc is provided (non-empty), use it to set the iframe content.
      if (this.srcdoc !== '') {
        element.removeAttribute('src'); // Remove src attribute if it exists
        element.srcdoc = this.srcdoc; // Set the srcdoc property to the provided HTML content
      } else if (this.src) { // Otherwise, if src is provided
        element.removeAttribute('srcdoc'); // Remove srcdoc attribute if present
        element.setAttribute('sandbox', this.sandbox); // Set the sandbox attribute with the specified policies
        // Append a version parameter to the src URL to avoid caching issues.
        // Use '&' if a query string already exists; otherwise, use '?'
        var separator = (this.src.indexOf('?') !== -1) ? '&' : '?';
        element.src = this.src + separator + "ver=" + Date.now();
      }
    };

    // Expose PostIframe to the global window object so it can be used elsewhere.
    window.PostIframe = PostIframe;
})();
