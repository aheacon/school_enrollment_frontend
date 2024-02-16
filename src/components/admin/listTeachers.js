import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const ListTeachers = () => {
    const { status, data } = useSession();
    console.log("🚀 ~ file: listTeachers.js:6 ~ ListTeachers ~ data", data)
    const [teachers, setTeachers] = useState([])

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
    
    // Added delete function
    async function deleteTeacher(id) {
        try {
            const resp = await fetch(`http://127.0.0.1:8000/api/teachers/teacher/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${data.user.token}`
                }
            });
            if (resp.ok) {
                setTeachers(teachers.filter(teacher => teacher.id !== id));
            } else {
                console.error('Failed to delete teacher!');
            }
        } catch (error) {
            console.error('Error deleting teacher:', error);
        }
    }

    useEffect(() => {
        if (data) {
            getTeachers(data)
        }
    }, [data])

    return (
        <div>
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold mb-3">Lista nastavnika</h1>
                {teachers.length > 0 && (
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            {teachers.map((item, index) => {
                                return (
                                    <div key={index} className="py-4 sm:grid sm:grid-cols-5 sm:gap-4 sm:py-5 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500 first-letter:capitalize">{index + 1}. {item.first_name} {item.last_name}</dt>
                                        {/* Added so that the id is visible*/}
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">Id: {item.id}</dd>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">{item.email}</dd>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">{item.school_id.school_name}</dd>
                                        {/* Added delete button*/}
                                        <button onClick={() => {
                                        if (window.confirm('Da li ste sigurni da želite izbrisati ovog nastavnika?')) {
                                        deleteTeacher(item.id);}}} 
                                        className="mt-1 text-sm text-white bg-red-600 sm:col-span-1 px-4 py-2 rounded-md"
                                        style={{ alignSelf: 'center', width: '80px' }}>Izbriši</button>
                                    </div>
                                )
                            })}

                        </dl>
                    </div>
                )}

            </div>
        </div>
    )
};

export default ListTeachers;