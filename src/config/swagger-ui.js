// CDN-based Swagger UI HTML for Vercel/serverless compatibility
// Kept separate from server.js to avoid bloating the main server file.

function getSwaggerUiHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>aibigo-server API - Swagger UI</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
      margin: 0;
      background: #1a1a1a;
      color: #ffffff;
    }
    .swagger-ui .topbar {
      display: none;
    }
    /* Dark Theme Styles */
    .swagger-ui {
      color: #ffffff;
    }
    .swagger-ui .info {
      background: #2d2d2d;
      color: #ffffff;
    }
    .swagger-ui .info .title {
      color: #ffffff;
    }
    .swagger-ui .scheme-container {
      background: #2d2d2d;
    }
    .swagger-ui .opblock.opblock-post {
      background: #2d2d2d;
      border-color: #49cc90;
    }
    .swagger-ui .opblock.opblock-get {
      background: #2d2d2d;
      border-color: #61affe;
    }
    .swagger-ui .opblock.opblock-put {
      background: #2d2d2d;
      border-color: #fca130;
    }
    .swagger-ui .opblock.opblock-delete {
      background: #2d2d2d;
      border-color: #f93e3e;
    }
    .swagger-ui .opblock.opblock-patch {
      background: #2d2d2d;
      border-color: #50e3c2;
    }
    .swagger-ui .opblock .opblock-summary {
      background: #1a1a1a;
    }
    .swagger-ui .opblock .opblock-summary-method {
      color: #ffffff;
    }
    .swagger-ui .opblock-body {
      background: #1a1a1a;
    }
    .swagger-ui .opblock-description-wrapper,
    .swagger-ui .opblock-external-docs-wrapper,
    .swagger-ui .opblock-title {
      background: #1a1a1a;
      color: #ffffff;
    }
    .swagger-ui .parameter__name,
    .swagger-ui .parameter__type,
    .swagger-ui .parameter__in {
      color: #ffffff;
    }
    .swagger-ui .btn.execute {
      background: #49cc90;
      color: #ffffff;
    }
    .swagger-ui .btn.cancel {
      background: #f93e3e;
      color: #ffffff;
    }
    .swagger-ui input[type=text],
    .swagger-ui input[type=password],
    .swagger-ui input[type=search],
    .swagger-ui input[type=email],
    .swagger-ui textarea,
    .swagger-ui select {
      background: #2d2d2d;
      color: #ffffff;
      border-color: #555555;
    }
    .swagger-ui .response-col_status {
      color: #ffffff;
    }
    .swagger-ui .response-col_links {
      color: #ffffff;
    }
    .swagger-ui .model-box {
      background: #2d2d2d;
      color: #ffffff;
    }
    .swagger-ui .model-title {
      color: #ffffff;
    }
    .swagger-ui .prop-name {
      color: #ffffff;
    }
    .swagger-ui .prop-type {
      color: #61affe;
    }
    .swagger-ui table thead tr td,
    .swagger-ui table thead tr th {
      background: #2d2d2d;
      color: #ffffff;
    }
    .swagger-ui table tbody tr td {
      background: #1a1a1a;
      color: #ffffff;
    }
    .swagger-ui .response-content-type {
      color: #ffffff;
    }
    .swagger-ui .highlight-code {
      background: #1a1a1a;
    }
    .swagger-ui .microlight {
      background: #1a1a1a;
      color: #ffffff;
    }
    .swagger-ui .auth-btn-wrapper {
      background: #2d2d2d;
    }
    .swagger-ui .auth-container {
      background: #2d2d2d;
    }
    .swagger-ui .auth-wrapper {
      background: #2d2d2d;
    }
    .swagger-ui .authorization__btn {
      background: #49cc90;
      color: #ffffff;
    }
    .swagger-ui .btn.authorize {
      background: #49cc90;
      color: #ffffff;
    }
    .swagger-ui .btn-done {
      background: #49cc90;
      color: #ffffff;
    }
    .swagger-ui .scheme-container {
      background: #2d2d2d;
    }
    .swagger-ui .loading-container {
      background: #1a1a1a;
    }
    .swagger-ui .loading::after {
      border-color: #49cc90 transparent transparent transparent;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      // Build the Swagger JSON URL on the client to avoid mixed-content issues
      const swaggerJsonUrl = window.location.origin + '/api/swagger';

      const ui = SwaggerUIBundle({
        url: swaggerJsonUrl,
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        persistAuthorization: true,
        displayRequestDuration: true
      });
    };
  </script>
</body>
</html>`;
}

module.exports = {
  getSwaggerUiHtml,
};

