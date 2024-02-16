import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const UpdateTeacher = () => {
    const { status, data } = useSession();
    console.log("🚀 ~ file: listTeachers.js:6 ~ ListTeachers ~ data", data)
    const [teachers, setTeachers] = useState([]);
    const [editingTeacher, setEditingTeacher] = useState(null);

    async function getTeachers(dataInfo) {
        try {
            const resp = await fetch('http://127.0.0.1:8000/api/teachers/teacher-list/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${dataInfo.user.token}`
                }
            })
            const teachersData = await resp.json();
            console.log("🚀 ~ file: listTeachers.js:17 ~ getTeachers ~ teachersData", teachersData)
            setTeachers(teachersData)
        } catch (e) {
            console.log(e)
        }
    }

    async function updateTeacher(id, updatedData) {
        try {
            const { school_id, course_code, ...restData } = updatedData;
            const requestData = {
                ...restData,
                school_id: school_id.id,
                course_code: course_code._course_code
            };
            console.log('New data:', requestData)
            const resp = await fetch(`http://127.0.0.1:8000/api/teachers/teacher/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.user.token}`
                },
                body: JSON.stringify(requestData)
            });
            
            if (resp.ok) {
                await getTeachers(data);
                setEditingTeacher(null);
            } else {
                console.error('Failed to update teacher!');
            }
        } catch (error) {
            console.error('Error updating teacher:', error);
        }
    }

    useEffect(() => {
        if (data) {
            getTeachers(data);
        }
    }, [data]);

    const handleInputChange = (e, fieldName) => {
        const value = e.target.value;
        setEditingTeacher(prevState => ({
            ...prevState,
            [fieldName]: value
        }));
    };

    return (
        <div>
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold mb-3">Lista nastavnika</h1>
                {teachers.length > 0 && (
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            {teachers.map((item, index) => (
                                <div key={index} className={`py-4 sm:grid ${editingTeacher && editingTeacher.id === item.id ? 'sm:grid-cols-3' : 'sm:grid-cols-4'} sm:gap-4 sm:py-5 sm:px-6`}>
                                {editingTeacher && editingTeacher.id === item.id ? (
                                    <>
                                        <div className="flex flex-col">
                                            <input
                                                type="text"
                                                value={editingTeacher.first_name}
                                                onChange={(e) => handleInputChange(e, 'first_name')}
                                            />
                                            <input
                                                type="text"
                                                value={editingTeacher.last_name}
                                                onChange={(e) => handleInputChange(e, 'last_name')}
                                            />
                                            <input
                                                type="text"
                                                value={editingTeacher.email}
                                                onChange={(e) => handleInputChange(e, 'email')}
                                            />
                                        </div>
                                        <button onClick={() => updateTeacher(item.id, editingTeacher)}>Save</button>
                                        <button onClick={() => setEditingTeacher(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <dt className="text-sm font-medium text-gray-500 first-letter:capitalize">{index + 1}. {item.first_name} {item.last_name}</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">{item.email}</dd>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">{item.school_id.school_name}</dd>
                                        <button className="mt-1 text-sm text-blue-600 sm:col-span-1" onClick={() => setEditingTeacher(item)}>Edit</button>
                                    </>
                                )}
                            </div>                            
                            ))}
                        </dl>
                    </div>
                )}
            </div>
        </div>
    )
};

export default UpdateTeacher;