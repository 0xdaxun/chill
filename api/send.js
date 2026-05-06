export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const { message } = req.body || {};
  
      if (!message) {
        return res.status(400).json({ error: "Missing message" });
      }
  
      const token = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
  
      if (!token || !chatId) {
        return res.status(500).json({ error: "Missing env variables" });
      }
  
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
  
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          disable_web_page_preview: true
        })
      });
  
      const data = await response.json();
  
      if (!data.ok) {
        return res.status(500).json({
          error: "Telegram API error",
          details: data
        });
      }
  
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({
        error: "Server error",
        details: err.message
      });
    }
  }