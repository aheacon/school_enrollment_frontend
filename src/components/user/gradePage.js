import React, { useState, useEffect } from 'react';
import GradeForm from '../form/gradesForm';
import { useSession } from 'next-auth/react';
import Url from '../../../constants';

const GradePage = ({ studentId, setSelectedPage, selectedTab }) => {
  const { data } = useSession();
  const [gradeSubjects, setGradeSubjects] = useState([]);
  const [classId, setClassId] = useState('');

  // Function to get the course_code based on the coresponding class_id;
  const fetchCourseCodes = async () => {
    try {
      const response = await fetch(`${Url}/api/sec-students/student-list/1/course-create/`);
      if (response.ok) {
        const subjects = await response.json();
        const tabToGradeMap = {
          sixthGrade: 'VI',
          seventhGrade: 'VII',
          eightGrade: 'VIII',
          ninthGrade: 'IX',
        };
        const grade = tabToGradeMap[selectedTab];
        const courseCodes = subjects
          .filter(subject => subject.class_id === grade)
          .map(subject => subject.course_code);
        setGradeSubjects([...new Set(courseCodes)]);
        setClassId(grade);
      } else {
        console.error('Failed to fetch courses!');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchCourseCodes();
  }, [selectedTab]);

  const handleSubmit = async (dataVal) => {
    try {
      const courses = gradeSubjects.map((subject) => ({
        score: dataVal[subject],
        class_id: classId,
        course_code: subject,
        pupil_id: studentId,
      }));

      // Main POST function
      for (const courseData of courses) {
        await fetch(`${Url}/api/sec-students/student-list/${studentId}/course-create/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${data.user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courseData),
        });
      }
      setSelectedPage('editStudent');
    } catch (e) {
      console.error('Error submitting grades:', e);
    }
  };

  return <GradeForm onSubmit={handleSubmit} classId={classId} subjects={gradeSubjects} pupilId={studentId} />;
};

export default GradePage;
