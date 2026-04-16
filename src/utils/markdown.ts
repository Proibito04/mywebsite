import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import wikiLinkPlugin from "@flowershow/remark-wiki-link";

const parseProcessor = unified()
  .use(remarkParse)
  .use(wikiLinkPlugin, {
    urlResolver: (node) => {
      if (!node.isEmbed) {
        node.filePath = node.filePath.toLowerCase();
      }
      return node.filePath;
    },
  });

const htmlProcessor = unified()
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeStringify, { allowDangerousHtml: true });

export async function parseMarkdownToNodes(rawMarkdown: string) {
  const mdast = parseProcessor.parse(rawMarkdown);

  await parseProcessor.run(mdast);

  const elevatedNodes: any[] = [];

  mdast.children.forEach((node: any) => {
    if (node.type === "paragraph") {
      let currentSubParagraph: any[] = [];

      node.children.forEach((child: any) => {
        if (child.type === "embed") {
          if (currentSubParagraph.length > 0) {
            elevatedNodes.push({
              type: "paragraph",
              children: currentSubParagraph,
            });
            currentSubParagraph = [];
          }
          elevatedNodes.push(child);
        } else {
          currentSubParagraph.push(child);
        }

        // if (child.type === "wikiLink") {
        //   return {
        //     ...child, // Spread original node first
        //     data: {
        //       ...child.data, // Spread original data (to keep alias, etc.)
        //       // Note: Flowershow usually uses 'permalink' or 'alias'
        //       // Use child.value or child.data.permalink depending on your needs
        //       permalink: child.data.permalink?.toLowerCase(),
        //     },
        //   };
        // }
      });

      // Push remaining text as a paragraph
      if (currentSubParagraph.length > 0) {
        elevatedNodes.push({
          type: "paragraph",
          children: currentSubParagraph,
        });
      }
    } else {
      elevatedNodes.push(node);
    }
  });

  // 3. MAP: Now our loop will actually "see" the embed nodes
  const nodes = await Promise.all(
    elevatedNodes.map(async (node: any) => {
      // Catch Code Blocks
      if (node.type === "code") {
        return {
          type: "code",
          lang: node.lang || "plaintext",
          content: node.value,
        };
      }

      // Catch the elevated Embeds (your Obsidian Images)
      if (node.type === "embed") {
        return {
          type: "obsidian-image",
          filename: node.value,
        };
      }

      // Process everything else (standard paragraphs, links, etc.) normally
      const hastNode = await htmlProcessor.run({
        type: "root",
        children: [node],
      });

      return {
        type: "html",
        content: String(htmlProcessor.stringify(hastNode)),
      };
    }),
  );

  return nodes;
}
