import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const GradeForm = ({ onSubmit, classId, subjects }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Here we are checking if the grade is between 2 and 5 and it must be a number;
  const validateGrade = (value) => {
    const grade = parseInt(value);
    if (isNaN(grade)) return 'Ocjena mora biti broj!';
    if (grade < 2 || grade > 5) return 'Ocjena mora biti između 2 i 5!';
    return true;
  };

  const [focusedInputIndex, setFocusedInputIndex] = useState(0);

  // This function checks the input changes and it switches to the next input field;
  const handleInputChange = (index) => {
    setFocusedInputIndex(index);
    if (index < subjects.length - 1) {
      document.getElementById(subjects[index + 1]).focus();
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 bg-opacity-100">
      <div className="bg-white p-8 rounded-lg shadow-lg mt-12 mb-12 w-full max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-700">Unos predmeta za {classId} razred:</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {subjects.map((subject, index) => (
              <div key={subject} className="flex flex-col mb-4">
                <label htmlFor={subject} className="text-gray-600 mb-2">
                  {subject}
                </label>
                <div className="flex items-center">
                  <input
                    id={subject}
                    className="border border-gray-300 rounded-md py-2 px-4 mb-2 focus:outline-none focus:border-blue-500 flex-grow"
                    type="text"
                    placeholder={`Unesite ocjenu za ${subject}`}
                    {...register(subject, { required: "Polje je obavezno!", validate: validateGrade })}
                    onFocus={() => setFocusedInputIndex(index)}
                    onChange={() => handleInputChange(index)}
                  />
                  {errors[subject] && (
                    <p className="text-red-500 italic">{errors[subject]?.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <input
              type="submit"
              value="Sačuvaj"
              className="w-full md:w-40 bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400 transition-colors shadow-lg"
            />
          </div>
        </form>
      </div>
    </div>
  );
  };
  

export default GradeForm;
