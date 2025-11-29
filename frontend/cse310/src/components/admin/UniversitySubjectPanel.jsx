import { useEffect, useState } from "react";
import {
  ActionIcon,
  Button,
  Grid,
  Group,
  Loader,
  Modal,
  Paper,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
  Badge
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Building, Edit, Plus, Book, Search } from "lucide-react";
import { getToken } from "../../../utils/auth";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function UniversitySubjectPanel() {
  const [universities, setUniversities] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [editUniModal, { open: openEditUni, close: closeEditUni }] = useDisclosure(false);
  const [createUniModal, { open: openCreateUni, close: closeCreateUni }] = useDisclosure(false);
  const [editSubModal, { open: openEditSub, close: closeEditSub }] = useDisclosure(false);
  const [createSubModal, { open: openCreateSub, close: closeCreateSub }] = useDisclosure(false);

  const uniForm = useForm({ initialValues: { id: null, name: "", suffix: "" } });
  const subForm = useForm({ initialValues: { id: null, name: "", code: "" } });

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/University`);
      if (!res.ok) throw new Error("Failed to fetch universities");
      const data = await res.json();
      setUniversities(data);
    } catch (error) {
      notifications.show({ color: "red", title: "Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async (uniId) => {
    try {
      const res = await fetch(`${API_URL}/api/University/${uniId}/subject`);
      if (!res.ok) throw new Error("Failed to fetch subjects");
      const data = await res.json();
      setSubjects(data);
    } catch (error) {
      notifications.show({ color: "red", title: "Error", message: error.message });
      setSubjects([]);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (selectedUniversity) {
      fetchSubjects(selectedUniversity.id);
    } else {
      setSubjects([]);
    }
  }, [selectedUniversity]);

  const handleApiCall = async (url, method, body, successMessage) => {
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      notifications.show({ color: "green", title: "Success", message: successMessage });
      fetchUniversities(); // Refresh data
      if (selectedUniversity) fetchSubjects(selectedUniversity.id);
      return true;
    } catch (error) {
      notifications.show({ color: "red", title: "Error", message: error.message });
      return false;
    }
  };

  const filteredUniversities = universities.filter((uni) =>
    uni.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Modal Handlers
  const handleCreateUniversity = async (values) => {
    if (await handleApiCall(`${API_URL}/api/University/create`, "POST", values, "University created")) {
      closeCreateUni();
    }
  };

  const handleEditUniversity = async (values) => {
    if (await handleApiCall(`${API_URL}/api/University/${values.id}`, "PUT", values, "University updated")) {
      closeEditUni();
    }
  };

  const handleCreateSubject = async (values) => {
    const payload = { ...values, universityId: selectedUniversity.id };
    if (await handleApiCall(`${API_URL}/api/Subject/create`, "POST", payload, "Subject created")) {
      closeCreateSub();
    }
  };

  const handleEditSubject = async (values) => {
    if (await handleApiCall(`${API_URL}/api/Subject/${values.id}`, "PUT", values, "Subject updated")) {
      closeEditSub();
    }
  };

  const renderModal = (opened, close, handleSubmit, form, title, fields) => (
    <Modal opened={opened} onClose={close} title={title} centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="space-y-4">
          {fields.map((field) => (
            <TextInput key={field.name} label={field.label} required {...form.getInputProps(field.name)} />
          ))}
          <Group justify="end" mt="md">
            <Button variant="default" onClick={close}>Cancel</Button>
            <Button type="submit">Save</Button>
          </Group>
        </div>
      </form>
    </Modal>
  );

  return (
    <div>
      {renderModal(createUniModal, closeCreateUni, handleCreateUniversity, uniForm, "Create University", [
        { name: "name", label: "University Name" },
        { name: "suffix", label: "Suffix (e.g., HCMIU)" },
      ])}
      {renderModal(editUniModal, closeEditUni, handleEditUniversity, uniForm, "Edit University", [
        { name: "name", label: "University Name" },
        { name: "suffix", label: "Suffix" },
      ])}
      {renderModal(createSubModal, closeCreateSub, handleCreateSubject, subForm, `Create Subject for ${selectedUniversity?.name}`, [
        { name: "name", label: "Subject Name" },
        { name: "code", label: "Subject Code" },
      ])}
      {renderModal(editSubModal, closeEditSub, handleEditSubject, subForm, "Edit Subject", [
        { name: "name", label: "Subject Name" },
        { name: "code", label: "Subject Code" },
      ])}

      <Grid>
        {/* Universities Column */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="md" className="h-full">
            <Group justify="space-between" mb="md">
              <Title order={4}>Universities</Title>
              <Button leftSection={<Plus size={16} />} size="xs" onClick={() => { uniForm.reset(); openCreateUni(); }}>
                Create
              </Button>
            </Group>
            <TextInput
              placeholder="Search universities..."
              leftSection={<Search size={14} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              mb="md"
            />
            {loading ? <Loader /> : (
              <ScrollArea style={{ height: 500 }}>
                {filteredUniversities.map((uni) => (
                  <UnstyledButton
                    key={uni.id}
                    onClick={() => setSelectedUniversity(uni)}
                    className={`w-full p-2 rounded-md hover:bg-gray-100 ${selectedUniversity?.id === uni.id ? 'bg-blue-50 text-blue-700 font-bold' : ''}`}
                  >
                    <Group justify="space-between">
                      <div className="flex items-center gap-2">
                        <Building size={18} />
                        <Text size="sm">{uni.name}</Text>
                      </div>
                      <Tooltip label="Edit University">
                        <ActionIcon
                          variant="subtle"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            uniForm.setValues(uni);
                            openEditUni();
                          }}
                        >
                          <Edit size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </UnstyledButton>
                ))}
              </ScrollArea>
            )}
          </Paper>
        </Grid.Col>

        {/* Subjects Column */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper withBorder p="md" className="h-full">
            {selectedUniversity ? (
              <>
                <Group justify="space-between" mb="md">
                  <Title order={4}>Subjects for {selectedUniversity.name}</Title>
                  <Button leftSection={<Plus size={16} />} size="xs" onClick={() => { subForm.reset(); openCreateSub(); }}>
                    Create Subject
                  </Button>
                </Group>
                <ScrollArea style={{ height: 500 }}>
                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Code</Table.Th>
                        <Table.Th>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {subjects.map((sub) => (
                        <Table.Tr key={sub.id}>
                          <Table.Td>{sub.id}</Table.Td>
                          <Table.Td>{sub.name}</Table.Td>
                          <Table.Td>
                            <Badge variant="light">{sub.code}</Badge>
                          </Table.Td>
                          <Table.Td>
                            <Tooltip label="Edit Subject">
                              <ActionIcon
                                variant="subtle"
                                onClick={() => {
                                  subForm.setValues(sub);
                                  openEditSub();
                                }}
                              >
                                <Edit size={16} />
                              </ActionIcon>
                            </Tooltip>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                  {subjects.length === 0 && <Text c="dimmed" ta="center" mt="xl">No subjects found for this university.</Text>}
                </ScrollArea>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Book size={48} className="mb-4" />
                <Text>Select a university to see its subjects.</Text>
              </div>
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </div>
  );
}