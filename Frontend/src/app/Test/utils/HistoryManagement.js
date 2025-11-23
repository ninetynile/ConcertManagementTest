// useHistoryManagement.js
import { useState, useEffect } from "react";
import axios from "axios";
import useUserStore from "@/app/stores/userStore";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useHistoryManagement() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = useUserStore((state) => state.user);
    const isAdmin = user && user.email === "admin@mail.com";

    const getAllTransaction = async () => {
        if (!user || !user._id) {
            return;
        }

        setLoading(true);
        try {
            let url = `${API_BASE_URL}/reserve/trn`;
            if (!isAdmin) {
                // Fetch transactions only for the current user
                url = `${API_BASE_URL}/reserve/trn/user/${user._id}`;
            }

            const res = await axios.get(url);
            let data = res.data;

            const converted = data.map((c) => ({
                id: c._id,
                userId: c.userId,
                userName: c.userName,
                concertId: c.concertId,
                concertTitle: c.concertTitle,
                action: c.action,
                createDate: c.createDate,
            }));

            setTransactions(converted);
        } catch (err) {
            console.error("Error fetching transaction:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            getAllTransaction();
        }
    }, [user]);

    return {
        transactions,
        loading,
        isAdmin,
    };
}