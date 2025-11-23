"use client";

import { useRouter } from "next/navigation";
import { Button } from "@chakra-ui/react"; 
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();

  const goToTest = () => {
    router.push("/Test");
  };

  return (
    <div className={styles.page}>
      <main className={styles.main} style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Button colorScheme="blue" size="lg" onClick={goToTest}>
          Go to 'Data Wow' Test Page
        </Button>
      </main>
    </div>
  );
}
