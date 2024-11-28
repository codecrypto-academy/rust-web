'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Customer } from '@/lib/types';

interface CustomerFormProps {
    initialData?: Customer;
    onSubmit: (data: Customer) => Promise<void>;
}

export default function CustomerForm({ initialData, onSubmit }: CustomerFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<Customer>(initialData || {
        customer_id: '',
        company_name: '',
        contact_name: '',
        contact_title: '',
        address: '',
        city: '',
        region: '',
        postal_code: '',
        country: '',
        phone: '',
        fax: '',
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await onSubmit(formData);
        router.push('/customers');
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
            <div>
                <Label htmlFor="customer_id">ID Cliente</Label>
                <Input
                    id="customer_id"
                    value={formData.customer_id}
                    onChange={(e) => setFormData({...formData, customer_id: e.target.value})}
                    required
                    disabled={!!initialData}
                />
            </div>

            <div>
                <Label htmlFor="company_name">Nombre Empresa</Label>
                <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                    required
                />
            </div>

            <div>
                <Label htmlFor="contact_name">Nombre Contacto</Label>
                <Input
                    id="contact_name"
                    value={formData.contact_name || ''}
                    onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
                />
            </div>

            {/* Añadir campos similares para el resto de propiedades */}

            <div className="flex gap-4">
                <Button type="submit">
                    {initialData ? 'Actualizar' : 'Crear'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancelar
                </Button>
            </div>
        </form>
    );
} 