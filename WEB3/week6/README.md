# SPL Metadata Backend

Minimal Node.js backend that serves a token metadata JSON useful when learning SPL tokens.

Endpoints
- `GET /metadata` — returns the base metadata JSON
- `GET /metadata/:mint` — returns the base metadata with a `mint` field set to the path param

Quick start

```bash
cd /home/singhanurag/Desktop/LEARNING/WEB3/week6
npm install
npm start
# then open http://localhost:3000/metadata
```

Example curl

```bash
curl http://localhost:3000/metadata
curl http://localhost:3000/metadata/YourMintAddressHere
```

Deployment
- Works on any Node.js host (Render, Fly, Heroku, Vercel serverless functions). Set `PORT` if required.

Customizing
- Edit `metadata.json` to change token name, symbol, image, attributes.
