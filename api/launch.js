//
// FINALIZED content for api/index.js (v6 - CRITICAL CRASH FIX)
//
module.exports = async function handler(req, res) {
  console.log("[v6] /api/index called (Crash Fix)");

  try {
    // CRITICAL: Ensure these fallback to safe strings if the environment variables are missing.
    // If these are null/undefined, the JSON.stringify call *will* fail.
    const GAME_URL = process.env.GAME_URL || "https://placeholder.vercel.app/donut-miner";
    const START_IMAGE_URL = process.env.START_IMAGE_URL || "https://i.imgur.com/IsUWL7j.png";
    
    // Check for null values immediately before processing
    if (GAME_URL.includes("placeholder")) {
        console.error("[v6] ERROR: GAME_URL environment variable is missing in Vercel settings.");
        // We still attempt to proceed but console the error
    }

    // 1. Define the Mini App Embed Structure as a JS object
    const miniAppEmbedObject = {
      version: "1",
      imageUrl: START_IMAGE_URL,
      aspectRatio: "3:2", 
      button: {
        title: "Launch Donut Miner ツ",
        action: {
          type: "link", 
          url: GAME_URL, 
        },
      },
    }

    // 2. Stringify the ENTIRE object
    const serializedEmbed = JSON.stringify(miniAppEmbedObject);

    // 3. Construct the HTML
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

    // 4. Set Headers 
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
    res.setHeader("CDN-Cache-Control", "no-store") 
    
    res.status(200).send(html)

  } catch (e) {
    console.error("[v6] FATAL SERVER CRASH in /api/index:", e);
    // If we catch a crash, return 500 to the client
    res.status(500).send(`Server Error: Failed to render embed. Check Vercel logs for missing environment variables or syntax issues.`);
  }
}
