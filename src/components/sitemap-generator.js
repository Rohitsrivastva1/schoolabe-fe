const fs = require("fs");
const path = require("path");

// Define pages for the sitemap
const pages = ["/", "/about", "/courses", "/contact", "/code"];
const domain = "https://schoolabe.com";

// Construct XML content
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${domain}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("")}
</urlset>`;

// Ensure the public directory exists
const publicPath = path.join(__dirname, "../../public"); // Adjusted path
const sitemapPath = path.join(publicPath, "sitemap.xml");

// Create `public/` directory if it doesn't exist
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
}

// Write sitemap.xml inside `public/`
fs.writeFileSync(sitemapPath, sitemapContent);

console.log("✅ Sitemap generated successfully at:", sitemapPath);
