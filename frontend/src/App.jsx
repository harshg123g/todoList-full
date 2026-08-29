import { useEffect, useMemo, useState } from "react";
import { todoApi } from "./services/api";

const emptyForm = { title: "", description: "" };

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await todoApi.getAll({ search, sort, page, limit });
      setTasks(data.allData || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [search, sort, page, limit]);

  const completed = useMemo(
    () => tasks.filter((t) => t.completed).length,
    [tasks],
  );

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Title is required.");
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await todoApi.update(editingId, form);
        setNotice("Task updated successfully.");
      } else {
        await todoApi.add(form);
        setNotice("Task added successfully.");
      }
      setForm(emptyForm);
      setEditingId(null);
      setPage(1);
      await loadTasks();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
      setTimeout(() => setNotice(""), 2500);
    }
  };

  const toggleComplete = async (task) => {
    setError("");
    try {
      await todoApi.update(task._id, { completed: !task.completed });
      await loadTasks();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await todoApi.remove(id);
      setNotice("Task deleted.");
      await loadTasks();
    } catch (e) {
      setError(e.message);
    }
  };

  const edit = (task) => {
    setEditingId(task._id);
    setForm({ title: task.title, description: task.description || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app">
      <header className="hero">
        <div>
          <span className="eyebrow">PRODUCTIVITY</span>
          <h1>My Todo List</h1>
          <p>Create, manage and track your tasks from one simple dashboard.</p>
        </div>
        <div className="stats">
          <div>
            <strong>{tasks.length}</strong>
            <span>Visible tasks</span>
          </div>
          <div>
            <strong>{completed}</strong>
            <span>Completed</span>
          </div>
        </div>
      </header>

      <main>
        <section className="card form-card">
          <div className="section-title">
            <h2>{editingId ? "Edit task" : "Add a new task"}</h2>
            {editingId && (
              <button
                className="link-btn"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel edit
              </button>
            )}
          </div>
          <form onSubmit={submit}>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Task title"
              maxLength="120"
            />
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Description (optional)"
              rows="3"
            />
            <button className="primary" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update Task" : "Add Task"}
            </button>
          </form>
        </section>

        <section className="toolbar">
          <input
            className="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title..."
          />
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value="5">5 / page</option>
            <option value="10">10 / page</option>
            <option value="20">20 / page</option>
          </select>
        </section>

        {error && <div className="alert error">{error}</div>}
        {notice && <div className="alert success">{notice}</div>}

        <section className="card list-card">
          <div className="section-title">
            <h2>Tasks</h2>
            <span>{loading ? "Loading..." : `${tasks.length} shown`}</span>
          </div>
          {loading ? (
            <div className="empty">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="empty">
              <h3>No tasks found</h3>
              <p>Add a task or change your search.</p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <article
                  className={`task ${task.completed ? "done" : ""}`}
                  key={task._id}
                >
                  <button
                    className="check"
                    aria-label="Toggle complete"
                    onClick={() => toggleComplete(task)}
                  >
                    {task.completed ? "✓" : ""}
                  </button>
                  <div className="task-content">
                    <h3>{task.title}</h3>
                    {task.description && <p>{task.description}</p>}
                    <small>{new Date(task.createdAt).toLocaleString()}</small>
                  </div>
                  <div className="actions">
                    <button onClick={() => edit(task)}>Edit</button>
                    <button className="danger" onClick={() => remove(task._id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="pagination">
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Previous
          </button>
          <span>Page {page}</span>
          <button
            disabled={tasks.length < limit || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      </main>
    </div>
  );
}
export default App;
