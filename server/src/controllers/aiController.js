const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initializing the Gemini AI SDK with provided key
const genAI = new GoogleGenerativeAI("AIzaSyBPzv3mggf8OvUyjM_jJ9LPb2j0U8Q8nJs");

const processChat = async (req, res) => {
    const { message } = req.body;
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const systemPrompt = "You are Angelina, a friendly AI English speaking coach for the platform Speakerlly. Users come to you to overcome their language fears, book sessions, and gain confidence. Keep responses under 3 sentences. Be extremely warm, concise, and helpful.";
        
        const result = await model.generateContent(`${systemPrompt}\n\nThe user says: "${message}"\n\nYour response as Angelina:`);
        const responseText = result.response.text();

        res.json({ reply: responseText, confidence_boost: true });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ message: 'Angelina is currently offline. My servers are taking a short nap! 🧠💤', error: error.message });
    }
}

module.exports = { processChat };
