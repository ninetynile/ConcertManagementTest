import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import useUserStore from "@/app/stores/userStore";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useUserManagement() {
    const user = useUserStore((state) => state.user);
	const setUser = useUserStore((state) => state.setUser);
	const toast = useToast()

	useEffect(() => {
		setAdmin();
	}, []);

	const setAdmin = async () => {
		await axios
			.get("http://localhost:55561/user/reserves/admin@mail.com")
			.then((res) => {
				setUser(res.data);
			})
			.catch((err) => {
				console.error("Error fetching user:", err);
			});
	}

	const fetchUser = async (email) => {
		await axios
			.get(`http://localhost:55561/user/reserves/${email}`)
			.then((res) => {
				setUser(res.data);
			})
			.catch((err) => {
				console.error("Error fetching user:", err);
			});
	};

	const handleSwitchUser = async () => {
		try {
			if (!user) {
				await fetchUser("admin@mail.com");
				router.push("/user");
				return;
			}

			const isAdmin = user.email === "admin@mail.com";

			if (isAdmin) {
				await fetchUser("testuser@mail.com");
                toast({
					position: 'top-right',
					title: 'Role Switched.',
					description: "You are now a user.",
					status: 'info',
					duration: 3000,
					isClosable: true,
				})
			} else {
				await fetchUser("admin@mail.com");
                toast({
					position: 'top-right',
					title: 'Role Switched.',
					description: "You are now a admin.",
					status: 'info',
					duration: 3000,
					isClosable: true,
				})
			}

		} catch (err) {
			console.error("Failed to switch user:", err);
		}
	};

    return {
        handleSwitchUser
    }
}