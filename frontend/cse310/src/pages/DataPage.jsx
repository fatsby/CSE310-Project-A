import { useParams } from "react-router-dom";
import { TextInput, Select, Button } from "@mantine/core";
import {
    getItemById,
    getUserById,
    getReviewsByItemId,
    getOtherItems,
} from "../data/SampleData";
import { ArrowDownToLine } from "lucide-react";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { fullScreenPlugin } from "@react-pdf-viewer/full-screen";
import "@react-pdf-viewer/full-screen/lib/styles/index.css";
import { SpecialZoomLevel } from "@react-pdf-viewer/core";
import {
    ExitFullScreenIcon,
    FullScreenIcon,
} from "@react-pdf-viewer/full-screen";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";

function DataPage() {
    const { id } = useParams();
    const data = getItemById(Number(id));
    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;

    return (
        <>
            <div className="container mx-auto pt-[125px]">
                <div className="py-[20px] mt-[40px] border-y border-solid flex">
                    <p className="col-span-7 font-medium text-[36px] pl-[20px] ">
                        {data.name} - {data.subject}
                    </p>
                    <div className="ml-auto flex items-center pr-[20px]">
                        <Button
                            variant="filled"
                            color="rgba(117, 117, 117, 1)"
                            radius="md"
                            size="lg"
                        >
                            <ArrowDownToLine /> &nbsp; Course
                        </Button>
                    </div>
                </div>
                <div>
                    <Worker
                        workerUrl={`https://unpkg.com/pdfjs-dist@^3.4.120/build/pdf.worker.min.js`}
                    >
                        <Toolbar />
                        <Viewer
                            fileUrl="/Lab4.pdf"
                            plugins={[toolbarPluginInstance]}
                        />
                    </Worker>
                </div>
            </div>
        </>
    );
}

export default DataPage;
