import EditUserClientPage from "./client-page";

// Required for output: 'export'
// For static exports, we must generate all possible paths at build time.
// Since this is a dynamic admin app with unknown IDs, we cannot pre-render strictly.
// However, to make it work in dev (and efficiently in prod if we had a fallback), we can return an empty array.
// But Next.js dev server with `output: 'export'` is strict about visiting unknown paths.
// We will try to disable static params check for dev, or we might need to move to query params.

export function generateStaticParams() {
    return [];
}

export default function EditUserPage() {
    return <EditUserClientPage />;
}
