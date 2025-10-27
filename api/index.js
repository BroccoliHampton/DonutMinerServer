//
// FINALIZED content for api/index.js (v4 - Cache Busting & Full Link Embed)
//
module.exports = async function handler(req, res) {
  console.log("[v4] /api/index called (Embed Link)");

  try {
    const GAME_URL = process.env.GAME_URL || "https://your-donut-miner-url.com"
    const START_IMAGE_URL = process.env.START_IMAGE_URL || "https://i.imgur.com/IsUWL7j.png"
    
    // 1. Define the Mini App Embed Structure
    const miniAppEmbed = {
      version: "1",
      imageUrl: START_IMAGE_URL,
      aspectRatio: "3:2", 
      button: {
        title: "Launch Donut Miner ツ",
        action: {
          type: "link", // Direct link action to launch the full app
          url: GAME_URL, 
        },
      },
    }

    const serializedEmbed = JSON.stringify(miniAppEmbed)

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Donut Miner</title>
  
  <meta property="fc:miniapp" content='${serializedEmbed}' />
  <meta property="fc:frame" content='${serializedEmbed}' /> 
  
  <meta property="og:title" content="Donut Miner ツ" />
  <meta property="og:description" content="Click to launch the King Glazer Donut App" />
  <meta property="og:image" content="${START_IMAGE_URL}" />
</head>
<body>
  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; background: #FFFACD; color: #333;">
    <h1>Donut Miner</h1>
    <p>Please click the button to launch the full application!</p>
  </div>
</body>
</html>`

    // 2. Set Headers to Prevent Caching
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    // Use the most aggressive combination to bypass Vercel's default caching (which is priority 1.1)
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
    res.setHeader("CDN-Cache-Control", "no-store") 
    
    res.status(200).send(html)

  } catch (e) {
    console.error("[v4] Error in /api/index:", e.message)
    res.status(500).send(`Error: ${e.message}`)
  }
}
