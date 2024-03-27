import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Url from "../../../constants";

const ListStudents = () => {
    const { data } = useSession();
    const [students, setStudents] = useState([]);
    const [nameInput, setNameInput] = useState('');
    
    async function getStudents(dataInfo) {
        try {
            const resp = await fetch(`${Url}api/sec-students/student-list`, {
                method: 'GET',
                headers: {
                    'Authorization': dataInfo ? `Bearer ${dataInfo.user.token}` : null
                }
            });
            const studentsData = await resp.json();
            console.log("🚀 ~ file: listStudents.js:17 ~ getStudents ~ studentsData:", studentsData);
            // NOTE: Points are only for testing;
            const studentsWithPoints = studentsData.map(student => {
                // Here we generate points for EL course;
                const elPoints = Math.floor(Math.random() * (95 - 80 + 1)) + 80;
                // Here we generate points for Rtia course;
                const rtiaPoints = Math.floor(Math.random() * (95 - 80 + 1)) + 80;
                return { ...student, elPoints, rtiaPoints };
            });
            
            // We sort the pupils based on EL points;
            const sortedStudentsEL = studentsWithPoints.slice().sort((a, b) => b.elPoints - a.elPoints);
            // We rank the students based on EL course;
            sortedStudentsEL.forEach((student, index) => {
                student.elRanking = index + 1;
            });
            
            // We sort the pupils based on Rtia points;
            const sortedStudentsRTiA = studentsWithPoints.slice().sort((a, b) => b.rtiaPoints - a.rtiaPoints);
            // We rank the students based on Rtia course;
            sortedStudentsRTiA.forEach((student, index) => {
                student.rtiaRanking = index + 1;
            });
            
            setStudents({ sortedStudentsEL, sortedStudentsRTiA });
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getStudents(data);
    }, []);

    const handleInputChange = (event) => {
        setNameInput(event.target.value);
    };
    
    const filterStudents = (student) => {
        const fullName = `${student.name} ${student.last_name}`.toLowerCase();
        const lowerCaseNameInput = nameInput.trim().toLowerCase();
        return fullName === lowerCaseNameInput;
        // return fullName.includes(loweCaseNameInput); if we wanted to return based on name or surname;
    };

    // We check if the sortedStudentsEL/RTiA exists, if it does filter function is called on the array;
    const filteredStudentsEL = students.sortedStudentsEL ? students.sortedStudentsEL.filter(filterStudents) : [];
    const filteredStudentsRTiA = students.sortedStudentsRTiA ? students.sortedStudentsRTiA.filter(filterStudents) : [];


    return (
        <div>
            <div className="flex justify-center" style={{ paddingBottom: '40px' }}>
                <h1 className="text-4xl font-semibold text-center">Dobrodošli</h1>
            </div>
            <div className="flex flex-col">
                <div className="mb-4">
                    <label htmlFor="courseInput" className="block text-sm font-bold mb-2 ml-3">Unesite ime i prezime učenika:</label>
                    <input
                        id="nameInput"
                        type="text"
                        className="border rounded w-full py-2 px-3"
                        value={nameInput}
                        onChange={handleInputChange}
                        placeholder="Unesi ime i prezime"
                    />
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        {filteredStudentsEL.map((item, index) => (
                            <div key={item}>
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 first-letter:capitalize">{item.name} {item.last_name}</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">Bodovi (EL): {item.elPoints}</dd>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">Pozicija: {item.elRanking}</dd>
                                </div>
                            </div>
                        ))}
                        {filteredStudentsRTiA.map((item, index) => (
                            <div key={item}>
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 first-letter:capitalize">{item.name} {item.last_name}</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">Bodovi (RTiA): {item.rtiaPoints}</dd>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">Pozicija: {item.rtiaRanking}</dd>
                                </div>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
};


export default ListStudents;