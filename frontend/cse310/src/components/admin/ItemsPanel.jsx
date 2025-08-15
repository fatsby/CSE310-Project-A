import { useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Loader,
  Modal,
  NumberInput,
  Select,
  Table,
  Text,
  TextInput,
  Textarea,
  Tooltip,
  Group,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Edit3, Trash2, Plus, Star, Search } from "lucide-react";
import { getUniversityNames, getCoursesByUniversity } from "../../data/SampleData";

export default function ItemsPanel({ loading, items, onUpsert, onDelete }) {
  const [query, setQuery] = useState("");
  const [university, setUniversity] = useState(null);
  const [course, setCourse] = useState(null);
  const [availableCourses, setAvailableCourses] = useState([]);

  const [editItem, setEditItem] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);

  const universities = useMemo(() => getUniversityNames(), []);

  useEffect(() => {
    if (university) {
      setAvailableCourses(getCoursesByUniversity(university));
    } else setAvailableCourses([]);
  }, [university]);

  const filtered = useMemo(() => {
    let list = items;
    if (query) list = list.filter((it) => it.name.toLowerCase().includes(query.toLowerCase()));
    if (university) list = list.filter((it) => it.university === university);
    if (course) list = list.filter((it) => it.subject === course);
    return list;
  }, [items, query, university, course]);

  const startCreate = () => {
    setEditItem({ id: Date.now(), name: "", price: "0", university: null, subject: null, description: "", images: [] });
    open();
  };
  const startEdit = (it) => { setEditItem({ ...it }); open(); };
  const saveItem = () => { if (!editItem) return; onUpsert(editItem); close(); };

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2 md:gap-3 items-start md:items-center">
        <TextInput className="w-full md:w-80" placeholder="Search items by name" leftSection={<Search size={16} />} value={query} onChange={(e) => setQuery(e.currentTarget.value)} radius="lg"/>
        <Select className="w-full md:w-64" placeholder="Filter by University" data={universities} value={university} onChange={setUniversity} radius="lg" searchable />
        <Select className="w-full md:w-64" placeholder="Filter by Course" data={availableCourses} value={course} onChange={setCourse} disabled={!university} radius="lg" searchable />
        <div className="flex-1" />
        <Button color="#0052cc" leftSection={<Plus size={16} />} onClick={startCreate}>New Item</Button>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Subject</Table.Th>
              <Table.Th>University</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Rating</Table.Th>
              <Table.Th>Purchases</Table.Th>
              <Table.Th className="text-right">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filtered.map((it) => (
              <Table.Tr key={it.id}>
                <Table.Td>{it.id}</Table.Td>
                <Table.Td className="max-w-[280px]">
                  <Tooltip label={it.name}><Text lineClamp={1}>{it.name}</Text></Tooltip>
                </Table.Td>
                <Table.Td><Badge color="blue">{it.subject}</Badge></Table.Td>
                <Table.Td>{it.university}</Table.Td>
                <Table.Td>₫{new Intl.NumberFormat('vi-VN').format(parseInt(it.price, 10) || 0)}</Table.Td>
                <Table.Td><div className="flex items-center gap-1"><Star size={16} className="text-yellow-500"/>{it.avgRating}</div></Table.Td>
                <Table.Td>{it.purchaseCount || 0}</Table.Td>
                <Table.Td>
                  <div className="flex justify-end gap-2">
                    <Tooltip label="Edit"><ActionIcon variant="subtle" color="blue" onClick={() => startEdit(it)}><Edit3 size={18}/></ActionIcon></Tooltip>
                    <Tooltip label="Delete"><ActionIcon variant="subtle" color="red" onClick={() => onDelete(it.id)}><Trash2 size={18}/></ActionIcon></Tooltip>
                  </div>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>

      <Modal opened={opened} onClose={close} title={editItem?.name ? "Edit Item" : "New Item"} radius="lg" size="lg">
        <div className="space-y-3">
          <TextInput label="Name" value={editItem?.name || ""} onChange={(e) => setEditItem((p) => ({ ...p, name: e.currentTarget.value }))} radius="md"/>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <NumberInput label="Price (₫)" value={parseInt(editItem?.price || 0, 10)} onChange={(v) => setEditItem((p) => ({ ...p, price: String(v || 0) }))} min={0} radius="md"/>
            <Select label="University" data={getUniversityNames()} value={editItem?.university || null} onChange={(v) => setEditItem((p) => ({ ...p, university: v, subject: null }))} searchable radius="md"/>
            <Select label="Course" data={getCoursesByUniversity(editItem?.university || null)} value={editItem?.subject || null} onChange={(v) => setEditItem((p) => ({ ...p, subject: v }))} disabled={!editItem?.university} searchable radius="md"/>
          </div>
          <Textarea label="Description" minRows={3} value={editItem?.description || ""} onChange={(e) => setEditItem((p) => ({ ...p, description: e.currentTarget.value }))} radius="md"/>
          <TextInput label="Image URL (cover)" value={(editItem?.images && editItem.images[0]) || ""} onChange={(e) => setEditItem((p) => ({ ...p, images: [e.currentTarget.value] }))} radius="md"/>
          <Group justify="end">
            <Button variant="light" onClick={close}>Cancel</Button>
            <Button color="#0052cc" onClick={saveItem}>Save</Button>
          </Group>
        </div>
      </Modal>
    </div>
  );
}