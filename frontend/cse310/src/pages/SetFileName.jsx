import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    FileInput,
    TextInput,
    NumberInput,
    Textarea,
    Select,
    Button,
    Container,
    Paper,
    Title,
    Text,
    Group,
    ThemeIcon,
    SimpleGrid,
    Image,
    ActionIcon,
    Alert,
    Divider,
} from '@mantine/core'
import { Check, Clock, CloudUpload, Home, FileText, Book, Building, Tag, Image as ImageIcon, File, X } from 'lucide-react'
import { getToken } from '../../utils/auth'

export default function SetFileName() {
  const navigate = useNavigate();
  const location = useLocation();

  const documentFiles = location.state?.uploadedFiles || [];

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [universityId, setUniversityId] = useState(null);
  const [subjectId, setSubjectId] = useState(null);

  // Backend requires separate "Images" for previews
  const [previewImages, setPreviewImages] = useState([]);

  // Dropdown Data State
  const [universities, setUniversities] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch(`${API_URL}/api/University`);
        if (!response.ok) throw new Error('Failed to fetch universities');

        const data = await response.json();

        setUniversities(data.map(u => ({ value: u.id.toString(), label: u.name })));
      } catch (error) {
        console.error("Error loading universities:", error);
      }
    };
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (!universityId) {
      setSubjects([]);
      setSubjectId(null);
      return;
    }

    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${API_URL}/api/University/${universityId}/subject`);
        if (!response.ok) throw new Error('Failed to fetch subjects');

        const data = await response.json();
        setSubjects(data.map(s => ({ value: s.id.toString(), label: s.name })));
      } catch (error) {
        console.error("Error loading subjects:", error);
      }
    };
    fetchSubjects();
  }, [universityId]);

  const handleSubmit = async () => {
    if (!name || !description || !universityId || !subjectId) {
      alert("Please fill in all required fields.");
      return;
    }
    if (previewImages.length === 0) {
      alert("Please add at least one preview image.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();

    formData.append('Name', name);
    formData.append('Description', description);
    formData.append('Price', price);
    formData.append('UniversityId', universityId);
    formData.append('SubjectId', subjectId);

    documentFiles.forEach((file) => {
      formData.append('Files', file);
    });

    previewImages.forEach((image) => {
      formData.append('Images', image);
    });

    try {
      const token = getToken();

      const response = await fetch(`${API_URL}/api/documents/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors.Description || "Upload failed");
      }

      const result = await response.json();
      console.log('Success:', result);

      setUploadSuccess(true);

    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (documentFiles.length === 0) {
    return (
      <div className="p-10 mt-25 text-center">
        <p>No files selected.</p>
        <p>You are most likely weren't supposed to be here.</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    );
  }

  if (uploadSuccess) {
        return (
            <Container size="sm" className="pt-[120px] pb-10">
                <Paper p="xl" radius="lg" withBorder className="text-center shadow-lg">
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full mx-auto flex items-center justify-center mb-4">
                        <Check size={48} />
                    </div>

                    <Title order={2} className="mb-2">Submission Received!</Title>
                    
                    <Text c="dimmed" size="lg" className="mb-6">
                        Your document has been successfully uploaded.
                    </Text>

                    {/* Pending Info Card */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 mx-auto max-w-lg">
                        <div className="flex items-center justify-center gap-3 text-yellow-800">
                            <Clock size={24} />
                            <Text fw={600}>Waiting for Approval</Text>
                        </div>
                        <Text size="sm" className="text-yellow-700 mt-2">
                            Your content is currently being reviewed by an administrator. 
                            It will be visible to other students once approved.
                        </Text>
                    </div>

                    <Group justify="center" gap="md">
                        <Button 
                            variant="default" 
                            size="md"
                            leftSection={<Home size={16}/>}
                            onClick={() => navigate('/')}
                        >
                            Return to Home
                        </Button>
                        <Button 
                            size="md"
                            leftSection={<CloudUpload size={16}/>}
                            onClick={() => {
                                navigate('/');
                            }}
                        >
                            Back to Profile
                        </Button>
                    </Group>
                </Paper>
            </Container>
        );
    }

  return (
        <div className="bg-slate-50 min-h-screen">
            <Container size="md" className="pt-[120px] pb-10">
                <Paper withBorder shadow="lg" p="xl" radius="lg">
                    <Title order={2} className="text-slate-800 mb-1">
                        Finalize Your Upload
                    </Title>
                    <Text c="dimmed" mb="xl">
                        Provide the details for your document to make it available on the platform.
                    </Text>

                    <div className="space-y-6">
                        <TextInput
                            label="Document Title"
                            placeholder="e.g. Calculus II Final Exam 2024"
                            required
                            size="md"
                            radius="md"
                            leftSection={<FileText size={18} />}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <Textarea
                            label="Description"
                            placeholder="Describe the contents, topics covered, and any other relevant details..."
                            required
                            minRows={4}
                            autosize
                            size="md"
                            radius="md"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <SimpleGrid cols={2} spacing="md">
                            <Select
                                label="University"
                                placeholder="Select University"
                                data={universities}
                                value={universityId}
                                onChange={setUniversityId}
                                required
                                searchable
                                size="md"
                                radius="md"
                                leftSection={<Building size={18} />}
                            />
                            <Select
                                label="Subject"
                                placeholder="Select Subject"
                                data={subjects}
                                value={subjectId}
                                onChange={setSubjectId}
                                required
                                disabled={!universityId}
                                searchable
                                size="md"
                                radius="md"
                                leftSection={<Book size={18} />}
                            />
                        </SimpleGrid>

                        <NumberInput
                            label="Price (VND)"
                            description="Set to 0 for a free document."
                            defaultValue={0}
                            min={0}
                            step={10000}
                            thousandSeparator
                            size="md"
                            radius="md"
                            leftSection={<Tag size={18} />}
                            value={price}
                            onChange={setPrice}
                        />

                        <FileInput
                            label="Preview Images"
                            description="Upload 1-5 images (JPG/PNG) to serve as thumbnails."
                            placeholder={previewImages.length > 0 ? `${previewImages.length} images selected` : "Click to select images"}
                            multiple
                            clearable
                            accept="image/png,image/jpeg,image/webp"
                            value={previewImages}
                            onChange={(payload) => {
                                // handle clear
                                if (!payload || payload.length === 0) {
                                  setPreviewImages([]);
                                  return;
                                }
                    
                                // logic to append images instead of replacing
                                setPreviewImages((current) => {
                                  // create a set of existing file names to avoid duplicates
                                  const currentNames = new Set(current.map(f => f.name));
                                  const newFiles = payload.filter(f => !currentNames.has(f.name));
                                  return [...current, ...newFiles];
                                });
                              }}
                            required
                            size="md"
                            radius="md"
                            leftSection={<ImageIcon size={18} />}
                        />

                        {previewImages.length > 0 && (
                            <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm">
                                {previewImages.map((file, index) => (
                                    <Paper key={index} withBorder radius="md" className="overflow-hidden">
                                      <ActionIcon
                                            variant="filled"
                                            color="red"
                                            size="sm"
                                            radius="xl"
                                            className="absolute left-1 top-1 mb-2"
                                            onClick={() => setPreviewImages(current => current.filter((_, i) => i !== index))}
                                        >
                                            <X size={12} />
                                        </ActionIcon>
                                        <Image className="relative" src={URL.createObjectURL(file)} height={100} fit="cover" />
                                        
                                    </Paper>
                                ))}
                            </SimpleGrid>
                        )}

                        <Paper withBorder p="md" radius="md" bg="gray.0">
                            <Text size="sm" fw={500} mb="xs">Attached Document Files</Text>
                            <ul className="space-y-1 list-none p-0 m-0">
                                {documentFiles.map((f, index) => (
                                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                        <File size={14} />
                                        <span>{f.name}</span>
                                        <span className="text-gray-400">({(f.size / 1024).toFixed(1)} KB)</span>
                                    </li>
                                ))}
                            </ul>
                        </Paper>

                        <Divider my="xs" />

                        <Group justify="flex-end">
                            <Button variant="default" size="md" radius="md" onClick={() => navigate(-1)}>
                                Cancel
                            </Button>
                            <Button
                                size="md"
                                radius="md"
                                onClick={handleSubmit}
                                loading={isSubmitting}
                            >
                                Publish Document
                            </Button>
                        </Group>
                    </div>
                </Paper>
            </Container>
        </div>
  );
}