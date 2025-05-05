import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';

const CourseTutorialManager = () => {
  const [courses, setCourses] = useState([]);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [tutorialTitle, setTutorialTitle] = useState('');
  const [selectedCourseSlug, setSelectedCourseSlug] = useState('');
  const [tutorialContent, setTutorialContent] = useState('');

  // Fetch all courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/courses');
      if (response.data.success) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCreateCourse = async () => {
    if (!courseTitle.trim()) {
      alert('Course title is required.');
      return;
    }

    try {
      const response = await axios.post('/courses', {
        title: courseTitle,
        description: courseDescription,
      });

      if (response.data.success) {
        alert('Course created successfully!');
        setCourseTitle('');
        setCourseDescription('');
        fetchCourses();
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course.');
    }
  };

  const handleCreateTutorial = async () => {
    if (!tutorialTitle.trim() || !selectedCourseSlug) {
      alert('Tutorial title and course selection are required.');
      return;
    }

    
    console.log("Payload:", {
      tutorialTitle,
      tutorialContent,
      selectedCourseSlug
    });
    try {
      const response = await axios.post('/tutorials', {
        title: tutorialTitle,
        courseSlug: selectedCourseSlug,
        content: {"html":tutorialContent},
      });

      if (response.data.success) {
        alert('Tutorial created successfully!');
        setTutorialTitle('');
        setSelectedCourseSlug('');
        setTutorialContent('');
      }
    } catch (error) {
      console.error('Error creating tutorial:', error);
      alert('Failed to create tutorial.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Create New Course</h2>
      <input
        type="text"
        placeholder="Course Title"
        value={courseTitle}
        onChange={(e) => setCourseTitle(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <textarea
        placeholder="Course Description"
        value={courseDescription}
        onChange={(e) => setCourseDescription(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      ></textarea>
      <button onClick={handleCreateCourse} style={{ padding: '10px 20px' }}>
        Create Course
      </button>

      <hr style={{ margin: '40px 0' }} />

      <h2>Create New Tutorial</h2>
      <input
        type="text"
        placeholder="Tutorial Title"
        value={tutorialTitle}
        onChange={(e) => setTutorialTitle(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <select
        value={selectedCourseSlug}
        onChange={(e) => setSelectedCourseSlug(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      >
        <option value="">Select Course</option>
        {courses.map((course) => (
          <option key={course.slug} value={course.slug}>
            {course.title}
          </option>
        ))}
      </select>
      <ReactQuill
        value={tutorialContent}
        onChange={setTutorialContent}
        theme="snow"
        placeholder="Write tutorial content here..."
        style={{ height: '200px', marginBottom: '10px' }}
      />
      <button onClick={handleCreateTutorial} style={{ padding: '10px 20px'  }}>
        Create Tutorial
      </button>
    </div>
  );
};

export default CourseTutorialManager;
