const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const metadataPath = path.join(__dirname, 'metadata.json');
let baseMetadata = {};
try {
  baseMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
} catch (err) {
  console.error('Failed to read metadata.json:', err.message);
}

app.get('/', (req, res) => {
  res.send('SPL token metadata server — GET /metadata or /metadata/:mint');
});

// Return base metadata
app.get('/metadata', (req, res) => {
  res.json(baseMetadata);
});

// Return metadata with the provided mint address included
app.get('/metadata/:mint', (req, res) => {
  const mint = req.params.mint;
  const metadata = Object.assign({}, baseMetadata, { mint });
  res.json(metadata);
});

app.listen(port, () => {
  console.log(`SPL metadata server listening on port ${port}`);
});
