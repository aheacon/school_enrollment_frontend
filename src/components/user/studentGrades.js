import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Url from "../../../constants";

const StudentGrades = ({ studentId }) => {
    const { data } = useSession();
    const [studentGrades, setStudentGrades] = useState([]);

    useEffect(() => {
        fetchStudentGrades();
    }, []);

    async function fetchStudentGrades() {
        try {
            const resp = await fetch(`${Url}/api/sec-students/student-list/${studentId}/course-create/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${data.user.token}`
                }
            })
            const gradesData = await resp.json();
            setStudentGrades(gradesData);
        } catch (error) {
            console.error('Error fetching student grades:', error);
        }
    }

    const groupedGrades = studentGrades.reduce((acc, grade) => {
        if (!acc[grade.class_id]) {
            acc[grade.class_id] = [];
        }
        acc[grade.class_id].push(grade);
        return acc;
    }, {});
    
    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Ocjene</h1>
            {Object.entries(groupedGrades).map(([classId, grades]) => (
                <div key={classId} className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">{classId}</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {grades.map((grade, index) => (
                            <div key={index} className="bg-white shadow-md rounded-lg p-4">
                                <p className="text-gray-700 mb-2">{grade.course_code}</p>
                                <p className="text-gray-700">Ocjena: {grade.score}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StudentGrades;
