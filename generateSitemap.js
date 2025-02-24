// generateSitemap.js
import { collection, getDocs } from "firebase/firestore";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { writeFile } from "fs/promises";
import { db } from "./config/firebase.js";

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateSitemap() {
  try {
    // Fetch all prompts
    console.log("Connecting to Firestore...");
    const promptsCollection = collection(db, "prompts");
    console.log("Collection reference created");

    console.log("Attempting to fetch documents...");
    const promptsSnapshot = await getDocs(promptsCollection);
    console.log("Documents fetched successfully");
    console.log(`Total documents found: ${promptsSnapshot.size}`);

    // Debug: Log first document if exists
    if (promptsSnapshot.size > 0) {
      const firstDoc = promptsSnapshot.docs[0];
      console.log("Example document:", firstDoc.data());
    }

    const prompts = promptsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        updatedAt: data.updatedAt || new Date().toISOString(),
      };
    });

    // Start XML content
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static routes first (matching your React Router structure)
    const staticRoutes = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/login", priority: "0.5", changefreq: "monthly" },
      { url: "/signup", priority: "0.5", changefreq: "monthly" },
      { url: "/main/prompts", priority: "0.9", changefreq: "daily" },
      { url: "/main/ai-tools", priority: "0.8", changefreq: "daily" },
    ];

    staticRoutes.forEach((route) => {
      sitemap += `  <url>
    <loc>https://promptrank.io${route.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
    });

    // Add dynamic prompt routes
    prompts.forEach((prompt) => {
      sitemap += `  <url>
    <loc>https://promptrank.io/main/prompts/${prompt.id}</loc>
    <lastmod>${prompt.updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });

    // Close XML
    sitemap += `</urlset>`;

    // Write to public directory using promises
    const filePath = join(__dirname, "public", "sitemap.xml");
    await writeFile(filePath, sitemap);

    console.log(`Sitemap generated with ${prompts.length} prompt URLs`);
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }
}

// ES Module way of running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap();
}

export default generateSitemap;
