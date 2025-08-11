import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, "../public");
const ROOT = path.join(PUBLIC_DIR, "DataFromCourse");
const OUT = path.join(PUBLIC_DIR, "manifest.json");

function urlJoin(...parts) {
    return parts.join("/").replace(/\/+/g, "/");
}

function walkDir(absDir, baseUrl) {
    const entries = fs.readdirSync(absDir, { withFileTypes: true });
    const nodes = [];

    for (const e of entries) {
        if (e.name.startsWith(".")) continue;
        const abs = path.join(absDir, e.name);
        const url = urlJoin(baseUrl, e.name);

        if (e.isDirectory()) {
            nodes.push({
                label: e.name,
                value: url + "/",
                children: walkDir(abs, url),
            });
        } else {
            nodes.push({
                label: e.name,
                value: url,
                isLeaf: true,
                ext: path.extname(e.name).toLowerCase(),
            });
        }
    }

    nodes.sort((a, b) => {
        const fa = !!a.children,
            fb = !!b.children;
        if (fa !== fb) return fa ? -1 : 1;
        return a.label.localeCompare(b.label, undefined, { numeric: true });
    });
    return nodes;
}

function buildManifest() {
    if (!fs.existsSync(ROOT)) {
        console.error("Not found:", ROOT);
        process.exit(1);
    }
    const items = fs
        .readdirSync(ROOT, { withFileTypes: true })
        .filter((d) => d.isDirectory());
    const manifest = {};
    for (const d of items) {
        const course = d.name;
        const tree = walkDir(
            path.join(ROOT, course),
            `/DataFromCourse/${encodeURIComponent(course)}`
        );
        manifest[course] = tree;
    }
    fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2));
    console.log("✔ manifest.json generated");
}
buildManifest();
