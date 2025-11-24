import { useMemo, useState } from "react";
import { Badge, Loader, Pagination, Table, Alert } from "@mantine/core";

export default function TransactionsPanel({ loading, transactions }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const paginatedTransactions = useMemo(() => {
    if (!transactions) return [];
    const start = (page - 1) * pageSize;
    return transactions.slice(start, start + pageSize);
  }, [transactions, page]);

  const totalPages = transactions ? Math.ceil(transactions.length / pageSize) : 0;

  if (loading) return <Loader />;

  if (!transactions || transactions.length === 0) {
     return <Alert color="blue">No transactions found in the database.</Alert>;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Buyer</Table.Th>
              <Table.Th>Document</Table.Th>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedTransactions.map((t, index) => (
              <Table.Tr key={index}>
                {/* DTO doesn't have unique ID, using calculation for display */}
                <Table.Td>{((page - 1) * pageSize) + index + 1}</Table.Td>
                <Table.Td>
                  {new Date(t.purchasedAt).toLocaleDateString()} {new Date(t.purchasedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </Table.Td>
                <Table.Td>
                    <div className="flex flex-col">
                        <span className="font-medium">{t.userName}</span>
                        <span className="text-xs text-gray-400">{t.userId}</span>
                    </div>
                </Table.Td>
                <Table.Td>{t.documentName}</Table.Td>
                <Table.Td className="font-medium">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(t.pricePaid)}
                </Table.Td>
                <Table.Td>
                  <Badge color="green">Completed</Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-end">
          <Pagination total={totalPages} value={page} onChange={setPage} />
        </div>
      )}
    </div>
  );
}