// HistoryContent.jsx
"use client";

import moment from "moment";
import styles from "./component.module.css";
// Import the custom hook
import { useHistoryManagement } from "../utils/HistoryManagement"; 

export default function HistoryContent() {
    const { transactions, loading, isAdmin } = useHistoryManagement();

    return (
        <div className={styles.homeContainer}>
            {loading ? (
                <div>Loading transaction history...</div>
            ) : (
                <table className={`table table-bordered ${styles.tableCustom}`} style={{ emptyCells: "hide" }}>
                    <thead className={`sticky-top ${styles.thead}`}>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            {isAdmin && <th>Username</th>}
                            <th>Concert Title</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{moment(item.createDate).format("DD/MM/YYYY HH:mm:ss")}</td>
                                {isAdmin && <td>{item.userName}</td>}
                                <td>{item.concertTitle}</td>
                                <td>{item.action}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {transactions.length === 0 && !loading && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>No transactions found.</div>
            )}
        </div>
    );
}