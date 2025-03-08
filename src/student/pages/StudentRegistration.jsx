import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import uploadToCloudinary from "../../utils/uploadToCloudinary";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useAlert } from "../../context/AlertContext";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage";
import { IoClose, IoMail, IoLockClosed, IoPerson, IoImage, IoKey, IoCalendar, IoCall } from "react-icons/io5";
import { FaBookOpen, FaRupeeSign } from "react-icons/fa";

const StudentRegistration = () => {
    const { setUser } = useContext(UserContext);
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    const [student, setStudent] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        course: "",
        price: "",
        duration: "",
    });

    const [courses, setCourses] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const [croppedImage, setCroppedImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [showCropper, setShowCropper] = useState(false);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            const querySnapshot = await getDocs(collection(db, "courses"));
            const coursesData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCourses(coursesData);
        };
        fetchCourses();


    }, []);

    // Handle Course Selection
    const handleCourseChange = (e) => {
        const selectedCourse = courses.find(course => course.id === e.target.value);
        if (selectedCourse) {
            setStudent({
                ...student,
                course: selectedCourse.name,
                price: selectedCourse.price,
                duration: selectedCourse.duration,
            });
        }
    };

    // Handle Image Selection
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

        setImageFile(URL.createObjectURL(file));
        setShowCropper(true);
    };

    // Capture cropped area
    const handleCropComplete = (_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    // Save cropped image
    const handleCropSave = async () => {
        try {
            const croppedImg = await getCroppedImg(imageFile, croppedAreaPixels);
            setCroppedImage(croppedImg);
            setShowCropper(false);
        } catch (error) {
            showAlert("error", "Failed to crop image.");
        }
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (student.password !== student.confirmPassword) {
            showAlert("error", "Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            const q = query(collection(db, "students"), where("email", "==", student.email));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                showAlert("error", "Email is already registered!");
                setLoading(false);
                return;
            }

            let imageUrl = "";
            if (croppedImage) {
                imageUrl = await uploadToCloudinary(croppedImage);
            }

            const userCredential = await createUserWithEmailAndPassword(auth, student.email, student.password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: student.name,
                photoURL: imageUrl,
            });

            await addDoc(collection(db, "students"), {
                uid: user.uid,
             
                name: student.name,
                email: student.email,
                course: student.course,
                mobile: student.mobile,
                price: student.price,
                duration: student.duration,
                photo: imageUrl,
             
            });

            setUser({
                uid: user.uid,
                mobile: student.mobile,
                name: student.name,
                email: student.email,
                course: student.course,
                photo: imageUrl,
            });

            localStorage.setItem("user", JSON.stringify({ uid: user.uid, mobile: student.mobile, name: student.name, email: student.email, photo: imageUrl }));

            showAlert("success", "Registration successful!");
            setTimeout(() => navigate("/student"), 2000);
        } catch (error) {
            showAlert("error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="m-10 flex justify-center items-center">
            <div className="max-w-md mx-3 px-9 py-9 bg-white rounded-lg shadow-lg relative">
                {alert?.visible && (
                    <div className={`absolute top-0 left-0 right-0 mx-auto p-3 text-white rounded flex items-center justify-between transition-opacity duration-300 ${alert.type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}>
                        <span>{alert.message}</span>
                        <IoClose className="cursor-pointer" onClick={() => setAlert(null)} />
                    </div>
                )}

                {/* Cropper Modal */}
                {showCropper && (

                    <div className="absolute inset-0 bg-white p-4 rounded-lg bg-opacity-75 flex flex-col items-center justify-center z-50">
                        <h2 className="text-lg font-semibold mb-3">Crop Your Image</h2>
                        <div className="relative w-[300px] h-[300px]">
                            <Cropper
                                image={imageFile}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={handleCropComplete}
                            />
                        </div>
                        <div className="flex justify-between ga mt-4">
                            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setShowCropper(false)}>Cancel</button>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCropSave}>Crop & Save</button>
                        </div>
                    </div>

                )}

                <h2 className="text-xl font-semibold mb-4 text-center">Student Registration</h2>
                <form className="space-y-4 flex flex-col justify-center" onSubmit={handleSubmit}>

                    {/* Profile Image Upload */}
                    <div className="border-2 w-30 self-center border-dashed border-gray-300 p-4 rounded-full text-center cursor-pointer hover:border-blue-500 transition">
                        <label className="block text-gray-600 font-medium cursor-pointer">
                            <IoImage className="text-blue-500 mx-auto text-4xl mb-2" />
                            {croppedImage ? (
                                <img src={croppedImage} alt="Preview" className="w-24 h-24 object-cover rounded mx-auto mt-2 border" />
                            ) : "Upload Profile"}
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>

                

                    {/* Student Name */}
                    <div className="flex items-center border p-2 rounded">
                        <IoPerson className="text-gray-500 mr-2" />
                        <input type="text" placeholder="Student Name" className="w-full outline-none" required value={student.name} onChange={(e) => setStudent({ ...student, name: e.target.value })} />
                    </div>

                    {/* Student Email */}
                    <div className="flex items-center border p-2 rounded">
                        <IoMail className="text-gray-500 mr-2" />
                        <input type="email" placeholder="Student Email" className="w-full outline-none" required value={student.email} onChange={(e) => setStudent({ ...student, email: e.target.value })} />
                    </div>

{/* Mobile Number */}
<div className="flex items-center border p-2 rounded">
    <IoCall className="text-gray-500 mr-2" />
    <input type="tel" placeholder="Mobile Number" className="w-full outline-none" required 
        value={student.mobile} 
        onChange={(e) => setStudent({ ...student, mobile: e.target.value })} />
</div>

                    {/* Course Selection */}
                    <div className="flex items-center border p-2 rounded">
                        <FaBookOpen className="text-gray-500 mr-2" />
                        <select className="w-full outline-none" onChange={handleCourseChange}>
                            <option value="">Select a Course</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.name} - ₹{course.price}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Password & Confirm Password */}
                    <div className="flex items-center border p-2 rounded">
                        <IoLockClosed className="text-gray-500 mr-2" />
                        <input type="password" placeholder="Password" className="w-full outline-none" required value={student.password} onChange={(e) => setStudent({ ...student, password: e.target.value })} />
                    </div>

                    <div className="flex items-center border p-2 rounded">
                        <IoKey className="text-gray-500 mr-2" />
                        <input type="password" placeholder="Confirm Password" className="w-full outline-none" required value={student.confirmPassword} onChange={(e) => setStudent({ ...student, confirmPassword: e.target.value })} />
                    </div>

                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StudentRegistration;
