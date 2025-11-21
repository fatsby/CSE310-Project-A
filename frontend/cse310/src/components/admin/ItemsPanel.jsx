import { useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Badge,
  Loader,
  Select,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { Edit3, Trash2, Star, Search } from "lucide-react";

// Helper to get token for API calls
import { getToken } from "../../../utils/auth";

export default function ItemsPanel({ loading, items, onDelete }) {
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // --- Filter States ---
  const [query, setQuery] = useState("");
  const [selectedUniversityId, setSelectedUniversityId] = useState(null); // stores ID as string
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);       // stores ID as string

  // --- Data States for Selectors ---
  const [universityList, setUniversityList] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [isFetchingOptions, setIsFetchingOptions] = useState(false);



  // fetch Universities on Mount
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await fetch(`${API_URL}/api/university`);
        if (res.ok) {
          const data = await res.json();
          setUniversityList(data);
        }
      } catch (err) {
        console.error("Failed to fetch universities", err);
      }
    };
    fetchUniversities();
  }, []);

  // fetch Subjects when University Changes
  useEffect(() => {
    if (!selectedUniversityId) {
      setAvailableSubjects([]);
      return;
    }

    const fetchSubjects = async () => {
      setIsFetchingOptions(true);
      try {
        const token = getToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/api/university/${selectedUniversityId}/subject`, {
            method: 'GET',
            headers: headers
        });

        if (res.ok) {
          const data = await res.json();
          setAvailableSubjects(data);
        }
      } catch (err) {
        console.error("Failed to fetch subjects", err);
      } finally {
        setIsFetchingOptions(false);
      }
    };

    fetchSubjects();
  }, [selectedUniversityId]);

  // filter Logic
  const filtered = useMemo(() => {
    if (!items) return [];
    let list = items;

    // filter by Name
    if (query) {
        list = list.filter((it) => it.name.toLowerCase().includes(query.toLowerCase()));
    }

    // filter by University ID
    if (selectedUniversityId) {
        list = list.filter((it) => it.universityId.toString() === selectedUniversityId);
    }

    // filter by Subject ID
    if (selectedSubjectId) {
        list = list.filter((it) => it.subjectId.toString() === selectedSubjectId);
    }

    return list;
  }, [items, query, selectedUniversityId, selectedSubjectId]);

  // handlers
  const handleUniversityChange = (val) => {
    setSelectedUniversityId(val);
    setSelectedSubjectId(null); // reset subject when university changes
  };

  const universityOptions = universityList.map(u => ({ value: u.id.toString(), label: u.name }));
  const subjectOptions = availableSubjects.map(s => ({ value: s.id.toString(), label: s.name }));


  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-3 items-start md:items-center">
        <TextInput 
            className="w-full md:w-80" 
            placeholder="Search items by name" 
            leftSection={<Search size={16} />} 
            value={query} 
            onChange={(e) => setQuery(e.currentTarget.value)} 
            radius="lg"
        />
        
        <Select 
            className="w-full md:w-64" 
            placeholder="Filter by University" 
            data={universityOptions} 
            value={selectedUniversityId} 
            onChange={handleUniversityChange} 
            searchable
            radius="lg" 
        />
        
        <Select 
            className="w-full md:w-64" 
            placeholder={isFetchingOptions ? "Loading..." : "Filter by Subject"} 
            data={subjectOptions} 
            value={selectedSubjectId} 
            onChange={setSelectedSubjectId} 
            disabled={!selectedUniversityId} 
            searchable
            radius="lg" 
        />
        
        <div className="flex-1" />
        
      </div>

      {/* Table */}
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
                <Table.Td><Badge color="blue">{it.subjectName}</Badge></Table.Td>
                <Table.Td>{it.universityName}</Table.Td>
                <Table.Td>₫{new Intl.NumberFormat('vi-VN').format(it.price || 0)}</Table.Td>
                <Table.Td>
                    <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-500"/>{it.averageRating || it.avgRating || 0}
                    </div>
                </Table.Td>
                <Table.Td>{it.purchaseCount || 0}</Table.Td>
                <Table.Td>
                  <div className="flex justify-end gap-2">
                    <Tooltip label="Edit">
                        <ActionIcon variant="subtle" color="blue" onClick={() => startEdit(it)}><Edit3 size={18}/></ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete">
                        <ActionIcon variant="subtle" color="red" onClick={() => onDelete(it.id)}><Trash2 size={18}/></ActionIcon>
                    </Tooltip>
                  </div>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        
        {filtered.length === 0 && (
            <div className="p-8 text-center text-gray-500">
                No items found matching your filters.
            </div>
        )}
      </div>
    </div>
  );
}