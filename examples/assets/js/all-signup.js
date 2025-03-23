// Register an event listener for "message" events from the window
window.addEventListener("message", function (event) {
  // Define an array of allowed origins (domains) to process messages only from these origins
  var allowedOrigins = ["http://127.0.0.1:5500"];

  // If the origin of the incoming message is not in the allowed list, exit the function
  if (!allowedOrigins.includes(event.origin)) return;

  // Store the received message data in a variable
  var msg = event.data;

  // If the message status is not "success", exit the function
  if (msg.status !== "success") return;

  // Call functions based on the message's step value
  if (msg.step === 1) step2();
  else if (msg.step === 2) step3();
  else if (msg.step === 3) step4();
  else if (msg.step === 4) step5();
});

function step2() {
  window.scrollTo(0, 0);
  setActiveStep(1, 2);
  new PostIframe({
    selector: "#post-iframe",
    src: "./step-2.html",
    sandbox: "allow-forms allow-scripts allow-same-origin",
    onStart: function (el) {
      el.style.display = "none";
    },
    onComplete: function (el) {
      var doc = el.contentDocument || el.contentWindow.document;
      var masthead = doc.querySelector("#masthead");
      var colophon = doc.querySelector("#colophon");
      if (masthead) masthead.style.display = "none";
      if (colophon) colophon.style.display = "none";
      el.style.display = "block";
    },
  });
}

function step3() {
  window.scrollTo(0, 0);
  setActiveStep(2, 3);
  new PostIframe({
    selector: "#post-iframe",
    src: "./step-3.html",
    sandbox: "allow-forms allow-scripts allow-same-origin",
    onStart: function (el) {
      el.style.display = "none";
    },
    onComplete: function (el) {
      var doc = el.contentDocument || el.contentWindow.document;
      var masthead = doc.querySelector("#masthead");
      var colophon = doc.querySelector("#colophon");
      if (masthead) masthead.style.display = "none";
      if (colophon) colophon.style.display = "none";
      el.style.display = "block";
    },
  });
}

function step4() {
  window.scrollTo(0, 0);
  setActiveStep(3, 4);
  new PostIframe({
    selector: "#post-iframe",
    srcdoc:
      "<!DOCTYPE html>\n" +
      '<html lang="en">\n' +
      "    <head>\n" +
      '        <meta charset="UTF-8">\n' +
      '        <link rel="stylesheet" href="./assets/vendor/bootstrap-5.2.3/css/bootstrap.min.css">\n' +
      "    </head>\n" +
      "    <body>\n" +
      '        <div class="d-flex flex-column justify-content-center align-items-center vh-100 text-center">\n' +
      "            <h2>🎉 Step 4. Subscription Complete</h2>\n" +
      "            <p>Your membership has all been registered!<br>\n" +
      "            Log in to Site 2 now and try the service.</p>\n" +
      '            <button type="button" class="btn btn-primary">Login to Site2</button>\n' +
      "        </div>\n" +
      "        <script>\n" +
      '        document.querySelector("button").addEventListener("click", function () {\n' +
      '            window.parent.postMessage({ step: 4, status: "success" }, "*");\n' +
      "        });\n" +
      "        </script>\n" +
      "    </body>\n" +
      "</html>",
    onStart: function (el) {
      el.style.display = "none";
    },
    onComplete: function (el) {
      el.style.display = "block";
    },
  });
}

function step5() {
  window.location.href = "./";
}

function setActiveStep(from = 1, to = 2) {
  var nav = document.getElementById("step-nav");

  var current = nav.querySelector(".step-nav-item.active");
  if (current) current.classList.replace("active", "complete");

  var next = nav.querySelector(".step-nav-item.step-" + to);
  if (next) next.classList.add("active");

  var iframe = document.getElementById("post-iframe");
  iframe.parentElement.classList.replace("step-" + from, "step-" + to);
}
