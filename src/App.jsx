import { useState, useEffect } from "react";
import "./App.css";
import { Button } from "@mui/material";
import { Auth } from "./components/Auth";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";

function App() {
  const [promptList, setPromptList] = useState([]);

  useEffect(() => {
    console.log("Effect running"); // Debug log

    const getPromptsList = async () => {
      try {
        console.log("Fetching prompts..."); // Debug log
        const promptsCollectionRef = collection(db, "prompts");
        const data = await getDocs(promptsCollectionRef);
        console.log("Raw data:", data); // Debug log

        if (!data.docs) {
          console.log("No docs found in data"); // Debug log
          return;
        }

        const filteredData = data.docs.map((doc) => {
          const docData = doc.data();
          console.log("Document data:", docData); // Debug log
          return {
            ...docData,
            id: doc.id,
          };
        });

        console.log("Setting promptList with:", filteredData); // Debug log
        setPromptList(filteredData);
      } catch (err) {
        console.error("Error in getPromptsList:", err);
      }
    };

    getPromptsList();

    // Optional cleanup function
    return () => {
      console.log("Effect cleanup"); // Debug log
    };
  }, []);

  console.log("Current promptList:", promptList); // Debug render log

  return (
    <>
      <Auth />
      <div>
        {promptList?.map((prompt) => (
          <div key={prompt?.id || "fallback-key"}>
            <h3>{prompt?.title}</h3>
            <p>{prompt?.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
