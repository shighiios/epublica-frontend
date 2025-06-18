import { storyblokInit, apiPlugin } from "@storyblok/react";

export const initStoryblok = () => {
  storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_API_TOKEN!,
    use: [apiPlugin],
    components: {}, // We'll register components later
  });
};
