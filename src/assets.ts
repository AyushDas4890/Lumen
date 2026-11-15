/** Resolve a file in /public against the deploy base path (works on Pages, Vercel and the artifact build). */
export const img = (name: string) => `${import.meta.env.BASE_URL}img/${name}.webp`;
