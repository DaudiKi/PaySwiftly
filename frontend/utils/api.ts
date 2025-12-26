
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Network error' }));
        let errorMessage = error.detail || `Error ${response.status}`;

        // Handle Pydantic validation errors (array of objects)
        if (Array.isArray(errorMessage)) {
            errorMessage = errorMessage.map((e: any) => e.msg).join(', ');
        }

        throw new Error(errorMessage);
    }

    return response.json();
}

export const api = {
    registerDriver: (data: any) => fetchAPI<any>('/api/register_driver', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    initiatePayment: (driverId: number, data: any) => fetchAPI<any>(`/api/pay/${driverId}`, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    getDriver: (driverId: string) => fetchAPI<any>(`/api/driver/${driverId}`),
};
