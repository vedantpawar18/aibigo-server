// CDN-based Swagger UI HTML for Vercel/serverless compatibility
// Kept separate from server.js to avoid bloating the main server file.

function getSwaggerUiHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>aibigo-server API - Swagger UI</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
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
      background: #fafafa;
    }
    .swagger-ui .topbar {
      display: none;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = () => {
      // Use window.location.origin to ensure same protocol (HTTPS/HTTP)
      // This prevents mixed content errors
      const swaggerJsonUrl = window.location.origin + '/api/swagger';
      
      SwaggerUIBundle({
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
        displayRequestDuration: true,
        tryItOutEnabled: true,
        // Override server URLs to use current origin (fixes CORS issues)
        requestInterceptor: (request) => {
          // Replace any server URL with current origin
          if (request.url && !request.url.startsWith(window.location.origin)) {
            // If URL is absolute but not from current origin, replace with current origin
            const urlObj = new URL(request.url, window.location.origin);
            request.url = window.location.origin + urlObj.pathname + urlObj.search;
          }
          return request;
        }
      });
    };
  </script>
</body>
</html>`;
}

module.exports = {
  getSwaggerUiHtml,
};

