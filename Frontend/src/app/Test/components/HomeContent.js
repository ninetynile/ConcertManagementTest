// HomeContent.jsx
"use client";

import styles from "./component.module.css";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Heading,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Textarea,
} from "@chakra-ui/react";
// Import the custom hook
import { useConcertManagement } from "../utils/ConcertManagement"; 

export default function HomeContent() {
    // 1. Consume the custom hook
    const {
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
    } = useConcertManagement();

    // 2. Local State for Create Tab (UI-related state)
    const [newTitle, setNewTitle] = useState("");
    const [newTicket, setNewTicket] = useState("");
    const [newDescription, setNewDescription] = useState("");

    // 3. UI Handlers
    const handleTitleChange = (e) => setNewTitle(e.target.value);
    const handleTicketChange = (e) => setNewTicket(e.target.value);
    const handleDescriptionChange = (e) => setNewDescription(e.target.value);

    const handleCreate = () => {
        const concert = {
            title: newTitle,
            description: newDescription,
            ticket: Number(newTicket),
        };

        createNewConcert(concert);

        // Reset the form fields after successful submission attempt
        setNewTitle("");
        setNewDescription("");
        setNewTicket("");
    };

    return (
        <div className={styles.homeContainer}>
            {isAdmin ? (
                <div className={styles.headSection}>
                    {/* Total Seat Card */}
                    <Card
                        className={styles.headSectionItem}
                        backgroundColor="blue.500"
                        color="white"
                    >
                        <i className={`bi bi-person ${styles.cardIcon}`}></i>
                        <span className={styles.cardText}>Total of seat</span>
                        <span>{totalTicketCount}</span>
                    </Card>
                    {/* Reserve Card */}
                    <Card
                        className={styles.headSectionItem}
                        backgroundColor="gray.400"
                        color="white"
                    >
                        <i className={`bi bi-award ${styles.cardIcon}`}></i>
                        <span className={styles.cardText}>Reserve</span>
                        <span>{totalReservedCount}</span>
                    </Card>
                    {/* Cancel Card */}
                    <Card
                        className={styles.headSectionItem}
                        backgroundColor="orange.500"
                        color="white"
                    >
                        <i className={`bi bi-x-circle ${styles.cardIcon}`}></i>
                        <span className={styles.cardText}>Cancel</span>
                        <span>{cancelledCount}</span>
                    </Card>
                </div>
            ) : null}

            {loading ? (<div>Loading...</div>) : null}

            <div className={styles.bodySection}>
                <Tabs isFitted index={tabIndex} onChange={setTabIndex} className={styles.tabs}>
                    {isAdmin ? (
                        <TabList minHeight="50px" zIndex={999}>
                            <Tab>Overview</Tab>
                            <Tab>Create</Tab>
                        </TabList>
                    ) : null}

                    <TabPanels className={styles.tabPanels}>
                        {/* Overview */}
                        <TabPanel className={styles.cardsContainer} >
                            {cards.map((item, index) => (
                                <Card key={index} className={styles.card}>
                                    <CardHeader height="3rem">
                                        {item.isEditing ? (
                                            <Input
                                                value={item.title}
                                                onChange={(e) => updateEditedField(item.id, "title", e.target.value)}
                                                color="blue.400"
                                            />
                                        ) : (
                                            <Heading size="md" color="blue.400">
                                                {item.title}
                                            </Heading>
                                        )}
                                        {item.isEditing ? null : (<hr></hr>)}
                                    </CardHeader>
                                    <CardBody>
                                        {item.isEditing ? (
                                            <Textarea
                                                value={item.description}
                                                onChange={(e) => updateEditedField(item.id, "description", e.target.value)}
                                            />
                                        ) : (
                                            <span>{item.description}</span>
                                        )}
                                    </CardBody>
                                    <CardFooter className={styles.cardFooter}>
                                        <span className={styles.cardFooterText}>
                                            <i className="bi bi-person pr-2"></i>
                                            {item.isEditing ? (
                                                <Input
                                                    type="number"
                                                    value={item.ticket}
                                                    onChange={(e) => updateEditedField(item.id, "ticket", e.target.value)}
                                                />
                                            ) : (
                                                <span>{item.ticket}</span>
                                            )}
                                        </span>
                                        <div className={styles.cardFooterButtons}>
                                            {/* Admin Edit/Delete Buttons */}
                                            {isAdmin && !item.isEditing && (
                                                <Button colorScheme="green" onClick={() => startEdit(item.id)}>Edit</Button>
                                            )}
                                            {isAdmin && item.isEditing && (
                                                <>
                                                    <Button colorScheme="blue" onClick={() => saveEdit(item)}>Save</Button>
                                                    <Button colorScheme="gray" onClick={() => cancelEdit(item.id)}>Cancel</Button>
                                                </>
                                            )}
                                            {isAdmin && (
                                                <Button
                                                    colorScheme="red"
                                                    onClick={() => openDeleteDialog(item.id, item.title)}
                                                >
                                                    Delete
                                                </Button>
                                            )}

                                            {/* User Reserve/Cancel/Sold Out Buttons */}
                                            {!isAdmin && (
                                                reservedConcertIds.includes(item.id) ? (
                                                    <Button colorScheme="orange" onClick={() => cancelReserve(item.id)}>Cancel</Button>
                                                ) : item.reserveCount >= item.ticket ? (
                                                    <Button colorScheme="gray" isDisabled>Sold Out</Button>
                                                ) : (
                                                    <Button colorScheme="green" onClick={() => reserveConcert(item.id)}>Reserve</Button>
                                                )
                                            )}

                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </TabPanel>
                        {/* Create */}
                        {isAdmin && (
                            <TabPanel>
                                <Card className={styles.card}>
                                    <CardHeader className={styles.createCardHeader} color="blue.400">
                                        Create
                                        <hr></hr>
                                    </CardHeader>
                                    <CardBody paddingTop={2} className={styles.createCardBody}>
                                        <div className={styles.createCardBodyFirstRow}>
                                            <FormControl className={styles.createCardBodyFormControl}>
                                                <FormLabel fontSize={22} fontWeight={500}>Concert Name</FormLabel>
                                                <Input
                                                    type="text"
                                                    placeholder="Input concert name"
                                                    value={newTitle}
                                                    onChange={handleTitleChange}
                                                    required
                                                />
                                            </FormControl>
                                            <FormControl className={styles.createCardBodyFormControl}>
                                                <FormLabel fontSize={22} fontWeight={500}>Total of seat</FormLabel>
                                                <InputGroup>
                                                    <Input
                                                        type="number"
                                                        placeholder="Input total seat eg.500"
                                                        value={newTicket}
                                                        onChange={handleTicketChange}
                                                        required
                                                    />
                                                    <InputRightElement>
                                                        <i className="bi bi-person"></i>
                                                    </InputRightElement>
                                                </InputGroup>
                                            </FormControl>
                                        </div>
                                        <div>
                                            <FormControl className={styles.createCardBodyFormControl}>
                                                <FormLabel fontSize={22} fontWeight={500}>Description</FormLabel>
                                                <Textarea
                                                    placeholder="Input concert description"
                                                    value={newDescription}
                                                    onChange={handleDescriptionChange}
                                                    required
                                                />
                                            </FormControl>
                                        </div>
                                    </CardBody>
                                    <CardFooter justify="end" paddingTop={0}>
                                        <Button colorScheme="blue" paddingInline={8} onClick={handleCreate}>
                                            <i className="bi bi-floppy" style={{ paddingRight: "10px" }}></i>
                                            Save
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabPanel>
                        )}
                    </TabPanels>
                </Tabs>
            </div>

            {/* AlertDialog for Deletion (UI Component) */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsOpen(false)}
                isCentered={true}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader className={styles.dialogHeader}>
                            <i className="bi bi-x-circle-fill" style={{ color: "red" }}></i>
                        </AlertDialogHeader>
                        <AlertDialogBody className={styles.dialogBody}>
                            <span>Are you confirm to delete?</span>
                            <br />
                            <span>"{deleteTitle}"</span>
                        </AlertDialogBody>
                        <AlertDialogFooter width="100%">
                            <Button
                                ref={cancelRef}
                                onClick={() => setIsOpen(false)}
                                width="50%"
                            >
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={() => {
                                    deleteConcert(deleteId);
                                }}
                                ml={3}
                                width="50%"
                            >
                                Yes, Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </div>
    );
}