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
  PasswordInput
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Edit3, Gavel, Search, Unlock, AlertTriangle } from "lucide-react";
import avtarImage from "../../assets/dog.jpg";

export default function UsersPanel({ loading, users, onUpdate, onDelete, onCreate }) {
  const [query, setQuery] = useState("");

  //states for edit user modal
  const [editUser, setEditUser] = useState({ userName: "", password: "" });
  const [opened, { open, close }] = useDisclosure(false);

  //states for ban/unban user
  const [actionUser, setActionUser] = useState(null);
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);

  //states for creating user
  const [newUser, setNewUser] = useState({ userName: "", email: "", password: "" });
  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);

  const filtered = useMemo(() => {
    if (!query) return users;
    const q = query.toLowerCase();
    return users.filter((u) => u.userName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  }, [users, query]);

  //handlers for edit user modal
  const handleEdit = (u) => {
     setEditUser(u); 
     open(); 
  };
  const handleSave = () => {
    if (!editUser) return;
    onUpdate(editUser.id, { userName: editUser.userName, avatarUrl: editUser.avatarUrl });
    close();
  };

  //handlers for ban/unban user
  const handleActionClick = (u) => {
    setActionUser(u);
    openConfirm();
  };
  const executeAction = () => {
    if (actionUser) {
      onDelete(actionUser.email);
      closeConfirm();
      setActionUser(null);
    }
  };

  //handelers for create user modal
  const handleCreateClick = () => {
    setNewUser({ userName: "", email: "", password: "" });
    openCreate();
  };

  const handleCreateSubmit = () => {
    if (!newUser.userName || !newUser.email || !newUser.password) {
      return;
    }

    onCreate(newUser);
    closeCreate();
  };


  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
        <TextInput className="w-full md:w-80" placeholder="Search users by name or email" leftSection={<Search size={16} />} value={query} onChange={(e) => setQuery(e.currentTarget.value)} radius="lg" />
        <div className="flex gap-2">
          <Button variant="light" color="#0052cc">Export CSV</Button>
          <Button variant="filled" color="#0052cc" onClick={handleCreateClick}>Create User</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
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
                  {u.avatarUrl ? (
                    <img src={u.avatarUrl} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <img src={avtarImage} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
                  )}
                </Table.Td>
                <Table.Td>
                  {u.isAdmin ? (
                    <Badge color="orange" variant="light">Admin</Badge>
                  ) : (
                    <Badge color="green" variant="light">User</Badge>
                  )}
                </Table.Td>
                <Table.Td>
                  {u.isActive ? (
                    <Badge color="green" variant="light">Active</Badge>
                  ) : (
                    <Badge color="red" variant="light">Banned</Badge>
                  )}
                </Table.Td>
                <Table.Td>
                  <div className="flex justify-end gap-2">
                    <Tooltip label="Edit">
                      <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(u)}>
                        <Edit3 size={18} />
                      </ActionIcon>
                    </Tooltip>
                    {u.isActive ? (
                      <Tooltip label="Ban User">
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => handleActionClick(u)}
                        >
                          <Gavel size={18} />
                        </ActionIcon>
                      </Tooltip>
                    ) : (
                      <Tooltip label="Unban User">
                        <ActionIcon
                          variant="light"
                          color="green"
                          onClick={() => handleActionClick(u)}
                        >
                          <Unlock size={18} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </div>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>

      <Modal opened={opened} onClose={close} title="Edit User" radius="lg">
        <div className="space-y-3">
          <TextInput label="Name" value={editUser?.userName || ""} 
            onChange={(e) => {
              const val = e.currentTarget.value;
              setEditUser((p) => ({ ...p, userName: val }));
            }}
            radius="md" />
          <TextInput disabled label="Email" value={editUser?.email || ""} />
          <TextInput label="Avatar URL" value={editUser?.avatarUrl || ""} 
            onChange={(e) => {
              const val = e.currentTarget.value;
              setEditUser((p) => ({ ...p, avatarUrl: val }));
            }}
            radius="md" />
          <Group justify="end">
            <Button variant="light" onClick={close}>Cancel</Button>
            <Button color="#0052cc" onClick={handleSave}>Save</Button>
          </Group>
        </div>
      </Modal>

      <Modal
        opened={confirmOpened}
        onClose={closeConfirm}
        title={actionUser?.isActive ? "Confirm Ban" : "Confirm Unban"}
        centered
        radius="lg"
      >
        <div className="flex flex-col gap-4">
          {/* Warning Message */}
          <div className="flex items-start gap-3 bg-red-50 p-3 rounded-lg border border-red-100">
            <AlertTriangle className="text-red-500 mt-1" size={24} />
            <div>
              <Text fw={600} size="sm" c="red.8">
                {actionUser?.isActive ? "Warning: Banning User" : "Restoring User Access"}
              </Text>
              <Text size="sm" c="dimmed">
                {actionUser?.isActive
                  ? `Are you sure you want to ban ${actionUser?.userName}? They will immediately lose access to the platform.`
                  : `Are you sure you want to unban ${actionUser?.userName}? They will regain access immediately.`
                }
              </Text>
            </div>
          </div>

          {/* Action Buttons */}
          <Group justify="end" mt="md">
            <Button variant="light" color="gray" onClick={closeConfirm}>
              Cancel
            </Button>
            <Button
              color={actionUser?.isActive ? "red" : "green"}
              onClick={executeAction}
            >
              {actionUser?.isActive ? "Yes, Ban User" : "Yes, Unban User"}
            </Button>
          </Group>
        </div>
      </Modal>

      {/* Create User modal */}
      <Modal opened={createOpened} onClose={closeCreate} title="Create New User" radius="lg">
        <div className="space-y-3">
          <TextInput
            withAsterisk
            label="Username"
            placeholder="JohnDoe"
            value={newUser.userName}
            onChange={(e) => {
              const val = e.currentTarget.value;
              setNewUser((p) => ({ ...p, userName: val }));
            }}
            radius="md"
          />
          <TextInput
            withAsterisk
            label="Email"
            placeholder="john@example.com"
            value={newUser.email}
            onChange={(e) => {
              const val = e.currentTarget.value;
              setNewUser((p) => ({ ...p, email: val }));
            }}
            radius="md"
          />
          <PasswordInput
            withAsterisk
            label="Password"
            placeholder="Secret password"
            value={newUser.password}
            onChange={(e) => {
              const val = e.currentTarget.value;
              setNewUser((p) => ({ ...p, password: val }));
            }}
            radius="md"
          />
          <Group justify="end" mt="md">
            <Button variant="light" onClick={closeCreate}>Cancel</Button>
            <Button color="#0052cc" onClick={handleCreateSubmit}>Create</Button>
          </Group>
        </div>
      </Modal>
    </div>
  );
}