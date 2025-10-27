//
// MODIFIED content for api/index.js (v1 - Redirect to Donut Miner App)
//
module.exports = async function handler(req, res) {
  console.log("[v1] /api/index called - Method:", req.method)

  try {
    const GAME_URL = process.env.GAME_URL || "https://your-donut-miner-url.com"
    const START_IMAGE_URL = process.env.START_IMAGE_URL || "https://i.imgur.com/IsUWL7j.png"
    
    // This Mini App now serves a single purpose: directing the user 
    // to the main game URL immediately via the "Launch App" button.
    const miniAppEmbed = {
      version: "1",
      imageUrl: START_IMAGE_URL,
      button: {
        title: "Launch Donut Miner ツ",
        action: {
          type: "link", // Change from 'launch_frame' to 'link'
          url: GAME_URL, // Directly link to the Vercel app URL (where index.html is deployed)
        },
      },
    }

    const serializedEmbed = JSON.stringify(miniAppEmbed)
    console.log("[v1] Mini App Embed:", serializedEmbed)

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Donut Miner</title>
  
  <meta property="fc:miniapp" content='${serializedEmbed}' />
  
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

    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
    res.status(200).send(html)

  } catch (e) {
    console.error("[v1] Error in /api/index:", e.message)
    res.status(500).send(`Error: ${e.message}`)
  }
}
