
export interface Driver {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    vehicle_type: string;
    vehicle_number: string;
    qr_code_url: string | null;
    balance: number;
    total_earnings: number;
}

export interface PaymentInitiateResponse {
    status: string;
    transaction_id: string;
    collection_id: string;
    message: string;
    amount: number;
    platform_fee: number;
    driver_amount: number;
}

export interface FeeInfo {
    fee_percentage: number;
    publishable_key: string;
    is_test_mode: boolean;
}
