import { useState, useEffect, useContext } from "react";
import axios from "../../config/api/axios";
import { Link } from "react-router-dom";
import UserContext from "../../Hooks/UserContext";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "../Layouts/Loading";

const Notes = () => {
  const { subject, setNoteId, notes, setNotes, userType } =
    useContext(UserContext);
  const [error, setError] = useState("");

  useEffect(() => {
    const getNotes = async () => {
      try {
        const response = await axios.get("notes/subject/" + subject._id);
        //TODO Move to backend
        if (!response.data.length) {
          setError({
            response: {
              data: "No Notes found",
            },
          });
        }
        setNotes(response.data);
      } catch (err) {
        setError(err);
      }
    };
    getNotes();
    return () => setNotes([]);
  }, [subject, setNotes, setNoteId]);

  const deleteNote = async (e) => {
    const id = e.currentTarget.id;
    const response = await axios.delete("notes/" + id);
    const newNotes = notes.filter((note) => note._id !== id);
    setNotes(newNotes);
    toast.success(response.data.message, {
      icon: () => <FaTrash />,
    });
  };

  return (
    <main>
      <h2 className="mb-2 mt-3 whitespace-break-spaces text-4xl font-bold text-violet-950 underline decoration-inherit decoration-2 underline-offset-4 dark:mt-0 dark:text-slate-400 md:text-6xl">
        {subject.subject}
      </h2>
      <ul className="grid grid-cols-2 justify-normal font-semibold lg:flex lg:items-center lg:justify-start lg:gap-16">
        <li className="p-1">Batch : {subject.year}</li>
        <li className="p-1">Semester : {subject.semester}</li>
        {userType === "student" && (
          <li className="p-1">Teacher : {subject.teacher.name}</li>
        )}
        <li className="p-1">
          <Link
            className="rounded-md underline decoration-violet-900  decoration-2 underline-offset-2 hover:bg-violet-950 hover:text-slate-100 hover:decoration-0 dark:decoration-inherit dark:hover:bg-slate-600/80 dark:hover:text-slate-200 lg:p-2 "
            to="students"
          >
            Students
          </Link>
        </li>
        {userType === "teacher" && (
          <li className="p-1">
            <Link
              className="rounded-md underline decoration-violet-900   decoration-2 underline-offset-2 hover:bg-violet-950 hover:text-slate-100 hover:decoration-0 dark:decoration-inherit dark:hover:bg-slate-600/80 dark:hover:text-slate-200 lg:p-2 "
              to="add"
            >
              Add Note
            </Link>
          </li>
        )}
      </ul>

      <hr className="mt-3 border-b-[1px] border-slate-500 " />

      <section className="note__body w-full ">
        {notes?.map((note, index) => (
          <article
            className="mt-4 overflow-auto whitespace-break-spaces rounded-md border-2 border-slate-900 bg-violet-200 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-300"
            key={index}
          >
            <details className="">
              <summary className="list-none ">
                <div className="flex justify-between">
                  <h3 className="p-4 text-lg  font-semibold">{note.title}</h3>
                  {userType === "teacher" && (
                    <div className="flex p-3 pb-1">
                      <Link
                        to={`${index}/edit`}
                        id={index}
                        onClick={(e) => setNoteId(e.currentTarget.id)}
                      >
                        <FaEdit className="ml-2 rounded-md p-1 text-3xl hover:bg-violet-900 hover:text-slate-100 dark:hover:bg-violet-600 lg:p-2 lg:text-4xl" />
                      </Link>
                      <Link
                        id={note._id}
                        style={{ color: "rgba(220, 20, 60, 0.8)" }}
                        onClick={(e) => deleteNote(e)}
                      >
                        <FaTrash className="ml-2 rounded-md p-1 text-3xl text-red-700 hover:bg-red-700 hover:text-slate-100 dark:text-red-600 lg:p-2 lg:text-4xl" />
                      </Link>
                    </div>
                  )}
                </div>
              </summary>
              <hr className="border-b-[1.5px] border-slate-900 dark:border-slate-500 " />
              <pre className="whitespace-pre-wrap p-4 font-sans">
                {note.body}
              </pre>
            </details>
          </article>
        ))}
        {!notes.length && !error && <Loading />}
      </section>
      <p className="m-2 overflow-hidden text-ellipsis whitespace-nowrap text-center font-medium text-red-700">
        {error
          ? error?.response?.data?.message ||
            error?.data?.message ||
            error?.response?.data
          : ""}
      </p>
    </main>
  );
};

export default Notes;
