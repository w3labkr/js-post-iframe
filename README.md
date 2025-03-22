# 🧩 PostIframe

**PostIframe** is a lightweight JavaScript utility that simplifies working with iframes.  
Load dynamic content using `src` or `srcdoc`, communicate via `postMessage`, and update iframes on the fly — all with just a few lines of code.

---

## 🚀 Features

- Load iframe via `src` or `srcdoc`
- Secure sandboxing support
- Automatically send `postMessage` to iframe after load
- Receive messages from iframe in the parent
- Manual `.update()` method to refresh iframe content
- Prevents duplicate instances on the same iframe element

---

## 📦 Installation

Include the script directly in your HTML:

```html
<script src="post-iframe.js"></script>
```

---

## 🧪 Basic Usage

### 🔹 Load iframe with `src`

```html
<iframe id="my-frame" style="width:100%; height:300px;"></iframe>

<script>
  new PostIframe({
    element: document.getElementById('my-frame'),
    src: 'https://example.com',
    postMessageMessage: { type: 'hello', value: 'world' },
    onLoaded: function(frame) {
      console.log('Iframe loaded!', frame);
    }
  });
</script>
```

---

### 🔹 Load iframe with `srcdoc`

```html
<iframe id="doc-frame" style="width:100%; height:200px;"></iframe>

<script>
  new PostIframe({
    selector: '#doc-frame',
    srcdoc: '<h1>Hello from srcdoc!</h1>',
  });
</script>
```

---

## 🔄 Updating an Existing Frame

### Automatically (using same selector/element):

```js
new PostIframe({
  selector: '#my-frame',
  src: 'https://old-url.com'
});

// Later...
new PostIframe({
  selector: '#my-frame',
  src: 'https://new-url.com'
});
```

### Manually (using `.update()`):

```js
const instance = new PostIframe({
  selector: '#my-frame',
  src: 'https://initial.com'
});

instance.update({
  src: 'https://updated.com',
  postMessageMessage: { type: 'update', value: 'new content' },
  onLoaded: function(frame) {
    console.log('Updated content loaded!');
  }
});
```

---

## 📬 postMessage Communication

### 🔹 Parent → Iframe

```js
new PostIframe({
  selector: '#my-frame',
  src: 'child.html',
  postMessageMessage: { type: 'greeting', message: 'Hello from parent!' }
});
```

---

## 🧠 Inside the Iframe (`child.html`)

You can handle communication in multiple ways:

---

### ✅ 1. Receiving message from parent

```html
<script>
  window.addEventListener('message', function(event) {
    console.log('Received from parent:', event.data);
  });
</script>
```

---

### 🔁 2. Auto-responding to parent when message is received

```html
<script>
  window.addEventListener('message', function(event) {
    console.log('Received from parent:', event.data);

    // Respond back
    event.source.postMessage(
      { type: 'auto-reply', message: 'Hello from iframe!' },
      event.origin
    );
  });
</script>
```

---

### 🖱️ 3. Sending message to parent on button click

```html
<button id="sendBtn">Send message to parent</button>

<script>
  document.getElementById('sendBtn').addEventListener('click', function() {
    window.parent.postMessage(
      { type: 'click-reply', message: 'Button was clicked!' },
      '*' // In production, replace '*' with a specific origin
    );
  });
</script>
```

---

### 🧭 4. Parent listening for messages from iframe

```js
window.addEventListener('message', function(event) {
  console.log('Received from iframe:', event.data);
});
```

> 🔐 **Security Tip:** Always verify `event.origin` before trusting incoming messages.

---

## ⚙️ Options Reference

| Option                     | Type         | Default                                                                 | Description |
|----------------------------|--------------|-------------------------------------------------------------------------|-------------|
| `element`                  | `HTMLElement`| `undefined`                                                              | The target iframe element. Required if `selector` is not used. |
| `selector`                 | `string`     | `undefined`                                                              | CSS selector to find the iframe. Alternative to `element`. |
| `src`                      | `string`     | `undefined`                                                              | URL to load in the iframe. Required if `srcdoc` is not provided. |
| `srcdoc`                   | `string`     | `''` (empty string)                                                      | Inline HTML to embed directly into the iframe. |
| `sandbox`                  | `string`     | `'allow-forms allow-scripts allow-same-origin'`                         | Sandbox attribute for iframe security. |
| `onLoaded`                 | `function`   | `null`                                                                   | Callback triggered after the iframe is loaded. |
| `postMessageMessage`       | `object`     | `{ type: 'referrer', referrer: window.location.origin + window.location.pathname }` | Message object sent to iframe after load. |
| `postMessageTargetOrigin`  | `string`     | `window.location.origin`                                                | Target origin for `postMessage`. |

---

## 🧠 How It Works

1. Initialize an iframe with either `src` or `srcdoc`.
2. When loaded, PostIframe optionally sends a `postMessage`.
3. Inside the iframe, you can listen for this message and reply back.
4. You can send messages manually via `window.parent.postMessage(...)`.
5. Easily update the iframe content with `.update()`.

---

## 📄 License

MIT License — free to use in personal and commercial projects.
