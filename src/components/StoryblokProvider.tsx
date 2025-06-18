'use client'

import { storyblokInit, apiPlugin, StoryblokComponent } from "@storyblok/react";
import { ReactNode } from "react";

const components = {
  article: StoryblokComponent, // <- this dynamically renders 'article' blocks
};

storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_API_TOKEN!,
  use: [apiPlugin],
  components,
});

export default function StoryblokProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
