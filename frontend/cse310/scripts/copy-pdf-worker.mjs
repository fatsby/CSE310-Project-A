import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module"; 

const require = createRequire(import.meta.url); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, "../public");

function findWorkerJs() {
    const pdfjsRoot = path.dirname(
        require.resolve("pdfjs-dist/package.json", { paths: [process.cwd()] })
    );
    const candidates = [
        path.join(pdfjsRoot, "build", "pdf.worker.min.js"),
        path.join(pdfjsRoot, "build", "pdf.worker.js"),
    ];
    for (const c of candidates) if (fs.existsSync(c)) return c;
    throw new Error(
        "Không tìm thấy pdf.worker(.min).js trong pdfjs-dist/build/"
    );
}

(function copy() {
    const src = findWorkerJs();
    const dest = path.join(PUBLIC_DIR, "pdf.worker.js");
    fs.copyFileSync(src, dest);
    console.log("✔ Copied worker → public/pdf.worker.js");
})();
