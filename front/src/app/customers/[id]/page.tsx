'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCustomer, deleteCustomer } from '@/lib/api';
import { Customer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [customer, setCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        getCustomer(params.id).then(setCustomer);
    }, [params.id]);

    if (!customer) return <div>Cargando...</div>;

    async function handleDelete() {
        if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            await deleteCustomer(params.id);
            router.push('/customers');
        }
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Detalles del Cliente</h1>
                <div className="flex gap-2">
                    <Link href={`/customers/${params.id}/edit`}>
                        <Button>Editar</Button>
                    </Link>
                    <Button variant="destructive" onClick={handleDelete}>
                        Eliminar
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold">ID Cliente</h3>
                    <p>{customer.customer_id}</p>
                </div>
                <div>
                    <h3 className="font-semibold">Empresa</h3>
                    <p>{customer.company_name}</p>
                </div>
                {/* Añadir el resto de campos */}
            </div>
        </div>
    );
} 