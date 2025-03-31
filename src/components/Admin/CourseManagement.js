import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("/courses");
      setCourses(response.data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const createCourse = async () => {
    try {
      await axios.post("/courses", { title, description });
      fetchCourses(); // Refresh list
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const deleteCourse = async (slug) => {
    try {
      await axios.delete(`/courses/${slug}`);
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div>
      <h2>Course Management</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Course Title" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <button onClick={createCourse}>Create Course</button>

      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            {course.title} - {course.slug} <button onClick={() => deleteCourse(course.slug)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseManagement;
