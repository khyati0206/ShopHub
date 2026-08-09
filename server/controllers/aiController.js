import { GoogleGenerativeAI } from '@google/generative-ai';
import Product from '../models/Product.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const chat = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const products = await Product.find().select(
      'title price category brand rating tags badges _id'
    );

    const catalogSummary = products.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      price: p.price,
      category: p.category,
      brand: p.brand,
      rating: p.rating,
      tags: p.tags,
      badges: p.badges,
    }));

    const systemPrompt = `You are ShopHub's AI shopping assistant. Help users find products from our catalog.

PRODUCT CATALOG:
${JSON.stringify(catalogSummary, null, 2)}

Respond ONLY with valid JSON in this exact format (no markdown, no code fences):
{
  "reply": "Your helpful conversational response to the user",
  "recommendations": [
    { "productId": "exact product id from catalog", "reason": "brief reason why this product fits" }
  ]
}

Rules:
- Recommend 1-4 products maximum when relevant
- Only use product IDs that exist in the catalog
- If no products match, return empty recommendations array
- Be friendly and concise
- Consider price, category, ratings, and tags when matching`;

    const historyText = conversationHistory
      .slice(-6)
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');

    const fullPrompt = `${systemPrompt}\n\nConversation history:\n${historyText}\n\nUser: ${message}`;

    if (!process.env.GEMINI_API_KEY) {
      const fallbackProducts = products
        .filter((p) => {
          const lowerMsg = message.toLowerCase();
          return (
            p.title.toLowerCase().includes(lowerMsg) ||
            p.category.toLowerCase().includes(lowerMsg) ||
            p.tags?.some((t) => lowerMsg.includes(t.toLowerCase()))
          );
        })
        .slice(0, 3);

      return res.json({
        reply: "I'm running in demo mode without an AI key. Here are some products that might match your query:",
        recommendations: fallbackProducts.map((p) => ({
          productId: p._id.toString(),
          reason: `Matches your search for "${message}"`,
          product: p,
        })),
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    let parsed;
    try {
      const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return res.json({
        reply: text,
        recommendations: [],
      });
    }

    const enrichedRecommendations = [];
    for (const rec of parsed.recommendations || []) {
      const product = products.find((p) => p._id.toString() === rec.productId);
      if (product) {
        enrichedRecommendations.push({
          productId: rec.productId,
          reason: rec.reason,
          product,
        });
      }
    }

    res.json({
      reply: parsed.reply,
      recommendations: enrichedRecommendations,
    });
  } catch (error) {
    console.error('AI Assistant error:', error);
    res.status(500).json({ message: 'AI assistant temporarily unavailable' });
  }
};
