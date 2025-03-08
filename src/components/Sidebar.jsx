// import React from "react";
// import { Link } from "react-router-dom";
// // import "./Sidebar.css";

// const Sidebar = ({ course, tutorials, selectedTutorial, courseSlug }) => {
//   if (!course) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <aside className="sidebar">
//       <h2>{course?.title ? course.title.toUpperCase() : "Loading..."}</h2>
//       <p className="course-description">{course?.description || "No description available."}</p>
//       <ul>
//         {tutorials.length > 0 ? (
//           tutorials.map((tutorial, index) => (
//             <li
//               key={tutorial.id || index}
//               className={selectedTutorial?.id === tutorial.id ? "active-tutorial" : ""}
//             >
//               <Link to={`/courses/${courseSlug}/${tutorial.slug}`}>
//                 {tutorial.title || "Untitled Tutorial"}
//               </Link>
//             </li>
//           ))
//         ) : (
//           <p>No tutorials available.</p>
//         )}
//       </ul>
//     </aside>
//   );
// };

// export default Sidebar;
