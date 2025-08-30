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

// Helper function to compress images before storage
const compressImage = (file, quality = 0.8, maxWidth = 1200) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to blob with compression
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create a new File object with the compressed blob
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Canvas to blob conversion failed'));
          }
        },
        file.type,
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = URL.createObjectURL(file);
  });
};

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

    // If there's an image file, compress and convert it to base64
    if (imageFile) {
      try {
        console.log("Processing image:", imageFile.name, "Size:", Math.round(imageFile.size / 1024), "KB");
        
        // Compress image before converting to base64
        const compressedFile = await compressImage(imageFile, 0.8, 1200); // 80% quality, max 1200px width
        console.log("Compressed image size:", Math.round(compressedFile.size / 1024), "KB");
        
        // Convert compressed image to base64 data URL
        imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(compressedFile);
        });
        console.log("Image compressed and converted to base64 successfully");
        
      } catch (error) {
        console.error("Image processing failed:", error);
        // Fallback to default image
        imageUrl = null;
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

    // If there's a new image file, compress and convert it to base64
    if (imageFile) {
      try {
        console.log("Processing image for update:", imageFile.name, "Size:", Math.round(imageFile.size / 1024), "KB");
        
        // Compress image before converting to base64
        const compressedFile = await compressImage(imageFile, 0.8, 1200);
        console.log("Compressed image size for update:", Math.round(compressedFile.size / 1024), "KB");
        
        // Convert compressed image to base64 data URL
        const imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(compressedFile);
        });
        updatedData.imageUrl = imageUrl;
        console.log("Image compressed and converted to base64 for update successfully");
        
      } catch (error) {
        console.error("Image processing failed during update:", error);
        // Don't update imageUrl - keep existing image
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
