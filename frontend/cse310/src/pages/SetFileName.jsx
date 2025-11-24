import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileInput, TextInput, NumberInput, Textarea, Select, Button, Container, Paper, Title, Text, Group, ThemeIcon } from '@mantine/core';
import { Check, Clock, ArrowLeft, Home } from 'lucide-react'; // Import icons
import { getToken } from '../../utils/auth';

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
            <Container size="sm" className="mt-25">
                <Paper p="xl" radius="md" withBorder className="text-center shadow-sm">
                    {/* Success Icon */}
                    <ThemeIcon color="green" size={60} radius="xl" className="mb-4">
                        <Check size={32} />
                    </ThemeIcon>

                    <Title order={2} className="mb-2">Submission Received!</Title>
                    
                    <Text c="dimmed" size="lg" className="mb-6">
                        Your document has been successfully uploaded.
                    </Text>

                    {/* Pending Info Card */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 mx-auto max-w-md">
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
                            leftSection={<Home size={16}/>}
                            onClick={() => navigate('/')}
                        >
                            Return to Home
                        </Button>
                        <Button 
                            color="blue"
                            leftSection={<ArrowLeft size={16}/>}
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
    <div className="max-w-2xl mx-auto mt-25 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Finalize Upload</h1>

      <div className="space-y-4">
        <TextInput
          label="Document Title"
          placeholder="e.g. Calculus II Final Exam 2024"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Textarea
          label="Description"
          placeholder="Describe the contents..."
          required
          minRows={3}
          autosize
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="University"
            placeholder="Select University"
            data={universities}
            value={universityId}
            onChange={setUniversityId}
            required
            searchable
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
          />
        </div>

        <NumberInput
          label="Price (VND)"
          description="Set 0 for free"
          defaultValue={0}
          min={0}
          step={1000}
          value={price}
          onChange={setPrice}
        />

        {/* Specific Input for Preview Images required by Backend */}
        <FileInput
          label="Preview Images (Required)"
          description="Upload 1-5 images (JPG/PNG). Click again to add more."
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
              // create a map of existing file names to avoid duplicates
              const currentNames = new Set(current.map(f => f.name));
              const newFiles = payload.filter(f => !currentNames.has(f.name));
              return [...current, ...newFiles];
            });
          }}
          required={previewImages.length === 0}
        />
        {/* Add a mini list to show selected files so user can see what is staged */}
        {previewImages.length > 0 && (
          <div className="mt-2 text-sm text-gray-500">
            <strong>Selected:</strong> {previewImages.map(f => f.name).join(', ')}
          </div>
        )}

        <div className="mt-4 bg-gray-50 p-4 rounded">
          <p className="text-sm font-semibold text-gray-600 mb-2">Attached Files:</p>
          <ul className="list-disc pl-5 text-sm text-gray-500">
            {documentFiles.map((f, index) => (
              <li key={index}>{f.name} ({f.size} bytes)</li>
            ))}
          </ul>
        </div>

        <Button
          fullWidth
          size="md"
          onClick={handleSubmit}
          loading={isSubmitting}
          className="mt-6 bg-[#4e93fc] hover:bg-[#3776e8]"
        >
          Publish Document
        </Button>
      </div>
    </div>
  );
}