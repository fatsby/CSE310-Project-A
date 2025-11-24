import React, { useEffect, useState } from 'react';
import { 
    Table, 
    Badge, 
    Button, 
    Group, 
    Text, 
    Loader, 
    Paper, 
    Title, 
    Container,
    ScrollArea,
    Modal,
    Stack
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
    Eye, 
    AlertCircle, 
    Check, 
    Stamp 
} from 'lucide-react';
import { getToken } from '../../../utils/auth';
import { notifications } from '@mantine/notifications';

export default function DeletedDocsPanel() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    //modal state
    const [opened, { open, close }] = useDisclosure(false);
    const [docToRestore, setDocToRestore] = useState(null);
    const [isRestoring, setIsRestoring] = useState(false);

    // Fetch deleted documents on mount
    const fetchDeletedDocs = async () => {
        setLoading(true);
        try {
            const token = getToken();
            const res = await fetch(`${API_URL}/api/documents/deleted-documents`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error('Failed to fetch deleted documents');
            }

            const data = await res.json();
            setDocs(data);
        } catch (error) {
            console.error(error);
            notifications.show({
                title: 'Error',
                message: error.message,
                color: 'red',
                icon: <AlertCircle size={16} />
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeletedDocs();
    }, []);

    const openRestoreModal = (id, name) => {
        setDocToRestore({ id, name });
        open();
    };

     const confirmRestore = async () => {
        if (!docToRestore) return;
        
        setIsRestoring(true);
        try {
            const token = getToken();
            // Call DELETE endpoint with isDeleted=false to restore
            const res = await fetch(`${API_URL}/api/documents/${docToRestore.id}/delete?isDeleted=false`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Failed to restore document');

            notifications.show({
                title: 'Restored',
                message: `"${docToRestore.name}" has been restored successfully.`,
                color: 'green',
                icon: <Check size={16} />
            });

            // Close modal and refresh list
            close();
            fetchDeletedDocs();

        } catch (error) {
            notifications.show({
                title: 'Operation Failed',
                message: error.message,
                color: 'red',
                icon: <AlertCircle size={16} />
            });
        } finally {
            setIsRestoring(false);
        }
    };

    // Navigate to DataPage for verification
    const handleVerify = (id) => {
        window.open(`/data/${id}`); 
    };

    const rows = docs.map((doc) => (
        <Table.Tr key={doc.id}>
            <Table.Td>
                <Text fz="sm" fw={500}>{doc.id}</Text>
            </Table.Td>
            <Table.Td>
                <Group gap="sm">
                    <Text fz="sm" fw={500} lineClamp={1} title={doc.name}>
                        {doc.name}
                    </Text>
                </Group>
            </Table.Td>
            <Table.Td>
                <Text fz="sm" c="dimmed">{doc.authorName || 'Unknown'}</Text>
            </Table.Td>
            <Table.Td>
                <Badge variant="light" color="blue">
                    {doc.universityName}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Text fz="sm">{doc.subjectName}</Text>
            </Table.Td>
            <Table.Td>
                <Group gap={8}>
                    <Button 
                        variant="subtle" 
                        color="cyan" 
                        size="xs" 
                        leftSection={<Eye size={14} />}
                        onClick={() => handleVerify(doc.id)}
                    >
                        Verify Files
                    </Button>
                    <Button 
                        variant="light" 
                        color="green" 
                        size="xs" 
                        leftSection={<Stamp size={14} />}
                        onClick={() => openRestoreModal(doc.id, doc.name)}
                    >
                        Approve
                    </Button>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div>
                <Group justify="space-between" mb="md">
                    <div>
                        <Title order={3}>Deleted Documents Repository</Title>
                        <Text c="dimmed" size="sm">
                            Manage documents that have been soft-deleted. Restore them to make them visible to users again.
                        </Text>
                    </div>
                    <Button variant="outline" onClick={fetchDeletedDocs}>
                        Refresh List
                    </Button>
                </Group>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader size="lg" />
                    </div>
                ) : docs.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        <AlertCircle size={40} className="mx-auto mb-2 opacity-50" />
                        <Text>No deleted documents found.</Text>
                    </div>
                ) : (
                    <ScrollArea>
                        <Table striped highlightOnHover verticalSpacing="sm">
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>ID</Table.Th>
                                    <Table.Th>Document Name</Table.Th>
                                    <Table.Th>Author</Table.Th>
                                    <Table.Th>University</Table.Th>
                                    <Table.Th>Subject</Table.Th>
                                    <Table.Th>Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                    </ScrollArea>
                )}

                {/* Confirmation Modal */}
            <Modal 
                opened={opened} 
                onClose={close} 
                title="Confirm Approval"
                centered
            >
                <Stack>
                    <Text size="sm">
                        Are you sure you want to approve the document:
                    </Text>
                    <Text fw={700}>
                        {docToRestore?.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                        This action will make the document visible to all users.
                    </Text>

                    <Group justify="flex-end" mt="md">
                        <Button variant="default" onClick={close} disabled={isRestoring}>
                            Cancel
                        </Button>
                        <Button 
                            color="green" 
                            onClick={confirmRestore} 
                            loading={isRestoring}
                            leftSection={<Stamp size={16} />}
                        >
                            Confirm Approve
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </div>
    );
}