// Symbolic AI - VULNERABLE wiring.
// Every chat is routed to the vulnerable chatbot target on :5000, whose system
// prompt contains planted secrets (no input/output filtering). This is what makes
// the bank chatbot exploitable and scannable by garak.
//
// If the :5000 target is unreachable, we return a clear notice (so you never get
// silent "static" answers again).

export const estimateTokens = (text) => Math.max(1, Math.ceil((text || "").length / 4))

const VULN_URL = process.env.VULN_CHATBOT_URL || "http://localhost:5000/chat"

export async function generateReply({ history, message, language, context }) {
  try {
    const resp = await fetch(VULN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })
    if (!resp.ok) {
      const detail = await resp.text()
      console.error(`[AI] vuln target ${resp.status}: ${detail.slice(0, 200)}`)
      return {
        content: `\u26a0\ufe0f The vulnerable target on :5000 returned ${resp.status}. Check that Ollama is running and the model is pulled.`,
        tokens: estimateTokens(message),
      }
    }
    const data = await resp.json()
    const content = (data && (data.reply ?? data.content ?? data.message)) || ""
    return {
      content: content || "(empty reply from target)",
      tokens: estimateTokens(message + content),
    }
  } catch (err) {
    console.error("[AI] vuln target unreachable:", err?.message)
    return {
      content:
        "\u26a0\ufe0f Vulnerable chatbot target is not running on :5000. Start it with 2-run-vuln-chatbot.bat, then try again.",
      tokens: estimateTokens(message),
    }
  }
}
