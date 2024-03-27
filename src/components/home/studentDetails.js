import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Url from "../../../constants";
import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

const StudentDetails = ({ studentId }) => {
    const router = useRouter();
    const { data } = useSession();
    const [student, setStudent] = useState(null);
    const [averageScores, setAverageScores] = useState(null);
    const [sv, setSV] = useState(null);
    const [sv2, setSV2] = useState(null);
    const [specialScores, setSpecialScores] = useState(null);
    const [total, setTotal] = useState(null);

    // Here we get the student using his id;
    async function getStudent(dataInfo) {
        try {
            const resp = await fetch(`${Url}/api/sec-students/student-list/${studentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': dataInfo ? `Bearer ${dataInfo.user.token}` : null
                }
            });
            const studentData = await resp.json();
            setStudent(studentData);
        } catch (e) {
            console.log(e);
        }
    }

    // Getting the average score per grade (VI, VII, VIII, IX);
    async function getAverageScorePerGrade(studentId) {
        try {
            const resp = await fetch(`${Url}/api/sec-students/student-list/${studentId}/course-create/`, {
                method: 'GET',
                headers: {
                    'Authorization': data ? `Bearer ${data.user.token}` : null
                }
            });
            const scoresData = await resp.json();
            const averageScoresPerGrade = {};

            scoresData.forEach(score => {
                const { class_id, score: scoreValue } = score;
                if (!averageScoresPerGrade[class_id]) {
                    averageScoresPerGrade[class_id] = { totalScore: 0, count: 0 };
                }
                averageScoresPerGrade[class_id].totalScore += scoreValue;
                averageScoresPerGrade[class_id].count++;
            });

            for (const grade in averageScoresPerGrade) {
                averageScoresPerGrade[grade] = (averageScoresPerGrade[grade].totalScore / averageScoresPerGrade[grade].count).toFixed(2);
            }

            setAverageScores(averageScoresPerGrade);
        } catch (e) {
            console.log(e);
        }
    }

    // Used to get the special criteria grades per desired_course_code;
    async function getSpecialScores(studentId) {
        try {
            const resp = await fetch(`${Url}/api/sec-students/student-list/${studentId}/course-create/`, {
                method: 'GET',
                headers: {
                    'Authorization': data ? `Bearer ${data.user.token}` : null
                }
            });
            const scoresData = await resp.json();
    
            // Extract the scores for MM, FIZ, and INF for class IDs VIII and IX
            const mmVIII = scoresData.find(score => score.class_id === 'VIII' && score.course_code === 'MM')?.score || 0;
            const fizVIII = scoresData.find(score => score.class_id === 'VIII' && score.course_code === 'FIZ')?.score || 0;
            const infVIII = scoresData.find(score => score.class_id === 'VIII' && score.course_code === 'INF')?.score || 0;
            const mmIX = scoresData.find(score => score.class_id === 'IX' && score.course_code === 'MM')?.score || 0;
            const fizIX = scoresData.find(score => score.class_id === 'IX' && score.course_code === 'FIZ')?.score || 0;
            const infIX = scoresData.find(score => score.class_id === 'IX' && score.course_code === 'INF')?.score || 0;
    
            // Set the extracted scores in state;
            setSpecialScores({ MM_VIII: mmVIII, FIZ_VIII: fizVIII, INF_VIII: infVIII, MM_IX: mmIX, FIZ_IX: fizIX, INF_IX: infIX });

            // Add all the scores together to get the SV (Srednja vrijednost);
            const svScore2 = (parseFloat(mmVIII) + parseFloat(fizVIII) + parseFloat(infVIII) + parseFloat(mmIX) + parseFloat(fizIX) + parseFloat(infIX)).toFixed(2);
            setSV2(svScore2);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getStudent(data);
        getAverageScorePerGrade(studentId);
        getSpecialScores(studentId);
    }, [studentId]);

    // We multiply the average score of each grade with 3 to get SV (Srednja vrijednost);
    useEffect(() => {
        if (averageScores && sv2) {
            const svScore = (
                3 * parseFloat(averageScores['VI']) +
                3 * parseFloat(averageScores['VII']) +
                3 * parseFloat(averageScores['VIII']) +
                3 * parseFloat(averageScores['IX'])
            ).toFixed(2);
            setSV(svScore);
            // Represents the sum of sv and sv2;
            const totalScore = (parseFloat(svScore) + parseFloat(sv2)).toFixed(2);
            setTotal(totalScore);

        }
    }, [averageScores, sv2]);

    return (
        <div className="full-w overflow-x-auto">
            <button onClick={() => router.push('/')} className="flex items-center px-2 py-1 rounded-md hover:bg-gray-300 focus:outline-none">
                <ChevronLeftIcon className="w-6 h-6 mr-1" />
            </button>
            <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                        <th colSpan="3" scope="colgroup" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Generalije</th>
                        {averageScores && Object.keys(averageScores).length > 0 && (
                            <>
                                <th colSpan={Object.keys(averageScores).length + 1} scope="colgroup" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Opšti kriterij</th>
                                <th colSpan="7" scope="colgroup" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Posebni kriterij</th>
                            </>
                        )}
                    </tr>
                    <tr>
                        {['Ime i prezime', 'Status', 'Osnovna škola', ...Object.keys(averageScores || {}), 'SV (Opšti kriterij)', 'MM VIII', 'FIZ VIII', 'INF VIII', 'MM IX', 'FIZ IX', 'INF IX', 'SV (specijalni kriterij)', 'Ukupno'].map(header => (
                            <th key={header} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        {[`${student?.name} ${student?.last_name}`, student?.special_case, student?.primary_school, ...(Object.values(averageScores || {})),sv, specialScores?.MM_VIII, specialScores?.FIZ_VIII, specialScores?.INF_VIII, specialScores?.MM_IX, specialScores?.FIZ_IX, specialScores?.INF_IX, sv2, total].map((value, index) => (
                            <td key={index} className="px-6 py-4 text-center whitespace-nowrap border-r border-gray-200">{value}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default StudentDetails;
