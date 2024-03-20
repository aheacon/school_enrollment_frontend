import React from 'react';
import GradeForm from '../form/gradesForm';
import { useSession } from 'next-auth/react';
import Url from '../../../constants';

const GradePage = ({ studentId, setSelectedPage, grade }) => {
  const { data } = useSession();

  const handleSubmit = async (dataVal) => {
    try {
      let gradeSubjects = [];
      if (grade === 'IX') {
        gradeSubjects = ['BOS', 'ENG', 'GER', 'HIS', 'GEO', 'LIK', 'MUZ', 'MM'
        , 'FIZ', 'HEM', 'BIO', 'TZO', 'TEH', 'INF', 'GRAD', 'VJE'];
      } else if (grade === 'VIII') {
        gradeSubjects = ['BIO', 'ENG', 'MM'];
      } else if (grade === 'VII') {
        gradeSubjects = ['BOS', 'ENGG', 'GER', 'HIS', 'GEO', 'LIK', 'MUZ', 'MMM', 
        'FIZ', 'BIOO', 'TZO', 'TEH', 'INF', 'VJE'];
      } else if (grade === 'VI') {
        gradeSubjects = ['BOS', 'ENGG', 'GER', 'HIS', 'GEO', 'LIK', 'MUZ', 'MMM', 
        'BIOO', 'TZO', 'TEH', 'INF', 'VJE'];
      }


      const courses = gradeSubjects.map((subject) => ({
        score: dataVal[subject],
        class_id: grade,
        course_code: subject,
        pupil_id: studentId,
      }));

      // Main POST function;
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
      console.log(e);
    }
  };

  // Here we define the subject that will be displayed in the form;
  let gradeSubjects = [];
  let classId = '';
  if (grade === 'IX') {
    gradeSubjects = ['Bosanski jezik i književnost', 'Engleski jezik', 'Njemački jezik', 'Historija/Povijest/Istorija'
    , 'Geografija/Zemljopis', 'Likovna kultura', 'Muzička/Glazbena kultura', 'Matematika', 'Fizika', 'Hemija/Kemija'
    , 'Biologija', 'Tjelesni i zdravstveni odgoj', 'Tehnička kultura', 'Informatika', 'Građansko obrazovanje', 
    'Islamska vjeronauka'];
    classId = 'IX';
  } else if (grade === 'VIII') {
    gradeSubjects = ['Biologija', 'Engleski jezik', 'Matematika'];
    classId = 'VIII';
  } else if (grade === 'VII') {
    gradeSubjects = ['Bosanski jezik i književnost', 'Engleski jezik', 'Njemački jezik', 'Historija/Povijest/Istorija',
    'Geografija/Zemljopis', 'Likovna kultura', 'Muzička/Glazbena kultura', 'Matematika', 'Fizika', 'Biologija', 'Tjelesni i zdravstveni odgoj',
    'Tehnička kultura', 'Informatika', 'Islamska vjeronauka'];
    classId = 'VII';
  } else if (grade === 'VI') {
    gradeSubjects = ['Bosanski jezik i književnost', 'Engleski jezik', 'Njemački jezik', 'Historija/Povijest/Istorija',
    'Geografija/Zemljopis', 'Likovna kultura', 'Muzička/Glazbena kultura', 'Matematika', 'Biologija', 'Tjelesni i zdravstveni odgoj',
    'Tehnička kultura', 'Informatika', 'Islamska vjeronauka'];
    classId = 'VI';
  }

  return <GradeForm onSubmit={handleSubmit} classId={classId} subjects={gradeSubjects} />;
};

export default GradePage;