const fs = require('fs');
const path = require('path');

const gitignorePath = path.join(process.cwd(), '.gitignore');

if (fs.existsSync(gitignorePath)) {
  let content = fs.readFileSync(gitignorePath, 'utf8');

  // Find the lnai-generated block
  const regex = /(# lnai-generated\n)([\s\S]*?)(\n# end lnai-generated)/g;

  const newContent = content.replace(regex, (match, start, inner, end) => {
    // Replace all backslashes with forward slashes in the inner content
    let fixedInner = inner.replace(/\\/g, '/');
    // Ensure LNAI-generated root files have a leading slash so they don't globally ignore our `.ai/` sources!
    // This dynamically prepends '/' to any item that doesn't start with '.' or '/'
    fixedInner = fixedInner.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('.') || trimmed.startsWith('/')) {
        return line;
      }
      // Preserve any leading whitespace, prepend the slash
      return line.replace(/^(\s*)/, '$1/');
    }).join('\n');
    return start + fixedInner + end;
  });

  if (content !== newContent) {
    fs.writeFileSync(gitignorePath, newContent);
    console.log('✓ Fixed .gitignore path separators (\\ >> /)');
  }
}
