const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // You'll need to add this to your .env file
});

async function analyzePropertyImage(imageBase64, detectedObject = null) {
  try {
    const prompt = detectedObject 
      ? `I'm analyzing a property image. This specific area contains a ${detectedObject.class} (confidence: ${Math.round(detectedObject.score * 100)}%). Please provide detailed information about:
- Exact material type and composition
- Specific fixture/brand/model if identifiable
- Paint color (specific shade/manufacturer if possible)
- Installation year (if determinable from style/condition)
- Any other relevant details about this component

Be specific and technical.`
      : `Analyze this property image and identify:
- Building materials (walls, flooring, trim, fixtures)
- Paint colors and finishes
- Specific fixture types and possible brands/models
- Installation details and condition
- Any notable features or issues

Provide detailed, technical information about each identifiable component.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: imageBase64
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

module.exports = { analyzePropertyImage };

