import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiHandler } from "next";
import puppeteer from 'puppeteer'
import { resolve } from 'path'
import fs from 'fs'
import http from 'http'
import stream from 'stream';
import { promisify } from 'util';

import { compileString } from "sass";

const pipeline = promisify(stream.pipeline);

const handler: NextApiHandler = async (req, res) => {
    // console.log(__dirname, req.body);
    // return;

    // let scss = String(fs.readFileSync(resolve("styles/markdown.scss")));
    let markdownStyle = ".markdown-previewer {background-color: white;color: black;padding: 45px;overflow-y: auto;max-width: 980px;width: 100%;min-width: 200px;margin: 0 auto;font-size: 16px;font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;line-height: 1.5;position: relative;}.markdown-previewer * {word-break: keep-all;}.markdown-previewer > * {page-break-inside: avoid;}.markdown-previewer > h1, .markdown-previewer > h2, .markdown-previewer > h3 {page-break-after: avoid;}.markdown-previewer::-webkit-scrollbar {width: 6px;height: 6px;}.markdown-previewer::-webkit-scrollbar-track {border-radius: 10px;background: #e5e5e5;}.markdown-previewer::-webkit-scrollbar-thumb {border-radius: 10px;background: rgba(0, 0, 0, 0.2);}.markdown-previewer img {max-width: 100%;background-color: white;box-sizing: initial;}pre {padding: 16px;tab-size: 4;font-size: 85%;line-height: 1.45;border-radius: 3px;overflow-x: auto;margin-top: 0px;margin-bottom: 16px;color: #24292e !important;}.markdown-previewer h1, .markdown-previewer h2 {padding-bottom: 0.3em;border-bottom: 1px solid #eaecef;margin-top: 24px;margin-bottom: 16px;font-weight: 600;}.markdown-previewer h3, .markdown-previewer h4, .markdown-previewer h5, .markdown-previewer h6 {margin-top: 24px;margin-bottom: 16px;font-weight: 600;}.markdown-previewer a {color: #0366d6;text-decoration: none;}.markdown-previewer p {margin-top: 0;margin-bottom: 16px;}.markdown-previewer p.line code {background-color: #fafafa;padding: 5px;}.markdown-previewer ol, .markdown-previewer ul {padding-left: 2em;margin-top: 0;margin-bottom: 16px;}.markdown-previewer li + li {margin-top: 0.25em;}.markdown-previewer blockquote {padding: 0 1em;color: #6a737d;border-left: 0.25em solid #dfe2e5;margin-top: 0px;margin-bottom: 16px;}.markdown-previewer table {display: block;overflow: auto;width: 100%;border-spacing: 0;border-collapse: collapse;}.markdown-previewer tr {background-color: white;border-top: 1px solid #c6cbd1;}.markdown-previewer th {font-weight: 600;}.markdown-previewer th, .markdown-previewer td {border: 1px solid #c6cbd1;padding: 6px 13px;background-color: white;}.markdown-previewer tr:nth-child(2n) td {background-color: #f6f7f8;}.markdown-previewer hr {height: 0.25em;padding: 0;margin: 24px 0;background-color: #e1e4e8;border: 0;}.markdown-previewer .line-hidden {visibility: none;}.katex-html .tag {display: none;}.markdown-previewer section.checklist {margin-top: 0;margin-bottom: 16px;}.markdown-previewer section.checklist .checkbox-container {display: grid;grid-template-columns: 30px 1fr;align-items: center;}.markdown-previewer section.checklist p {margin: 0px;}.markdown-previewer section.checklist .checkbox-container {margin-top: 0.25em;}"
    let codeCss = String(fs.readFileSync(resolve("styles/atom-one-light.min.css")));
    let katexCss = http.get("http://cdn.jsdelivr.net/npm/katex@0.13.18/dist/katex.min.css");
    const html = req.body.code;
    let doc = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/katex.min.css" integrity="sha384-zTROYFVGOfTw7JV7KUu8udsvW2fx4lWOsCEDqhBreBwlHI4ioVRtmIvEThzJHGET" crossorigin="anonymous">
        <style>${markdownStyle}</style>
        <style>${codeCss}</style>
        <style>${katexCss}</style>
    </head>
    <body class="markdown-previewer">
    ${html}
    </body>`;

    const browser = await puppeteer.launch({
        headless: true,
        args: [`--window-size=794,1123`],
        defaultViewport: {
            width: 980,
            height: 1386
        }
    });
    const page = await browser.newPage();

    doc = String.raw`${doc}`;
    await page.goto("https://google.com")
    await page.setContent(doc, { waitUntil: 'networkidle0' });
    const path = resolve("./.next/static/media/out.pdf")
    const pdf = await page.pdf({
        path,
        format: 'a4',
        printBackground: true,
        margin: {
            top: 80,
            bottom: 80,
            left: 30,
            right: 30
        }
    });
    await browser.close();
    

    res.send("/_next/static/media/out.pdf");

    // res.setHeader('Content-Type', 'application/pdf')
    // res.setHeader('Content-Length', pdf.length)
    // res.send(pdf);
    // res.setHeader('Content-Disposition', `attachment; filename=result.pdf`);
    // await pipeline(pdf, res);
}

export default withApiAuthRequired(handler);