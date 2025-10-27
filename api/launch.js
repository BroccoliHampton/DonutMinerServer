//
// FINALIZED content for api/launch.js (v7 - POST-MORTEM FIX)
//
module.exports = async function handler(req, res) {
  console.log("[v7] /api/launch called (POST-MORTEM FIX)");

  try {
    const GAME_URL = process.env.GAME_URL || "https://placeholder.vercel.app/donut-miner";
    const START_IMAGE_URL = process.env.START_IMAGE_URL || "https://i.imgur.com/IsUWL7j.png";
    
    if (GAME_URL.includes("placeholder")) {
        console.error("[v7] FATAL ERROR: GAME_URL environment variable is missing.");
    }

    const miniAppEmbedObject = {
      version: "1",
      imageUrl: START_IMAGE_URL,
      aspectRatio: "3:2", 
      button: {
        title: "Launch Donut Miner ツ",
        action: {
          type: "link", 
          url: GAME_URL, // Ensure this points to your deployed frontend index.html
        },
      },
    }

    const serializedEmbed = JSON.stringify(miniAppEmbedObject);

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

    res.setHeader("Content-Type", "text/html; charset=utf-8")
    // Keep aggressive headers
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
    res.setHeader("CDN-Cache-Control", "no-store") 
    
    res.status(200).send(html)

  } catch (e) {
    console.error("[v7] FATAL SERVER CRASH in /api/launch:", e);
    // Even though Vercel reported 200, returning a proper response here is best practice
    res.status(500).send(`Server Error: Embed launch failed. Fatal server error caught.`);
  }
}
