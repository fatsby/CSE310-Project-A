import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Container,
    Paper,
    Title,
    Text,
    TextInput,
    NumberInput,
    Button,
    Group,
    Grid,
    Alert,
    Select,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import {
    Check,
    Info,
    Landmark,
    User,
    Hash,
    CircleDollarSign,
} from 'lucide-react'
import { getToken, getUser, refreshUserProfile } from '../../utils/auth'

const mockBanks = [
    { value: 'Vietcombank', label: 'Vietcombank' },
    { value: 'Techcombank', label: 'Techcombank' },
    { value: 'ACB', label: 'ACB' },
    { value: 'BIDV', label: 'BIDV' },
    { value: 'VietinBank', label: 'VietinBank' },
    { value: 'MB Bank', label: 'MB Bank' },
    { value: 'Sacombank', label: 'Sacombank' },
]

export default function WithdrawPage() {
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const API_URL = import.meta.env.VITE_API_BASE_URL

    const form = useForm({
        initialValues: {
            amount: '',
            bankName: '',
            accountHolder: '',
            accountNumber: '',
        },
        validate: {
            amount: (value) =>
                value > 0
                    ? null
                    : 'Withdrawal amount must be greater than zero',
            bankName: (value) => (value ? null : 'Please select a bank'),
            accountHolder: (value) =>
                value.trim().length > 2
                    ? null
                    : 'Account holder name is required',
            accountNumber: (value) =>
                /^\d{8,16}$/.test(value)
                    ? null
                    : 'Enter a valid account number',
        },
    })

    const showSuccessModal = (amount) => {
        modals.open({
            centered: true,
            children: (
                <div className="text-center">
                    <Check size={50} className="text-green-500 mx-auto mb-4" />
                    <Text size="lg" fw={500} mb="xs">
                        Your request to withdraw{' '}
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        }).format(amount)}{' '}
                        has been received.
                    </Text>
                    <Text c="dimmed" size="sm" mb="lg">
                        The funds will be processed and transferred to your
                        bank account within 1-3 business days.
                    </Text>
                    <Button onClick={() => navigate('/')}>
                        Return to Home
                    </Button>
                </div>
            ),
        })
    }

    const handleSubmit = async (values) => {
        setError(null)
        setSubmitting(true)

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            
            const response = await fetch(`${API_URL}/api/balance/withdraw?amount=${values.amount}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to submit withdrawal request.');
            }
            

            // refresh user profile to get the latest balance
            const currentUser = getUser()
            if (currentUser) {
                await refreshUserProfile(currentUser.id)
            }
            showSuccessModal(values.amount)
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            <Container size="lg" className="pt-[120px] pb-10">
                <Title order={1} className="text-slate-800">
                    Withdraw Funds
                </Title>
                <Text c="dimmed" mb="xl">
                    Transfer funds from your wallet to your bank account.
                </Text>

                <Grid gutter="xl">
                    <Grid.Col span={{ base: 12, md: 7 }}>
                        <Paper withBorder shadow="md" p="xl" radius="lg">
                            <form onSubmit={form.onSubmit(handleSubmit)}>
                                <Title order={3} mb="lg">
                                    Withdrawal Details
                                </Title>
                                <div className="space-y-5">
                                    <NumberInput {...form.getInputProps('amount')} label="Amount to Withdraw" placeholder="Enter amount in VND" required thousandSeparator min={50000} step={10000} leftSection={<CircleDollarSign size={18} />} size="md" radius="md" />
                                    <Select {...form.getInputProps('bankName')} data={mockBanks} label="Bank" placeholder="Select your bank" required leftSection={<Landmark size={18} />} size="md" radius="md" searchable />
                                    <TextInput {...form.getInputProps('accountHolder')} label="Account Holder Name" placeholder="NGUYEN VAN A" required leftSection={<User size={18} />} size="md" radius="md" />
                                    <TextInput {...form.getInputProps('accountNumber')} label="Bank Account Number" placeholder="Your account number" required leftSection={<Hash size={18} />} size="md" radius="md" />
                                </div>
                                {error && <Alert title="Error" color="red" icon={<Info />} mt="lg">{error}</Alert>}
                                <Group justify="flex-end" mt="xl">
                                    <Button variant="default" onClick={() => navigate(-1)} size="md" radius="md">Cancel</Button>
                                    <Button type="submit" loading={submitting} size="md" radius="md">Request Withdrawal</Button>
                                </Group>
                            </form>
                        </Paper>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 5 }}>
                        <div className="w-full max-w-sm mx-auto">
                            <div className="relative w-full h-56 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl shadow-2xl p-6 flex flex-col justify-between text-white">
                                <div className="flex justify-between items-start">
                                    <span className="font-mono text-lg">{form.values.bankName || 'Your Bank'}</span>
                                    <Landmark size={24} className="opacity-70" />
                                </div>
                                <div className="text-2xl font-mono tracking-wider text-center">{form.values.accountNumber || '**** **** ****'}</div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs opacity-70">Account Holder</p>
                                        <p className="font-medium tracking-wider uppercase">{form.values.accountHolder || 'FULL NAME'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid.Col>
                </Grid>
            </Container>
        </div>
    )
}