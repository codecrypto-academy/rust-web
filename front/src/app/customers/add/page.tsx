'use client';

import { createCustomer } from '@/lib/api';
import CustomerForm from '../_components/CustomerForm';

export default function AddCustomerPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Nuevo Cliente</h1>
            <CustomerForm onSubmit={createCustomer} />
        </div>
    );
} 