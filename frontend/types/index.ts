
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
    // Batch payout system fields
    pending_balance: number;  // Earnings waiting for payout
    paid_balance: number;     // Total already paid out
    last_payout_date: string | null;  // When last batch payout occurred
    payout_schedule: string;  // 'weekly', 'threshold', etc.
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

export interface TransactionStatusResponse {
    transaction_id: string;
    status: string;
    collection_status: string;
    payout_status: string;
    message?: string;
    amount_paid: number;
}
