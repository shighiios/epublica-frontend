import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { submitterName, articleContent, imageUrl } = body;

    const storyblokToken = process.env.STORYBLOK_MANAGEMENT_TOKEN;
    const spaceId = process.env.STORYBLOK_SPACE_ID;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    console.log('🔐 Token:', storyblokToken?.slice(0, 6) + '...');
    console.log('📦 Space ID:', spaceId);
    console.log('🤖 OpenAI Key:', openaiApiKey ? 'Present' : 'Missing');
    console.log('📨 Incoming Data:', { submitterName, articleContent: articleContent?.slice(0, 100) + '...', imageUrl });

    if (!storyblokToken || !spaceId) {
      return NextResponse.json({ error: 'Missing Storyblok environment variables' }, { status: 500 });
    }

    if (!openaiApiKey) {
      return NextResponse.json({ error: 'Missing OpenAI API key' }, { status: 500 });
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    // Generate title and summary using AI
    console.log('🤖 Generating title and summary with AI...');
    
    let title = 'Untitled Article';
    let summary = 'No summary available';

    try {
      const aiResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful writing assistant. Based on the following article content, generate:\n- A clear and engaging title (max 10 words)\n- A 2–3 sentence summary.\n\nReturn ONLY a JSON object like:\n{\n"title": "...",\n"summary": "..."\n}'
          },
          {
            role: 'user',
            content: `Article:\n"""\n${articleContent}\n"""`
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

      const aiContent = aiResponse.choices[0]?.message?.content;
      console.log('🤖 AI Response:', aiContent);

      if (aiContent) {
        try {
          // Safely parse the JSON response
          const parsedResponse = JSON.parse(aiContent.trim());
          
          if (parsedResponse.title && parsedResponse.summary) {
            title = parsedResponse.title;
            summary = parsedResponse.summary;
          } else {
            console.warn('⚠️ AI response missing title or summary fields');
          }
        } catch (parseError) {
          console.error('❌ Failed to parse AI JSON response:', parseError);
          console.log('Raw AI response:', aiContent);
          // Fallback to default values
        }
      }
    } catch (gptError) {
      console.error('❌ GPT API error:', gptError);
      return NextResponse.json({ 
        error: 'Failed to generate title and summary' 
      }, { status: 500 });
    }

    console.log('📝 Generated Title:', title);
    console.log('📝 Generated Summary:', summary);

    // Create slug from AI-generated title
    const slug = `user-submission/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

    // Prepare Storyblok story data
    const storyData = {
      story: {
        name: title,
        slug,
        content: {
          component: 'article',
          title,
          summary,
          author_name: submitterName,
          body: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: articleContent }],
              },
            ],
          },
          ...(imageUrl && { image: { filename: imageUrl, alt: 'User uploaded image' } }),
        },
        is_startpage: false,
      },
      publish: false, // Keep as draft
    };

    console.log('📤 Sending to Storyblok:', storyData);

    const res = await fetch(`https://mapi.storyblok.com/v1/spaces/${spaceId}/stories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': storyblokToken,
      },
      body: JSON.stringify(storyData),
    });

    const result = await res.json();
    console.log('📥 Storyblok response:', result);

    if (!res.ok) {
      return NextResponse.json({ error: result }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      story: result,
      generated: { title, summary }
    });
  } catch (err: any) {
    console.error('❌ Submission error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
