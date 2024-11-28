'use client';

import { useEffect, useState } from 'react';
import { getCustomer, updateCustomer } from '@/lib/api';
import CustomerForm from '../../_components/CustomerForm';
import { Customer } from '@/lib/types';

export default function EditCustomerPage({ params }: { params: { id: string } }) {
    const [customer, setCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        getCustomer(params.id).then(setCustomer);
    }, [params.id]);

    if (!customer) return <div>Cargando...</div>;

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Editar Cliente</h1>
            <CustomerForm 
                initialData={customer} 
                onSubmit={(data) => updateCustomer(params.id, data)} 
            />
        </div>
    );
} 