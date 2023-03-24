# &#x1f680; Road to production reflections

Hoping to officially launch this real soon! Github repo for the very first beta version [HERE](https://github.com/awhuiyun/pomogrids). Built it for my capstone project for General Assembly.

## Final technologies used

1. Typescript
2. Next.js (Fullstack)
3. Prisma
4. Planet Scale (MySQL)
5. Firebase Authentication
6. D3.js for building the heat map
7. Zustand for state management
8. Howler for audio
9. Axios for API calls
10. React uuid for generating unique keys for each task
11. Tailwind for styling
12. Font Awesome for icons

## Roadmap

1. Rebuild backend using Next.js API, Prisma and Planet Scale
2. Optimistic loading to optimize site
3. Implement Stripe checkout to allow users to upgrade to premium plan
4. Build in toasts for better user experience

## Learnings

### 1: Rebuilding backend with Next.js, Prisma and Planet Scale

- Helpful resources: Next.js, Prisma and Planet Scale documentation + Web Dev Simplified Prisma Tutorial
- Learnt the best practice of utilizing Typescript to type safe payloads and responses between API routes and services & concept of barelling in type folders
- Prisma makes it easier to set up databases and query sql data (but heard that it might potentially be slower)
- Next.js API routes makes it easier to set up routes compared to Express
- Challenge: Planet Scale's db resides in US which makes the site very slow. Will need to implement optimistic loading and set up loading spinners

### 2: Optimistic loading, Local storage and Landing pages

- User experience became bad after changing the db from local to Planet Scale (US).
- Two problems:
  1. Initial fetch of data on user change was slow
  2. Every user input became slow as well
- Used optimistic loading to tackle user input and created a landing page for slow initial load
- Local storage will be a stretch goal
