// src/components/TreePdfBrowser.jsx
import { useEffect, useMemo, useState } from "react";
import {
    Tree,
    useTree,
    Group,
    Button,
    Tooltip,
    Badge,
    Paper,
    ScrollArea,
} from "@mantine/core";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import {
    FaFolder,
    FaFolderOpen,
    FaFilePdf,
    FaFileWord,
    FaFilePowerpoint,
    FaFileExcel,
    FaFileAlt,
    FaFileCode,
    FaFileImage,
} from "react-icons/fa";
import { DiJava } from "react-icons/di";
import { SiPython, SiJavascript, SiHtml5, SiCss3 } from "react-icons/si";

const countFiles = (nodes = []) =>
    nodes.reduce(
        (s, n) => s + (n.isLeaf ? 1 : countFiles(n.children || [])),
        0
    );

function isPdf(val, ext) {
    return ext === ".pdf" || (val || "").toLowerCase().endsWith(".pdf");
}

function fileIcon(label, hasChildren, expanded) {
    if (hasChildren)
        return expanded ? (
            <FaFolderOpen color="#f1c40f" />
        ) : (
            <FaFolder color="#f1c40f" />
        );

    const n = (label || "").toLowerCase();

    // Document
    if (n.endsWith(".pdf")) return <FaFilePdf color="#e74c3c" />;
    if (/\.(doc|docx)$/.test(n)) return <FaFileWord color="#2e86c1" />;
    if (/\.(ppt|pptx)$/.test(n)) return <FaFilePowerpoint color="#d35400" />;
    if (/\.(xls|xlsx|csv)$/.test(n)) return <FaFileExcel color="#27ae60" />;

    // Code files
    if (n.endsWith(".java")) return <DiJava color="#f89820" />;
    if (n.endsWith(".py")) return <SiPython color="#3776ab" />;
    if (n.endsWith(".js")) return <SiJavascript color="#f7df1e" />;
    if (n.endsWith(".html")) return <SiHtml5 color="#e34f26" />;
    if (n.endsWith(".css")) return <SiCss3 color="#1572b6" />;

    // Hình ảnh
    if (/\.(png|jpg|jpeg|gif|svg)$/.test(n))
        return <FaFileImage color="#9b59b6" />;

    // File text
    if (n.endsWith(".txt")) return <FaFileAlt color="#7f8c8d" />;

    // File khác
    return <FaFileCode color="#95a5a6" />;
}

export default function TreePdfBrowser({ courseCode }) {
    const [nodes, setNodes] = useState([]);
    const [pdfUrl, setPdfUrl] = useState(null);
    const tree = useTree();

    // Toolbar plugin cho Viewer
    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;

    useEffect(() => {
        setPdfUrl(null);
        tree.collapseAllNodes();
        fetch("/manifest.json", { cache: "no-store" })
            .then((r) => r.json())
            .then((m) => setNodes(m[courseCode] || []))
            .catch(() => setNodes([]));
    }, [courseCode]);

    const totalFiles = useMemo(() => countFiles(nodes), [nodes]);

    const crumb = pdfUrl
        ? decodeURIComponent(
              pdfUrl.replace(
                  `/DataFromCourse/${encodeURIComponent(courseCode)}/`,
                  ""
              )
          )
        : null;

    return (
        <div className="flex flex-col gap-4">
            {/* TOP: Tree + tools */}
            <Paper withBorder radius="md">
                <div className="flex items-center gap-2 p-2 border-b bg-gray-50">
                    <Tooltip label="Mở tất cả">
                        <Button
                            variant="subtle"
                            size="xs"
                            onClick={() => tree.expandAllNodes()}
                        >
                            + Expand
                        </Button>
                    </Tooltip>
                    <Tooltip label="Thu gọn tất cả">
                        <Button
                            variant="subtle"
                            size="xs"
                            onClick={() => tree.collapseAllNodes()}
                        >
                            − Collapse
                        </Button>
                    </Tooltip>
                </div>

                <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 border-b">
                    <span className="truncate">
                        <span className="font-medium">{courseCode}</span>{" "}
                        <span className="opacity-60">/ Tổng file</span>
                    </span>
                    <Badge>{totalFiles}</Badge>
                </div>

                <ScrollArea className="h-[30vh] ">
                    <div className="p-2">
                        <Tree
                            data={nodes}
                            tree={tree}
                            expandOnClick
                            renderNode={({
                                node,
                                expanded,
                                hasChildren,
                                elementProps,
                                level,
                            }) => {
                                const onClick = (e) => {
                                    elementProps.onClick?.(e);
                                    if (!hasChildren) {
                                        if (isPdf(node.value, node.ext))
                                            setPdfUrl(node.value);
                                        else {
                                            setPdfUrl(null);
                                            window.open(
                                                node.value,
                                                "_blank",
                                                "noopener,noreferrer"
                                            );
                                        }
                                    }
                                };
                                return (
                                    <Group
                                        gap={8}
                                        {...elementProps}
                                        onClick={onClick}
                                        className="min-h-7 rounded hover:bg-black/5 cursor-pointer pr-2"
                                        style={{ paddingLeft: level * 20 }}
                                    >
                                        <span className="inline-block w-5 text-center">
                                            {fileIcon(
                                                node.label,
                                                hasChildren,
                                                expanded
                                            )}
                                        </span>
                                        <span className="truncate inline-block">
                                            {node.label}
                                        </span>
                                    </Group>
                                );
                            }}
                        />
                    </div>
                </ScrollArea>
            </Paper>

            {/* BOTTOM: PDF viewer + Toolbar */}
            <Paper withBorder radius="md">
                <div className="px-3 py-2 border-b bg-gray-50 text-sm text-gray-700">
                    {pdfUrl ? (
                        <span className="truncate inline-block max-w-full">
                            <span className="opacity-70">{courseCode} / </span>
                            <span className="font-medium">{crumb}</span>
                        </span>
                    ) : (
                        <span>Chọn file PDF ở phần trên để xem.</span>
                    )}
                </div>

                {pdfUrl && (
                    <div className="border-b px-2 py-2">
                        <Toolbar />
                    </div>
                )}

                <div className="p-2">
                    {pdfUrl ? (
                        <div className="border rounded h-[75vh]">
                            <Worker workerUrl="/pdf.worker.js">
                                <Viewer
                                    fileUrl={pdfUrl}
                                    plugins={[toolbarPluginInstance]}
                                />
                            </Worker>
                        </div>
                    ) : (
                        <div className="p-6 text-sm text-gray-500">
                            Only support PDF file. Click on PDF file above to
                            view!!
                        </div>
                    )}
                </div>
            </Paper>
        </div>
    );
}
