export interface Product {
    id: number;
    name: string;
    comment: string;
    category: {
        id: number, 
        name: string,
    };
    fields: Array<{
        name: string;
        value: string;
        is_date: boolean;
    }>;
    expiration_type: 'expirable' | 'non_expirable';
    expiration_date?: Date;
    manufacture_date?: Date;
}
  