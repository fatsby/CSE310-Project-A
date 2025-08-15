import { useMemo, useState } from "react";
import { Badge, Loader, Pagination, Table } from "@mantine/core";

export default function TransactionsPanel({ loading }) {
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // TODO[API]: Replace with real transactions from backend
  const fake = useMemo(() => Array.from({ length: 17 }, (_, i) => ({
    id: i + 1,
    date: new Date(2025, 6, (i % 28) + 1).toISOString(),
    buyer: `User ${((i * 7) % 6) + 1}`,
    item: `Item ${(i % 10) + 1}`,
    amount: 50000 + (i % 5) * 30000,
    status: i % 3 === 0 ? "Refunded" : "Completed",
  })), []);

  const slice = fake.slice((page - 1) * pageSize, page * pageSize);

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Buyer</Table.Th>
              <Table.Th>Item</Table.Th>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {slice.map((t) => (
              <Table.Tr key={t.id}>
                <Table.Td>{t.id}</Table.Td>
                <Table.Td>{new Date(t.date).toLocaleDateString()}</Table.Td>
                <Table.Td>{t.buyer}</Table.Td>
                <Table.Td>{t.item}</Table.Td>
                <Table.Td>₫{new Intl.NumberFormat('vi-VN').format(t.amount)}</Table.Td>
                <Table.Td>
                  <Badge color={t.status === 'Completed' ? 'green' : 'orange'}>{t.status}</Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
      <div className="flex justify-end"><Pagination total={Math.ceil(fake.length / pageSize)} value={page} onChange={setPage} /></div>
    </div>
  );
}