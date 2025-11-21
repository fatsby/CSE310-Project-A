import { useMemo, useState } from "react";
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Loader,
  Modal,
  Table,
  Text,
  TextInput,
  Tooltip,
  Group,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Edit3, Trash2, Search } from "lucide-react";
import avtarImage from "../../assets/dog.jpg";

export default function UsersPanel({ loading, users, onUpdate, onDelete }) {
  const [query, setQuery] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);

  const filtered = useMemo(() => {
    if (!query) return users;
    const q = query.toLowerCase();
    return users.filter((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  }, [users, query]);

  const handleEdit = (u) => { setEditUser(u); open(); };
  const handleSave = () => {
    if (!editUser) return;
    onUpdate(editUser.id, { name: editUser.name, email: editUser.email, profilePicture: editUser.profilePicture });
    close();
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
        <TextInput className="w-full md:w-80" placeholder="Search users by name or email" leftSection={<Search size={16} />} value={query} onChange={(e) => setQuery(e.currentTarget.value)} radius="lg"/>
        <div className="flex gap-2">
          <Button variant="light" color="#0052cc">Export CSV</Button>
          <Button variant="filled" color="#0052cc">Invite User</Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Avatar</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th className="text-right">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filtered.map((u) => (
              <Table.Tr key={u.id}>
                <Table.Td>{u.id}</Table.Td>
                <Table.Td>{u.userName}</Table.Td>
                <Table.Td>{u.email || <em className="text-gray-500">(none)</em>}</Table.Td>
                <Table.Td>
                  {u.profilePicture ? (
                    <img src={u.profilePicture} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <img src={avtarImage} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
                  )}
                </Table.Td>
                <Table.Td>
                  {u.isAdmin ? (
                    <Badge color="orange" variant="light">Admin</Badge>
                  ) : (
                    <Badge color="green" variant="light">User</Badge>
                  ) }
                </Table.Td>
                <Table.Td>
                  {u.isActive ? (
                    <Badge color="green" variant="light">Active</Badge>
                  ) : (
                    <Badge color="red" variant="light">Banned</Badge>
                  ) }
                </Table.Td>
                <Table.Td>
                  <div className="flex justify-end gap-2">
                    <Tooltip label="Edit">
                      <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(u)}>
                        <Edit3 size={18} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Ban/Delete">
                      <ActionIcon variant="subtle" color="red" onClick={() => onDelete(u.id)}>
                        <Trash2 size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </div>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>

      <Modal opened={opened} onClose={close} title="Edit User" radius="lg">
        <div className="space-y-3">
          <TextInput label="Name" value={editUser?.name || ""} onChange={(e) => setEditUser((p) => ({ ...p, name: e.currentTarget.value }))} radius="md"/>
          <TextInput label="Email" value={editUser?.email || ""} onChange={(e) => setEditUser((p) => ({ ...p, email: e.currentTarget.value }))} radius="md"/>
          <TextInput label="Avatar URL" value={editUser?.profilePicture || ""} onChange={(e) => setEditUser((p) => ({ ...p, profilePicture: e.currentTarget.value }))} radius="md"/>
          <Group justify="end">
            <Button variant="light" onClick={close}>Cancel</Button>
            <Button color="#0052cc" onClick={handleSave}>Save</Button>
          </Group>
        </div>
      </Modal>
    </div>
  );
}