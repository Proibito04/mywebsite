import { getHighlighter } from 'shikiji'; // Or shiki
import { codeToHtml } from 'shiki';

const code = `nmap -sV 10.129.27.195
{{{---}}}
Starting Nmap 7.95`;

const html = await codeToHtml(code, {
  lang: 'bash',
  theme: 'github-dark'
});
console.log(html);
