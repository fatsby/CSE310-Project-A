import { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  TextInput,
  NumberInput,
  Button,
  Image,
  Badge,
  Paper,
  Group,
  Divider,
  Tabs,
  Table,
  ActionIcon,
  Alert,
  Textarea,
} from "@mantine/core";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  FilePlus2,
  FileText,
  ImagePlus,
} from "lucide-react";
import { getItemById } from "../data/SampleData";

// ========================
// Spring Boot placeholders
// ========================
async function apiFetchItem(/* id */) { /* TODO (API): GET /items/:id */ }
async function apiUpdateItem(/* id, payload */) { /* TODO (API): PUT /items/:id */ }
async function apiUploadImage(/* id, fileOrUrl */) { /* TODO (API): POST /items/:id/images */ }
async function apiDeleteImage(/* id, imageId */) { /* TODO (API): DELETE /items/:id/images/:imageId */ }
async function apiAddFile(/* id, payload */) { /* TODO (API): POST /items/:id/files */ }
async function apiDeleteFile(/* id, fileId */) { /* TODO (API): DELETE /items/:id/files/:fileId */ }

export default function EditItemPage() {
  const { id } = useParams();
  const itemId = Number(id);
  const navigate = useNavigate();

  // Seed from SampleData for now
  const baseItem = getItemById(itemId);

  // ====== UI state (front-end only; no localStorage) ======
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Core fields
  const initial = useMemo(() => {
    if (!baseItem) return null;
    return {
      name: baseItem.name,
      price: Number(baseItem.price) || 0,
      images: [...(baseItem.images || [])],
      subject: baseItem.subject,       // locked
      university: baseItem.university, // locked
      description: baseItem.description ?? "",
    };
  }, [baseItem]);

  const [name, setName] = useState(initial?.name || "");
  const [price, setPrice] = useState(initial?.price || 0);
  const [description, setDescription] = useState(initial?.description || "");

  // Thumbnails
  const [images, setImages] = useState(initial?.images || []);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Files (visual only; in-memory)
  const [files, setFiles] = useState([]); // [{ label, url }]
  const [newFile, setNewFile] = useState({ label: "", url: "" });

  // ---------- Thumbnails handlers ----------
  const addImage = () => {
    if (!newImageUrl.trim()) return;
    setImages((arr) => [...arr, newImageUrl.trim()]);
    setNewImageUrl("");
  };
  const removeImage = (idx) => {
    setImages((arr) => arr.filter((_, i) => i !== idx));
  };
  const moveImageUp = (idx) => {
    if (idx === 0) return;
    setImages((arr) => {
      const cp = [...arr];
      [cp[idx - 1], cp[idx]] = [cp[idx], cp[idx - 1]];
      return cp;
    });
  };
  const moveImageDown = (idx) => {
    setImages((arr) => {
      if (idx >= arr.length - 1) return arr;
      const cp = [...arr];
      [cp[idx + 1], cp[idx]] = [cp[idx], cp[idx + 1]];
      return cp;
    });
  };

  // ---------- Files handlers (visual only) ----------
  const addFile = () => {
    if (!newFile.label.trim() || !newFile.url.trim()) return;
    setFiles((arr) => [...arr, { label: newFile.label.trim(), url: newFile.url.trim() }]);
    setNewFile({ label: "", url: "" });
  };
  const removeFile = (idx) => {
    setFiles((arr) => arr.filter((_, i) => i !== idx));
  };

  // ---------- Save (front-end only) ----------
  const onSave = async () => {
    setError(null);
    if (!name.trim()) return setError("Name is required.");
    if (Number.isNaN(price) || price < 0) return setError("Price must be a non-negative number.");

    // Prepare payload for future API
    const payload = {
      name: name.trim(),
      price,
      images,
      university: baseItem.university, // locked; unchanged
      subject: baseItem.subject,       // locked; unchanged
      description: description,
      files, // when wired, this becomes upload metadata or manifest inputs
    };

    setSaving(true);
    try {
      // await apiUpdateItem(itemId, payload); // TODO (API)
      setSaving(false);
      navigate(`/item/${itemId}`);
    } catch (e) {
      setSaving(false);
      setError("Failed to save changes.");
    }
  };

  if (!baseItem) {
    return (
      <div className="container mx-auto px-4 pt-[125px]">
        <Alert color="red" title="Not Found">
          Item with id {itemId} was not found.
        </Alert>
        <div className="mt-4">
          <Button leftSection={<ArrowLeft />} variant="light" component={Link} to="/profile">
            Back to Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-10 pt-[125px]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Button variant="light" leftSection={<ArrowLeft />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <h1 className="text-3xl font-semibold">Edit Item</h1>
      </div>

      {/* Meta (original subject/university) */}
      <div className="mb-4 text-sm text-gray-600">
        <Badge color="indigo" className="mr-2">{baseItem.subject}</Badge>
        <Badge color="cyan">{baseItem.university}</Badge>
      </div>

      {error && <Alert color="red" className="mb-4">{error}</Alert>}

      <Paper withBorder radius="lg" p="md" className="bg-white">
        <Tabs defaultValue="details" color="indigo" variant="pills" radius="xl">
          <Tabs.List>
            <Tabs.Tab value="details" leftSection={<FileText size={16} />}>
              Details
            </Tabs.Tab>
            <Tabs.Tab value="images" leftSection={<ImagePlus size={16} />}>
              Thumbnails
            </Tabs.Tab>
            <Tabs.Tab value="files" leftSection={<FilePlus2 size={16} />}>
              Files
            </Tabs.Tab>
          </Tabs.List>

          {/* DETAILS */}
          <Tabs.Panel value="details" pt="md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-4">
                <TextInput
                  label="Name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                  radius="md"
                />

                <NumberInput
                  label="Price (VND)"
                  placeholder="0"
                  allowNegative={false}
                  min={0}
                  thousandSeparator
                  value={price}
                  onChange={(val) => setPrice(Number(val) || 0)}
                  radius="md"
                />

                <Textarea
                  label="Description"
                  placeholder="(Optional) Short description"
                  value={description}
                  onChange={(e) => setDescription(e.currentTarget.value)}
                  radius="md"
                />
              </div>

              {/* Locked fields */}
              <div className="lg:col-span-5 space-y-4">
                <TextInput
                  disabled
                  label="University (locked)"
                  placeholder="Locked"
                  value={baseItem.university || ""}
                  radius="md"
                  readOnly
                />
                <TextInput
                  disabled
                  label="Course (locked)"
                  placeholder="Locked"
                  value={baseItem.subject || ""}
                  radius="md"
                  readOnly
                />
                <div className="text-xs text-gray-500">
                  University & Course cannot be edited after an item is uploaded.
                </div>
              </div>
            </div>

            <Divider my="lg" />
            <div className="flex gap-3">
              <Button onClick={onSave} loading={saving} leftSection={<Save size={16} />}>
                Save changes
              </Button>
              <Button variant="light" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </Tabs.Panel>

          {/* IMAGES */}
          <Tabs.Panel value="images" pt="md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Paper withBorder radius="md" p="md">
                <div className="font-semibold mb-2">Add image by URL</div>
                <Group align="flex-end">
                  <TextInput
                    className="flex-1"
                    placeholder="https://example.com/image.jpg"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.currentTarget.value)}
                    radius="md"
                  />
                  <Button leftSection={<Plus size={16} />} onClick={addImage}>
                    Add
                  </Button>
                </Group>
                <div className="text-xs text-gray-500 mt-2">
                  {/* TODO (API): replace with upload to server or presigned URL flow */}
                  Visual-only for now.
                </div>
              </Paper>

              <Paper withBorder radius="md" p="md">
                <div className="font-semibold mb-3">Preview</div>
                {images.length === 0 && (
                  <div className="text-sm text-gray-500">No thumbnails yet.</div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {images.map((src, idx) => (
                    <div key={idx} className="border rounded-md p-2">
                      <div className="relative">
                        <Image src={src} alt={`thumb-${idx}`} radius="sm" />
                        <div className="flex gap-1 mt-2">
                          <ActionIcon variant="light" onClick={() => moveImageUp(idx)} title="Move up">
                            <MoveUp size={16} />
                          </ActionIcon>
                          <ActionIcon variant="light" onClick={() => moveImageDown(idx)} title="Move down">
                            <MoveDown size={16} />
                          </ActionIcon>
                          <ActionIcon color="red" variant="light" onClick={() => removeImage(idx)} title="Delete">
                            <Trash2 size={16} />
                          </ActionIcon>
                        </div>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1 break-all">{src}</div>
                    </div>
                  ))}
                </div>
              </Paper>
            </div>

            <Divider my="lg" />
            <div className="flex gap-3">
              <Button onClick={onSave} loading={saving} leftSection={<Save size={16} />}>
                Save changes
              </Button>
              <Button variant="light" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </Tabs.Panel>

          {/* FILES */}
          <Tabs.Panel value="files" pt="md">
            <Paper withBorder radius="md" p="md" className="mb-4">
              <div className="font-semibold mb-2">Add file (name + URL)</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <TextInput
                  label="Display name"
                  placeholder="Week 1 - Intro.pdf"
                  value={newFile.label}
                  onChange={(e) => setNewFile((f) => ({ ...f, label: e.currentTarget.value }))}
                  radius="md"
                />
                <TextInput
                  label="URL"
                  placeholder="https://example.com/intro.pdf"
                  value={newFile.url}
                  onChange={(e) => setNewFile((f) => ({ ...f, url: e.currentTarget.value }))}
                  radius="md"
                />
                <Button className="self-end" leftSection={<Plus size={16} />} onClick={addFile}>
                  Add File
                </Button>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {/* TODO (API): upload and persist to server; potentially generate manifest for DataPage */}
                Visual only for now.
              </div>
            </Paper>

            <Paper withBorder radius="md" p="md">
              <div className="font-semibold mb-3">Files for this item</div>
              {files.length === 0 ? (
                <div className="text-sm text-gray-500">No files added yet.</div>
              ) : (
                <Table striped withTableBorder withColumnBorders stickyHeader stickyHeaderOffset={0}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th style={{ width: "40%" }}>Name</Table.Th>
                      <Table.Th>URL</Table.Th>
                      <Table.Th style={{ width: 80 }}></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {files.map((f, idx) => (
                      <Table.Tr key={idx}>
                        <Table.Td className="font-medium">{f.label}</Table.Td>
                        <Table.Td className="break-all">
                          <a href={f.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                            {f.url}
                          </a>
                        </Table.Td>
                        <Table.Td>
                          <ActionIcon color="red" variant="light" onClick={() => removeFile(idx)} title="Remove">
                            <Trash2 size={16} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              )}
            </Paper>

            <Divider my="lg" />
            <div className="flex gap-3">
              <Button onClick={onSave} loading={saving} leftSection={<Save size={16} />}>
                Save changes
              </Button>
              <Button variant="light" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </div>
  );
}
