import axios from "axios";

// Replace with your own Cloudinary credentials
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dou9raosf/image/upload";  // Replace 'your-cloud-name'
const CLOUDINARY_UPLOAD_PRESET = "my_preset";  // Replace with your preset name

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file); // The image file you want to upload
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET); // Your Cloudinary preset
  formData.append("cloud_name", "dou9raosf"); // Your Cloudinary cloud name

  try {
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure this is correct
      },
    });
    return response.data.secure_url; // URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image to Cloudinary: ", error);
    throw new Error("Image upload failed");
  }
};

export default uploadToCloudinary;
