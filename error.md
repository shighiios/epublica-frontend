epublica-frontend/
├── .env.local                # Storyblok tokens and environment variables
├── package.json              # Project dependencies and scripts
├── postcss.config.js         # Tailwind + PostCSS plugins
├── tailwind.config.js        # Tailwind settings (content, theme)
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # (optional) Next.js config

├── src/
│   ├── app/
│   │   ├── page.tsx                          # Homepage route (/)
│   │   ├── submit/
│   │   │   └── page.tsx                      # Submission form page (/submit)
│   │   ├── article/
│   │   │   └── [slug]/
│   │   │       └── page.tsx                  # Dynamic article route (/article/[slug])
│   │   └── api/
│   │       └── submit-article/
│   │           └── route.ts                  # API route to submit articles to Storyblok
│
│   ├── components/
│   │   ├── Layout.tsx                        # App layout (header, footer)
│   │   └── StoryblokProvider.tsx             # Initializes Storyblok + plugin + component map
│
│   └── app/globals.css                       # Tailwind base + custom styling


mohammedbabikir@Mohammeds-iMac epublica-frontend % clear























mohammedbabikir@Mohammeds-iMac epublica-frontend % git add README.md
git commit -m "Add project README for submission"
git push
On branch main
Your branch is ahead of 'origin/main' by 1 commit.
  (use "git push" to publish your local commits)

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   package-lock.json
	modified:   package.json
	modified:   src/app/globals.css
	modified:   src/app/layout.tsx
	modified:   src/app/page.tsx
	modified:   tsconfig.json

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	error.md
	original-debdead2fb61f75f3222031c4a64760d.webp
	postcss.config.js
	src/app/[slug]/
	src/app/api/
	src/app/storyblok-test/
	src/app/submit/
	src/components/
	storyblok.config.ts
	tailwind.config.js

no changes added to commit (use "git add" and/or "git commit -a")
To https://github.com/shighiios/epublica-frontend
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/shighiios/epublica-frontend'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref. You may want to first integrate the remote changes
hint: (e.g., 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
mohammedbabikir@Mohammeds-iMac epublica-frontend % 
