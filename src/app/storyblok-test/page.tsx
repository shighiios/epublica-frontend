'use client'

import { useStoryblokApi } from "@storyblok/react";
import { useEffect, useState } from "react";

export default function StoryblokTestPage() {
  const storyblokApi = useStoryblokApi();
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const { data } = await storyblokApi.get(`cdn/stories/home`, {
          version: "draft",
        });
        console.log("Fetched story:", data.story);
        setArticle(data.story.content);
      } catch (err) {
        console.error("Error fetching Storyblok content", err);
      }
    }

    fetchArticle();
  }, []);

  if (!article?.body?.length) return <p>No content available</p>;

  const block = article.body[0];

  return (
    <div style={{ padding: 20 }}>
      <h1>{block.title}</h1>
      <p><strong>Summary:</strong> {block.summary}</p>
      <p><strong>Author:</strong> {block.author_name}</p>
      <p><strong>Category:</strong> {block.category}</p>
      <p><strong>Language:</strong> {block.language}</p>
      <p><strong>Status:</strong> {block.status}</p>
      {block.image?.filename && (
        <img
          src={block.image.filename}
          alt={block.image.alt || "Image"}
          className="grayscale contrast-125 brightness-90"
          style={{ width: "300px", marginTop: 20 }}
        />
      )}
      <div style={{ marginTop: 20 }}>
        <strong>Body:</strong>
        <div dangerouslySetInnerHTML={{ __html: block.body?.content?.[0]?.content?.[0]?.text || '' }} />
      </div>
    </div>
  );
}
