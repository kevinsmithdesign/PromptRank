import { db, storage } from "../config/firebase";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Collection reference
const blogCollectionRef = collection(db, "blogPosts");

// Get all blog posts
export const getAllBlogPosts = async () => {
  try {
    const q = query(blogCollectionRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date:
        doc.data().createdAt?.toDate().toISOString() ||
        new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error getting blog posts:", error);
    throw new Error("Failed to fetch blog posts: " + error.message);
  }
};

// Get a single blog post by ID
export const getBlogPostById = async (id) => {
  try {
    const docRef = doc(db, "blogPosts", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        date:
          docSnap.data().createdAt?.toDate().toISOString() ||
          new Date().toISOString(),
      };
    }

    return null;
  } catch (error) {
    console.error(`Error getting blog post with ID ${id}:`, error);
    throw new Error(`Failed to fetch blog post: ${error.message}`);
  }
};

// Get blog posts by category
export const getBlogPostsByCategory = async (category) => {
  try {
    const q = query(
      blogCollectionRef,
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date:
        doc.data().createdAt?.toDate().toISOString() ||
        new Date().toISOString(),
    }));
  } catch (error) {
    console.error(`Error getting blog posts for category ${category}:`, error);
    throw new Error(
      `Failed to fetch blog posts for category: ${error.message}`
    );
  }
};

// Search blog posts
export const searchBlogPosts = async (searchQuery) => {
  try {
    // Firestore doesn't support full-text search natively
    // This is a simple implementation - for production, consider using Algolia or similar
    const querySnapshot = await getDocs(blogCollectionRef);

    const searchTermLower = searchQuery.toLowerCase();

    return querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date:
          doc.data().createdAt?.toDate().toISOString() ||
          new Date().toISOString(),
      }))
      .filter(
        (post) =>
          post.title.toLowerCase().includes(searchTermLower) ||
          post.excerpt?.toLowerCase().includes(searchTermLower) ||
          post.content?.toLowerCase().includes(searchTermLower)
      );
  } catch (error) {
    console.error(`Error searching blog posts for "${searchQuery}":`, error);
    throw new Error(`Failed to search blog posts: ${error.message}`);
  }
};

// Create a new blog post
export const createBlogPost = async (blogData, imageFile) => {
  try {
    let imageUrl = null;

    // If there's an image file, try to upload it to Firebase Storage
    // But don't fail the entire operation if image upload fails
    if (imageFile) {
      try {
        const storageRef = ref(
          storage,
          `blog-images/${Date.now()}-${imageFile.name}`
        );
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
        console.log("Image uploaded successfully:", imageUrl);
      } catch (imageError) {
        console.error(
          "Error uploading image, continuing without image:",
          imageError
        );
        // Don't rethrow - we'll continue with a default image
      }
    }

    // Create the blog post document
    const newPost = {
      ...blogData,
      imageUrl:
        imageUrl ||
        "https://images.unsplash.com/photo-1677442136019-21780ecad995", // Default image
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    console.log("Creating new blog post:", {
      ...newPost,
      content: newPost.content.substring(0, 100) + "...",
    });

    const docRef = await addDoc(blogCollectionRef, newPost);
    console.log("Blog post created with ID:", docRef.id);

    return {
      id: docRef.id,
      ...newPost,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw new Error(`Failed to create blog post: ${error.message}`);
  }
};

// Update a blog post
export const updateBlogPost = async (id, blogData, imageFile) => {
  try {
    const blogRef = doc(db, "blogPosts", id);

    let updatedData = {
      ...blogData,
      updatedAt: serverTimestamp(),
    };

    // If there's a new image file, try to upload it
    if (imageFile) {
      try {
        const storageRef = ref(
          storage,
          `blog-images/${Date.now()}-${imageFile.name}`
        );
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);
        updatedData.imageUrl = imageUrl;
      } catch (imageError) {
        console.error(
          "Error uploading image during update, continuing with existing image:",
          imageError
        );
        // Don't rethrow - we'll continue with the existing image
      }
    }

    await updateDoc(blogRef, updatedData);

    return {
      id,
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error updating blog post with ID ${id}:`, error);
    throw new Error(`Failed to update blog post: ${error.message}`);
  }
};

// Delete a blog post
export const deleteBlogPost = async (id) => {
  try {
    const blogRef = doc(db, "blogPosts", id);
    await deleteDoc(blogRef);
    return id;
  } catch (error) {
    console.error(`Error deleting blog post with ID ${id}:`, error);
    throw new Error(`Failed to delete blog post: ${error.message}`);
  }
};
