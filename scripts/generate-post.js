const fs = require('fs');
const path = require('path');

function generatePost({ title, slug, category, author, excerpt, content }) {
  const date = new Date().toISOString().split('T')[0];
  const filename = `${date}-${slug}.md`;
  const filepath = path.join(__dirname, '..', 'data', 'blog', 'posts', filename);

  const frontmatter = `---
title: "${title}"
date: "${date}"
category: "${category}"
author: "${author}"
excerpt: "${excerpt}"
coverImage: "/images/blog/${slug}.png"
---

${content}
`;

  fs.writeFileSync(filepath, frontmatter);
  console.log(`Successfully generated: ${filename}`);
}

// Example usage if run directly
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length >= 1) {
    generatePost({
      title: args[0],
      slug: args[0].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: 'visa-guides',
      author: 'Taiwo from JapaLearn',
      excerpt: 'In this detailed guide, Taiwo breaks down recent changes and provides an actionable plan for your migration journey.',
      content: '# Full post content goes here...'
    });
  } else {
    console.log('Usage: node generate-post.js "Post Title"');
  }
}

module.exports = generatePost;
