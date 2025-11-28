import React, { useState, useMemo } from 'react'
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
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useFocusWithin } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import {
    Check,
    Info,
    CreditCard,
    User,
    Calendar,
    Lock,
    Wallet,
    CircleDollarSign,
} from 'lucide-react'
import { getToken, getUser, refreshUserProfile } from '../../utils/auth'

export default function DepositPage() {
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const { ref: cvcRef, focused: cvcFocused } = useFocusWithin()
    const API_URL = import.meta.env.VITE_API_BASE_URL

    const form = useForm({
        initialValues: {
            amount: '',
            cardholderName: '',
            cardNumber: '',
            expiryDate: '',
            cvc: '',
        },
        validate: {
            amount: (value) =>
                value > 0 ? null : 'Deposit amount must be greater than zero',
            cardholderName: (value) =>
                value.trim().length > 2
                    ? null : 'Cardholder name is required',
            cardNumber: (value) =>
                /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(value)
                    ? null
                    : 'Enter a valid 16-digit card number',
            expiryDate: (value) =>
                /^(0[1-9]|1[0-2])\/\d{2}$/.test(value)
                    ? null
                    : 'Enter a valid expiry date (MM/YY)',
            cvc: (value) =>
                /^\d{3,4}$/.test(value) ? null : 'Enter a valid CVC',
        },
    })

    const handleCardNumberChange = (event) => {
        const { value } = event.currentTarget
        const formattedValue = value
            .replace(/\s/g, '')
            .replace(/(\d{4})/g, '$1 ')
            .trim()
        form.setFieldValue('cardNumber', formattedValue)
    }

    const handleExpiryDateChange = (event) => {
        let { value } = event.currentTarget
        value = value.replace(/\D/g, '')
        if (value.length > 2) {
            value = `${value.slice(0, 2)}/${value.slice(2, 4)}`
        }
        form.setFieldValue('expiryDate', value)
    }

    const showSuccessModal = (amount) => {
        modals.open({
            centered: true,
            children: (
                <div className="text-center">
                    <Check
                        size={50}
                        className="text-green-500 mx-auto mb-4"
                    />
                    <Text size="lg" fw={500} mb="xs">
                        You have successfully added{' '}
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        }).format(amount)}{' '}
                        to your account.
                    </Text>
                    <Text c="dimmed" size="sm" mb="lg">
                        Your balance has been updated.
                    </Text>
                    <Button onClick={() => navigate('/')}>
                        Back to Home
                    </Button>
                </div>
            ),
        })
    }

    const handleSubmit = async (values) => {
        setError(null)
        setSubmitting(true)

        try {
            const response = await fetch(`${API_URL}/api/balance/deposit?amount=${values.amount}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.message || 'Failed to make deposit.')
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

    const cardFlipped = useMemo(() => {
        return cvcFocused
    }, [cvcFocused])

    return (
        <div className="bg-slate-50 min-h-screen">
            <Container size="lg" className="pt-[120px] pb-10">
                <Title order={1} className="text-slate-800">
                    Add Funds to Your Account
                </Title>
                <Text c="dimmed" mb="xl">
                    Complete the secure form below to add money to your wallet.
                </Text>

                <Grid gutter="xl">
                    {/* Left Column: Form */}
                    <Grid.Col span={{ base: 12, md: 7 }}>
                        <Paper withBorder shadow="md" p="xl" radius="lg">
                            <form onSubmit={form.onSubmit(handleSubmit)}>
                                <Title order={3} mb="lg">
                                    Payment Details
                                </Title>
                                <div className="space-y-5">
                                    <NumberInput
                                        label="Amount to Deposit"
                                        placeholder="Enter amount in VND"
                                        required
                                        thousandSeparator
                                        min={10000}
                                        step={10000}
                                        leftSection={<CircleDollarSign size={18} />}
                                        size="md"
                                        radius="md"
                                        {...form.getInputProps('amount')}
                                    />
                                    <TextInput
                                        label="Cardholder Name"
                                        placeholder="NGUYEN VAN A"
                                        required
                                        leftSection={<User size={18} />}
                                        size="md"
                                        radius="md"
                                        {...form.getInputProps('cardholderName')}
                                    />
                                    <TextInput
                                        label="Card Number"
                                        placeholder="0000 0000 0000 0000"
                                        required
                                        leftSection={<CreditCard size={18} />}
                                        size="md"
                                        radius="md"
                                        maxLength={19}
                                        {...form.getInputProps('cardNumber')}
                                        onChange={handleCardNumberChange}
                                    />
                                    <Grid>
                                        <Grid.Col span={6}>
                                            <TextInput
                                                label="Expiry Date"
                                                placeholder="MM/YY"
                                                required
                                                leftSection={<Calendar size={18} />}
                                                size="md"
                                                radius="md"
                                                maxLength={5}
                                                {...form.getInputProps('expiryDate')}
                                                onChange={handleExpiryDateChange}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <TextInput
                                                ref={cvcRef}
                                                label="CVC"
                                                placeholder="123"
                                                required
                                                leftSection={<Lock size={18} />}
                                                size="md"
                                                radius="md"
                                                maxLength={4}
                                                {...form.getInputProps('cvc')}
                                            />
                                        </Grid.Col>
                                    </Grid>
                                </div>

                                {error && (
                                    <Alert title="Error" color="red" icon={<Info />} mt="lg">
                                        {error}
                                    </Alert>
                                )}

                                <Group justify="flex-end" mt="xl">
                                    <Button variant="default" onClick={() => navigate(-1)} size="md" radius="md">
                                        Cancel
                                    </Button>
                                    <Button type="submit" loading={submitting} size="md" radius="md">
                                        Deposit Now
                                    </Button>
                                </Group>
                            </form>
                        </Paper>
                    </Grid.Col>

                    {/* Right Column: Card Preview */}
                    <Grid.Col span={{ base: 12, md: 5 }}>
                        <div className="w-full max-w-sm mx-auto" style={{ perspective: '1000px' }}>
                            <div
                                className="relative w-full h-56 transition-transform duration-700"
                                style={{ transformStyle: 'preserve-3d', transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                            >
                                {/* Card Front */}
                                <div className="absolute w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-2xl p-6 flex flex-col justify-between text-white" style={{ backfaceVisibility: 'hidden' }}>
                                    <div className="flex justify-between items-start">
                                        <span className="font-mono text-lg">Gradelevate</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                                    </div>
                                    <div className="text-2xl font-mono tracking-widest">
                                        {form.values.cardNumber || '#### #### #### ####'}
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs opacity-70">Card Holder</p>
                                            <p className="font-medium tracking-wider uppercase">{form.values.cardholderName || 'FULL NAME'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs opacity-70">Expires</p>
                                            <p className="font-medium tracking-wider">{form.values.expiryDate || 'MM/YY'}</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Card Back */}
                                <div className="absolute w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-2xl p-4 flex flex-col justify-start text-white" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                    <div className="w-full h-12 bg-black mt-4"></div>
                                    <div className="text-right mt-4 pr-4">
                                        <p className="text-xs opacity-70 mb-1">CVC</p>
                                        <div className="h-8 w-full bg-white rounded flex items-center justify-end pr-2 text-black font-mono tracking-widest">
                                            {form.values.cvc}
                                        </div>
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