import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import useUserStore from "@/app/stores/userStore";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useConcertManagement() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cancelledCount, setCancelledCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false); // Confirm Delete Dialog
    const [deleteId, setDeleteId] = useState(null); // Set Delete Card Id
    const [deleteTitle, setDeleteTitle] = useState(null); // Set Delete Card Title (Display in Confirm Delete Dialog)
    const [tabIndex, setTabIndex] = useState(0);  
    const cancelRef = useRef();
    const toast = useToast();

    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const isAdmin = user && user.email === "admin@mail.com";
    const reservedConcertIds = user?.reserves?.map(r => r.concertId) || [];

    // --- Data Fetching and Initialization ---

    const getCancelledConcert = () => {
        setLoading(true);
        axios
            .get(`${API_BASE_URL}/reserve/trn`)
            .then((res) => {
                const count = res.data.filter((c) => c.action === "cancelled").length;
                setCancelledCount(count); 
            })
            .catch((err) => {
                console.error("Error fetching cancelled concerts:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }  

    const getAllConcert = () => {
        setLoading(true);
        axios
            .get(`${API_BASE_URL}/concert/with-reserves`)
            .then((res) => {
                const converted = res.data.map((c) => ({
                    id: c._id,
                    title: c.title,
                    description: c.description,
                    ticket: c.ticket,
                    reserveData: c.reserveData,
                    reserveCount: c.reserveData.length,
                    isEditing: false,
                }));
                setCards(converted);
            })
            .catch((err) => {
                console.error("Error fetching concerts:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        getAllConcert();
        if (isAdmin) {
            getCancelledConcert();
        } else (
            setTabIndex(0)
        )
    }, [isAdmin]);

    // --- Computed Values (Total Reserved & Total Ticket) ---

    const totalReservedCount = cards.reduce((acc, card) => acc + card.reserveCount, 0);
    const totalTicketCount = cards.reduce((acc, card) => acc + Number(card.ticket), 0);
    
    // --- Admin Actions (Create/Delete/Edit) ---

    const createNewConcert = (concert) => {
        axios
            .post(`${API_BASE_URL}/concert`, concert)
            .then((res) => {
                getAllConcert();
                toast({
                    position: 'top-right',
                    title: 'Concert Created.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            })
            .catch((err) => {
                // Simplified error handling for brevity, keep detailed logic in actual app
                const messages = err?.response?.data?.message;
                const description = Array.isArray(messages) ? messages.join(', ') : messages || "Unexpected error occurred.";
                toast({
                    position: "top-right",
                    title: "Cannot Create Concert.",
                    description: description,
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                });
            });
    }

    const deleteConcert = (id) => {
        axios
            .delete(`${API_BASE_URL}/concert/${id}`)
            .then(() => {
                getAllConcert();
                setIsOpen(false); // Close dialog
                toast({
                    position: 'top-right',
                    title: 'Concert Deleted.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            })
            .catch((err) => {
                console.error("Error deleting concert:", err);
                setIsOpen(false); // Close dialog
                toast({
                    position: 'top-right',
                    title: 'Delete Failed.',
                    description: 'Could not delete concert.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            });
    }

    const saveEdit = (item) => {
        const findconcert = cards.find(c => c.id === item.id);
        if (!findconcert) return;

        if (findconcert.reserveCount > Number(item.ticket)) {
            toast({
                position: 'top-right',
                title: 'Cannot update concert',
                description: 'Cannot set new ticket count less than existing reserves.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        axios
            .patch(`${API_BASE_URL}/concert/${item.id}`, {
                title: item.title,
                description: item.description,
                ticket: Number(item.ticket),
            })
            .then(() => {
                toast({
                    position: 'top-right',
                    title: 'Concert Updated.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                getAllConcert();
            })
            .catch((err) => console.error("Error updating concert:", err));
    };

    // --- User Actions (Reserve/Cancel) ---

    const reserveConcert = (concertId) => {
        axios
            .post(`${API_BASE_URL}/reserve`, { userId: user._id, concertId })
            .then(res => {
                const updatedUser = { ...user, reserves: [...user.reserves, res.data] };
                setUser(updatedUser);
                toast({
                    position: 'top-right',
                    title: 'Concert Reserved.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            })
            .catch(err => console.error("Error reserving concert:", err));
    };

    const cancelReserve = (concertId) => {
        axios
            .delete(`${API_BASE_URL}/reserve/`, { data: { userId: user._id, concertId } })
            .then(() => {
                // Update user state to reflect cancellation
                const updatedReserves = user.reserves.filter(r => r.concertId !== concertId);
                const updatedUser = { ...user, reserves: updatedReserves };
                setUser(updatedUser);
                toast({
                    position: 'top-right',
                    title: 'Concert Cancelled.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            })
            .catch(err => console.error("Error canceling reservation:", err));
    };

    // --- UI State Management (Dialog, Editing) ---

    const openDeleteDialog = (id, title) => {
        setDeleteId(id);
        setDeleteTitle(title);
        setIsOpen(true);
    };
    
    const startEdit = (id) => {
        setCards(cards.map(c =>
            c.id === id ? { ...c, isEditing: true } : { ...c, isEditing: false } // Ensures only one is in edit mode
        ));
    };

    const cancelEdit = (id) => {
        setCards(cards.map(c =>
            c.id === id ? { ...c, isEditing: false } : c
        ));
    };

    const updateEditedField = (id, field, value) => {
        setCards(cards.map(c =>
            c.id === id ? { ...c, [field]: value } : c
        ));
    };

    return {
        cards,
        loading,
        cancelledCount,
        totalReservedCount,
        totalTicketCount,
        isAdmin,
        reservedConcertIds,
        tabIndex,
        setTabIndex,
        // Methods
        createNewConcert,
        deleteConcert,
        reserveConcert,
        cancelReserve,
        openDeleteDialog,
        startEdit,
        cancelEdit,
        updateEditedField,
        saveEdit,
        // Dialog State
        isOpen,
        setIsOpen,
        deleteId,
        deleteTitle,
        cancelRef,
        getAllConcert // Export for external re-fetch if needed
    };
}