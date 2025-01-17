import { useContext, useEffect, useState } from "react";
import axios from "../../config/api/axios";
import { useNavigate } from "react-router-dom";
import UserContext from "../../Hooks/UserContext";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import { RxUpdate } from "react-icons/rx";

const NotesForm = () => {
  const { subject, notes, noteId, setNoteId } = useContext(UserContext);
  const [note, setNote] = useState({
    subject: subject._id,
    title: "",
    body: "",
  });

  useEffect(() => {
    if (noteId) {
      setNote(notes[noteId]);
    }
    return () => setNoteId("");
  }, [noteId, notes, setNoteId]);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFormChange = (e) => {
    setNote({
      ...note,
      [e.target.id]: e.target.value,
    });
  };

  const addNote = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("notes/subject/" + subject._id, note);
      setError("");
      navigate(-1, { replace: true });
      toast.success(response.data.message);
    } catch (err) {
      setError(err);
    }
  };

  const updateNote = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch("notes/" + note._id, note);
      navigate(-1, { replace: true });
      setError("");
      toast.success(response.data.message);
      setNoteId("");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <main className="notes">
      <h2 className="mb-2 mt-3 text-6xl font-bold text-violet-950 underline decoration-inherit decoration-2 underline-offset-4 dark:mt-0 dark:text-slate-400">
        {noteId ? "Edit Note" : "Add Note"}
      </h2>
      <form>
        <label htmlFor="title" className="block text-lg font-medium">
          Title:
        </label>
        <input
          className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-slate-200 focus:border-violet-900 dark:border-slate-200 dark:caret-inherit dark:focus:border-violet-400 dark:active:border-violet-400"
          type="text"
          id="title"
          required
          value={note.title}
          onChange={(e) => handleFormChange(e)}
        />
        <label htmlFor="body" className="block text-lg font-medium">
          Body:
        </label>
        <textarea
          className="mb-4 block w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-slate-200 focus:border-violet-900 dark:border-slate-200 dark:caret-inherit dark:focus:border-violet-400 dark:active:border-violet-400"
          rows="15"
          type="text"
          id="body"
          required
          value={note.body}
          onChange={(e) => handleFormChange(e)}
        />
        {noteId ? (
          <button
            className="mb-4 flex h-10 w-auto items-center gap-2 rounded-md border-[1.5px] border-solid border-violet-900 bg-slate-800 px-4 py-2 font-semibold tracking-wide text-slate-200 hover:bg-violet-900 focus:bg-violet-900 dark:border-violet-300 dark:bg-violet-900 dark:text-violet-100 dark:hover:bg-slate-900 "
            type="submit"
            onClick={(e) => updateNote(e)}
          >
            <RxUpdate />
            Update Note
          </button>
        ) : (
          <button
            className="mb-4 flex h-10 w-auto items-center gap-2 rounded-md border-[1.5px] border-solid border-violet-900 bg-slate-800 px-4 py-2 font-semibold tracking-wide text-slate-200 hover:bg-violet-900 focus:bg-violet-900 dark:border-violet-300 dark:bg-violet-900 dark:text-violet-100 dark:hover:bg-slate-900"
            type="submit"
            onClick={(e) => addNote(e)}
          >
            <FaPlus />
            Add Note
          </button>
        )}
      </form>
      <p className="mb-3 overflow-hidden text-ellipsis whitespace-nowrap text-center font-medium text-red-700">
        {error ? error?.response?.data?.message || error?.response?.data : ""}
      </p>
    </main>
  );
};

export default NotesForm;
