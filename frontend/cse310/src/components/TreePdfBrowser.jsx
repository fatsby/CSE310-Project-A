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
    Loader
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
    FaFileImage
} from "react-icons/fa";
import { DiJava } from "react-icons/di";
import { SiPython, SiJavascript, SiHtml5, SiCss3 } from "react-icons/si";
import { getToken } from "../../utils/auth";

// --- Utility Functions ---

function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

function isPdf(filename) {
    return getFileExtension(filename).toLowerCase() === 'pdf';
}

function fileIcon(filename, hasChildren, expanded) {
    if (hasChildren)
        return expanded ? <FaFolderOpen color="#f1c40f" /> : <FaFolder color="#f1c40f" />;

    const ext = getFileExtension(filename).toLowerCase();
    if (ext === "pdf") return <FaFilePdf color="#e74c3c" />;
    if (["doc", "docx"].includes(ext)) return <FaFileWord color="#2e86c1" />;
    if (["ppt", "pptx"].includes(ext)) return <FaFilePowerpoint color="#d35400" />;
    if (["xls", "xlsx", "csv"].includes(ext)) return <FaFileExcel color="#27ae60" />;
    if (ext === "java") return <DiJava color="#f89820" />;
    if (ext === "py") return <SiPython color="#3776ab" />;
    if (ext === "js") return <SiJavascript color="#f7df1e" />;
    if (["html", "htm"].includes(ext)) return <SiHtml5 color="#e34f26" />;
    if (ext === "css") return <SiCss3 color="#1572b6" />;
    if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext)) return <FaFileImage color="#9b59b6" />;
    if (ext === "txt") return <FaFileAlt color="#7f8c8d" />;
    return <FaFileCode color="#95a5a6" />;
}

