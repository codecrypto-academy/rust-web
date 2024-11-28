'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Customer } from '@/lib/types';
import { getCustomers, deleteCustomer } from '@/lib/api';
import Link from 'next/link';

export default function CustomersPage() {
    const searchParams = useSearchParams();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [nameFilter, setNameFilter] = useState(searchParams.get('name_filter') || '');
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [loading, setLoading] = useState(true);

    const loadCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getCustomers({
                page,
                per_page: 10,
                name_filter: nameFilter || undefined,
            });
            setCustomers(data);
        } finally {
            setLoading(false);
        }
    }, [page, nameFilter, setLoading, setCustomers]);

    useEffect(() => {
        loadCustomers();
    }, [page, nameFilter]);

  
    async function handleDelete(id: string) {
        if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            await deleteCustomer(id);
            loadCustomers();
        }
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Clientes</h1>
                <Link href="/customers/add">
                    <Button>Nuevo Cliente</Button>
                </Link>
            </div>

            <div className="mb-4">
                <Input
                    placeholder="Buscar por nombre..."
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>País</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.map((customer) => (
                        <TableRow key={customer.customer_id}>
                            <TableCell>{customer.customer_id}</TableCell>
                            <TableCell>{customer.company_name}</TableCell>
                            <TableCell>{customer.contact_name}</TableCell>
                            <TableCell>{customer.country}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Link href={`/customers/${customer.customer_id}`}>
                                        <Button variant="outline" size="sm">Ver</Button>
                                    </Link>
                                    <Link href={`/customers/${customer.customer_id}/edit`}>
                                        <Button variant="outline" size="sm">Editar</Button>
                                    </Link>
                                    <Button 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={() => handleDelete(customer.customer_id)}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex justify-between mt-4">
                <Button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Anterior
                </Button>
                <Button
                    onClick={() => setPage(p => p + 1)}
                    disabled={customers.length < 10}
                >
                    Siguiente
                </Button>
            </div>
        </div>
    );
} 