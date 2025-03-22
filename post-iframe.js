(function(){
    // Constructor function for PostIframe
    function PostIframe(options) {
      options = options || {};

      // Get the target element from options (by element or selector)
      var element = options.element || (options.selector && document.querySelector(options.selector));

      // If no valid element is provided, log an error and exit
      if (!element) {
        console.error('PostIframe: You must provide a valid element using the "element" or "selector" option.');
        return;
      }

      // If neither src nor srcdoc is provided, log an error and exit
      if (!options.src && !options.srcdoc) {
        console.error('PostIframe: Either the "src" or "srcdoc" option is required.');
        return;
      }

      // If the element already has a PostIframe instance, update it instead of creating a new one
      if (element._instance) {
        element._instance.update(options);
        return element._instance;
      }

      // Save initial options to the instance
      this.element = element;
      this.src = options.src;
      this.srcdoc = options.srcdoc || '';
      this.sandbox = options.sandbox || 'allow-forms allow-scripts allow-same-origin';
      this.onLoaded = typeof options.onLoaded === 'function' ? options.onLoaded : null;
      this.postMessageMessage = options.postMessageMessage || { type: 'referrer', referrer: window.location.origin + window.location.pathname };
      this.postMessageTargetOrigin = options.postMessageTargetOrigin || window.location.origin;

      // Attach the instance to the element to avoid duplicates
      element._instance = this;

      // Load the iframe with the provided settings
      this.loadFrame();
    }

    // Method to load the iframe with src or srcdoc
    PostIframe.prototype.loadFrame = function() {
      var self = this;
      var frame = this.element;

      // Reset any previous onload handler
      frame.onload = null;

      // Define the load handler function
      var loadHandler = function() {
        // Send a postMessage after the iframe is loaded
        if (self.src && frame.contentWindow) {
          frame.contentWindow.postMessage(self.postMessageMessage, self.postMessageTargetOrigin);
        }

        // Call the onLoaded callback if provided
        if (self.onLoaded) self.onLoaded(frame);

        // Clean up the load event listener
        frame.removeEventListener('load', loadHandler);
      };

      // Set the load event listener
      frame.addEventListener('load', loadHandler);

      // Load via srcdoc if provided
      if (this.srcdoc !== '') {
        frame.removeAttribute('src');
        frame.srcdoc = this.srcdoc;

      // Otherwise, load via src
      } else if (this.src) {
        frame.removeAttribute('srcdoc');
        frame.setAttribute('sandbox', this.sandbox);

        // Add a cache-busting version parameter to the URL
        var separator = (this.src.indexOf('?') !== -1) ? '&' : '?';
        frame.src = this.src + separator + "ver=" + Date.now();
      }
    };

    // Method to update the instance with new options
    PostIframe.prototype.update = function(options) {
      options = options || {};

      // Update values only if they are provided
      if (options.src !== undefined) this.src = options.src;
      if (options.srcdoc !== undefined) this.srcdoc = options.srcdoc;
      if (options.sandbox !== undefined) this.sandbox = options.sandbox;
      if (options.onLoaded !== undefined) this.onLoaded = typeof options.onLoaded === 'function' ? options.onLoaded : null;
      if (options.postMessageMessage !== undefined) this.postMessageMessage = options.postMessageMessage;
      if (options.postMessageTargetOrigin !== undefined) this.postMessageTargetOrigin = options.postMessageTargetOrigin;

      // Reload the iframe with updated settings
      this.loadFrame();
    };

    // Expose PostIframe to the global window object
    window.PostIframe = PostIframe;
})();