export default function TreePdfBrowser({ document }) {
    const [nodes, setNodes] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    // NEW: Store the Blob URL for the viewer
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null); 
    const [isLoadingPdf, setIsLoadingPdf] = useState(false);
    
    const tree = useTree();
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;

    // --- 1. Fetch PDF Blob when selection changes ---
    useEffect(() => {
        // Reset previous state
        setPdfBlobUrl(null);
        
        // If no file selected or not a PDF, stop here
        if (!selectedFile || selectedFile.type !== 'pdf') return;

        let active = true;
        const fetchPdf = async () => {
            setIsLoadingPdf(true);
            try {
                const token = getToken();
                const response = await fetch(selectedFile.url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error("Failed to load PDF");

                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);

                if (active) {
                    setPdfBlobUrl(objectUrl);
                } else {
                    URL.revokeObjectURL(objectUrl); // Cleanup if component unmounted
                }
            } catch (error) {
                console.error("Error loading PDF:", error);
            } finally {
                if (active) setIsLoadingPdf(false);
            }
        };

        fetchPdf();

        // Cleanup function
        return () => {
            active = false;
            if (pdfBlobUrl) {
                URL.revokeObjectURL(pdfBlobUrl);
            }
        };
    }, [selectedFile]); // Re-run when selectedFile changes

    // --- Transform Document Files to Tree Nodes ---
    useEffect(() => {
        if (!document || !document.files) {
            setNodes([]);
            return;
        }

        const fileNodes = document.files.map(file => ({
            value: file.id.toString(),
            label: file.fileName,
            fileId: file.id,
            isLeaf: true,
            size: file.sizeBytes,
            downloadUrl: `${API_URL}/api/documents/${document.id}/files/${file.id}/download`
        }));

        const rootNode = [
            {
                value: "root",
                label: document.name,
                children: fileNodes,
                isLeaf: false
            }
        ];

        setNodes(rootNode);
        setTimeout(() => tree.expandAllNodes(), 100);

    }, [document]);

    const totalFiles = useMemo(() => document?.files?.length || 0, [document]);

    const handleNodeClick = async (node) => {
        if (!node.isLeaf) return;

        const filename = node.label;
        
        if (isPdf(filename)) {
            setSelectedFile({
                url: node.downloadUrl,
                name: filename,
                type: 'pdf'
            });
        } else {
            setSelectedFile(null);
            await downloadFile(node.downloadUrl, filename);
        }
    };

    const downloadFile = async (url, filename) => {
        try {
            const token = getToken();
            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 403) {
                alert("You do not have permission to download this file.");
                return;
            }
            if (!res.ok) throw new Error("Download failed");

            const blob = await res.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            
            const a = window.document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            window.document.body.appendChild(a);
            a.click();
            
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("Download error:", error);
            alert("Error downloading file: " + error.message);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* TOP: Tree + Info */}
            <Paper withBorder radius="md">
                {/* ... (Header UI code remains the same) ... */}
                <div className="flex items-center gap-2 p-2 border-b bg-gray-50">
                    <Tooltip label="Expand All">
                        <Button variant="subtle" size="xs" onClick={() => tree.expandAllNodes()}>
                            + Expand
                        </Button>
                    </Tooltip>
                    <Tooltip label="Collapse All">
                        <Button variant="subtle" size="xs" onClick={() => tree.collapseAllNodes()}>
                            − Collapse
                        </Button>
                    </Tooltip>
                </div>

                <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 border-b">
                    <span className="truncate font-medium">File Explorer</span>
                    <span>
                        <span className="font-bold mr-2">Total files:</span>
                        <Badge>{totalFiles}</Badge>
                    </span>
                </div>

                <ScrollArea className="h-[30vh]">
                    <div className="p-2">
                        <Tree
                            data={nodes}
                            tree={tree}
                            expandOnClick
                            renderNode={({ node, expanded, hasChildren, elementProps, level }) => (
                                <Group
                                    gap={8}
                                    {...elementProps}
                                    onClick={(e) => {
                                        elementProps.onClick?.(e);
                                        handleNodeClick(node);
                                    }}
                                    className={`min-h-7 rounded cursor-pointer pr-2 transition-colors ${
                                        selectedFile?.name === node.label 
                                            ? "bg-blue-50 text-blue-700 font-medium" 
                                            : "hover:bg-gray-100"
                                    }`}
                                    style={{ paddingLeft: level * 20 }}
                                >
                                    <span className="inline-block w-5 text-center">
                                        {fileIcon(node.label, hasChildren, expanded)}
                                    </span>
                                    <span className="truncate inline-block font-normal">
                                        {node.label}
                                    </span>
                                </Group>
                            )}
                        />
                    </div>
                </ScrollArea>
            </Paper>

            {/* BOTTOM: PDF Viewer */}
            <Paper withBorder radius="md">
                <div className="px-3 py-2 border-b bg-gray-50 text-sm text-gray-700 flex justify-between items-center">
                    {selectedFile?.type === 'pdf' ? (
                        <span className="truncate">
                            <span className="opacity-70">Viewing: </span>
                            <span className="font-medium">{selectedFile.name}</span>
                        </span>
                    ) : (
                        <span className="font-bold text-gray-500">
                            Select a PDF to view.
                        </span>
                    )}
                </div>

                {pdfBlobUrl && !isLoadingPdf && (
                    <div className="border-b px-2 py-2 bg-gray-50">
                        <Toolbar />
                    </div>
                )}

                <div className="p-2 bg-slate-50">
                    {isLoadingPdf ? (
                        <div className="h-[75vh] flex items-center justify-center bg-white border rounded">
                            <Loader />
                        </div>
                    ) : pdfBlobUrl ? (
                        <div className="border rounded h-[75vh] bg-white shadow-inner">
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                <Viewer
                                    fileUrl={pdfBlobUrl} // Now passing a simple string URL
                                    plugins={[toolbarPluginInstance]}
                                />
                            </Worker>
                        </div>
                    ) : (
                        <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                            <FaFilePdf size={48} className="mb-4 opacity-50" />
                            <p>No PDF selected</p>
                        </div>
                    )}
                </div>
            </Paper>
        </div>
    );
}