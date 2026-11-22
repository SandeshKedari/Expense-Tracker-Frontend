import axios from 'axios';
import type { DashboardData } from '../types/dashboard';

const API_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getDashboardSummary = async (): Promise<DashboardData> => {
    const response = await axios.get<DashboardData>(
        `${API_URL}/dashboard/summary`,
        {
            withCredentials: true,
        },
    );

    return response.data;
};

