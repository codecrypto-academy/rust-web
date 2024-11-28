export interface Customer {
    customer_id: string;
    company_name: string;
    contact_name?: string;
    contact_title?: string;
    address?: string;
    city?: string;
    region?: string;
    postal_code?: string;
    country?: string;
    phone?: string;
    fax?: string;
}

export interface QueryParams {
    page?: number;
    per_page?: number;
    name_filter?: string;
    order_by?: string;
    order_direction?: string;
} 