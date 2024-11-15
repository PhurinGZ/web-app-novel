// // contentProcessor.js

// export const processNovelContent = (content) => {
//     if (!content) return '';
  
//     // Add a style tag for custom formatting
//     const styles = `
//       <style>
//         .novel-content h1 {
//           font-size: 2em;
//           font-weight: bold;
//           margin: 1em 0 0.5em 0;
//           color: #333;
//         }
        
//         .novel-content h2 {
//           font-size: 1.5em;
//           font-weight: bold;
//           margin: 1em 0 0.5em 0;
//           color: #444;
//         }
        
//         .novel-content p {
//           margin: 1em 0;
//           line-height: 1.6;
//           color: #2d2d2d;
//           text-indent: 2em;  /* Add indentation for paragraphs */
//         }
        
//         .novel-content p:first-of-type {
//           text-indent: 0;    /* Optional: Remove indentation for first paragraph */
//         }
        
//         .novel-content ul {
//           margin: 1em 0;
//           padding-left: 2em;
//           list-style-type: disc;
//         }
        
//         .novel-content li {
//           margin: 0.5em 0;
//           line-height: 1.6;
//           text-indent: 0;    /* Reset indentation for list items */
//         }
        
//         .novel-content a {
//           color: #0066cc;
//           text-decoration: underline;
//         }
        
//         .novel-content blockquote {
//           margin: 1em 0;
//           padding: 0.5em 1em;
//           border-left: 4px solid #ddd;
//           background-color: #f9f9f9;
//           font-style: italic;
//         }
        
//         .novel-content pre {
//           background-color: #f5f5f5;
//           padding: 1em;
//           border-radius: 4px;
//           overflow-x: auto;
//         }
        
//         .novel-content code {
//           font-family: monospace;
//           background-color: #f5f5f5;
//           padding: 0.2em 0.4em;
//           border-radius: 3px;
//         }
//       </style>
//     `;
  
//     // Process the content
//     let processedContent = content;
    
//     // Split content into paragraphs based on double newlines
//     processedContent = processedContent
//       .split(/\n\s*\n/)  // Split on empty lines
//       .filter(para => para.trim())  // Remove empty paragraphs
//       .map(para => {
//         // If the paragraph doesn't start with an HTML tag, wrap it in <p>
//         if (!para.trim().startsWith('<')) {
//           return `<p>${para.trim()}</p>`;
//         }
//         return para.trim();
//       })
//       .join('\n\n');  // Join paragraphs with double newlines
    
//     // Convert plain bullet points to HTML lists if they aren't already
//     processedContent = processedContent.replace(
//       /^[•*]\s+(.+)$/gm,
//       '<li>$1</li>'
//     );
    
//     // Wrap consecutive li elements in ul tags
//     processedContent = processedContent.replace(
//       /(<li>.*?<\/li>\s*)+/g,
//       match => `<ul>${match}</ul>`
//     );
    
//     // Handle any remaining single lines that aren't in tags
//     processedContent = processedContent.replace(
//       /^(?!\s*<[a-z\/])[^\n]+$/gm,
//       match => `<p>${match}</p>`
//     );
  
//     // Return the processed content wrapped in a div with the styles
//     return `
//       ${styles}
//       <div class="novel-content">
//         ${processedContent}
//       </div>
//     `;
//   };