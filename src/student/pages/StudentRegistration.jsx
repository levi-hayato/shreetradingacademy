import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { db, auth, googleProvider } from "../../firebase/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import uploadToCloudinary from "../../utils/uploadToCloudinary";
import { signInWithPopup, createUserWithEmailAndPassword , updateProfile} from "firebase/auth";
import { IoClose, IoMail, IoLockClosed, IoPerson, IoImage } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";

const StudentRegistration = () => {
    const {setUser } = useContext(UserContext);
    const [student, setStudent] = useState({ name: "", email: "", password: "", photo: "" });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [setUser]);

    const showAlert = (type, message) => {
        setAlert({ type, message, visible: true });
        setTimeout(() => setAlert(null), 3000);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showAlert("error", "File size should be less than 5MB!");
            return;
        }
        if (!file.type.startsWith("image/")) {
            showAlert("error", "Please select a valid image file!");
            return;
        }

        setImageFile(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];

        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            showAlert("error", "File size should be less than 5MB!");
            return;
        }
        if (!file.type.startsWith("image/")) {
            showAlert("error", "Please select a valid image file!");
            return;
        }

        setImageFile(file);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
  
      try {
          // Check if email is already registered
          const q = query(collection(db, "students"), where("email", "==", student.email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
              showAlert("error", "Email is already registered!");
              setLoading(false);
              return;
          }
  
          // Upload image if provided
          let imageUrl = "";
          if (imageFile) {
              imageUrl = await uploadToCloudinary(imageFile);
          }
  
          // Create user in Firebase Authentication
          const userCredential = await createUserWithEmailAndPassword(auth, student.email, student.password);
          const user = userCredential.user;
  
          // Update Firebase Auth Profile
          await updateProfile(user, {
              displayName: student.name,
              photoURL: imageUrl,
          });
  
          // Save student data to Firestore
          await addDoc(collection(db, "students"), {
              uid: user.uid,
              name: student.name,
              email: student.email,
              photo: imageUrl,
          });
  
          // Store user info in local state and redirect
          const userData = {
              uid: user.uid,
              name: student.name,
              email: student.email,
              photo: imageUrl,
          };
  
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
  
          showAlert("success", "Registration successful!");
          setTimeout(() => navigate("/dash"), 2000);
      } catch (error) {
          showAlert("error", error.message);
      } finally {
          setLoading(false);
      }
  };
  

    return (
        <div className="h-[110vh] flex justify-center items-center">
            <div className="max-w-md mx-3 px-9 py-9 bg-white rounded-lg shadow-lg relative">
                {alert?.visible && (
                    <div className={`absolute top-0 left-0 right-0 mx-auto p-3 text-white rounded flex items-center justify-between transition-opacity duration-300 ${
                        alert.type === "success" ? "bg-green-500" : "bg-red-500"
                    }`}>
                        <span>{alert.message}</span>
                        <IoClose className="cursor-pointer" onClick={() => setAlert(null)} />
                    </div>
                )}

                <h2 className="text-xl font-semibold mb-4 text-center">Student Registration</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="flex items-center border p-2 rounded">
                        <IoPerson className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Student Name"
                            className="w-full outline-none"
                            required
                            value={student.name}
                            onChange={(e) => setStudent({ ...student, name: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center border p-2 rounded">
                        <IoMail className="text-gray-500 mr-2" />
                        <input
                            type="email"
                            placeholder="Student Email"
                            className="w-full outline-none"
                            required
                            value={student.email}
                            onChange={(e) => setStudent({ ...student, email: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center border p-2 rounded">
                        <IoLockClosed className="text-gray-500 mr-2" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full outline-none"
                            required
                            value={student.password}
                            onChange={(e) => setStudent({ ...student, password: e.target.value })}
                        />
                    </div>

                    {/* 🖼️ Interactive File Uploader */}
                    <div
                        className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer hover:border-blue-500 transition"
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <label className="block text-gray-600 font-medium cursor-pointer">
                            <IoImage className="text-blue-500 mx-auto text-4xl mb-2" />
                            {imageFile ? (
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="Preview"
                                    className="w-24 h-24 object-cover rounded mx-auto mt-2 border"
                                />
                            ) : (
                                <>
                                    Drag & Drop an Image or <span className="text-blue-500 underline">Click to Upload</span>
                                </>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded flex items-center justify-center gap-2 transition-all hover:bg-blue-600"
                        disabled={loading}
                    >
                        {loading ? <span className="animate-spin w-5 h-5 border-4 border-white border-t-transparent rounded-full"></span> : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StudentRegistration;
