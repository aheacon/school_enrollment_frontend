import { useSession } from "next-auth/react";
import { useState } from "react";

const DeleteTeacher = () => {
    const { data } = useSession();
    const [inputId, setInputId] = useState(""); 
    const [isLoading, setIsLoading] = useState(false);
    const [deletedId, setDeletedId] = useState(null);

    const handleInputChange = (event) => {
        setInputId(event.target.value);
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const resp = await fetch(`http://127.0.0.1:8000/api/teachers/teacher/${inputId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${data.user.token}`
                }
            });
            if (resp.ok) {
                setDeletedId(inputId);
            } else {
                console.error('Failed to delete teacher!');
            }
        } catch (error) {
            console.error('Error deleting teacher:', error);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-semibold mb-3">Brisanje nastavnika</h1>
        <div className="flex items-center space-x-4">
        <input 
            className="border rounded px-3 py-2 w-64"
            type="text" 
            placeholder="Unesi ID nastavnika" 
            value={inputId} 
            onChange={handleInputChange} 
            disabled={isLoading}/>
        <button 
            onClick={() => {
                const confirmed = window.confirm("Da li ste sigurni da želite izbrisati ovog nastavnika?");
                if (confirmed) {
                    handleDelete();
                }
            }}
            disabled={isLoading}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-400"
        >Izbriši</button>
        </div>
    {deletedId && <p>Nastavnik sa Id-om {deletedId} uspješno izbrisan.</p>}
</div>
    );
};

export default DeleteTeacher;