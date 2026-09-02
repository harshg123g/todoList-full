import { useCallback, useEffect, useMemo, useState } from "react";
import { todoApi } from "../services/api";

const emptyForm = {
  title: "",
  description: "",
};

function Dashboard({ user, onLogout }) {
  // =========================
  // TODO STATE
  // =========================

  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  // =========================
  // FILTER STATE
  // =========================

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // =========================
  // UI STATE
  // =========================

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // =========================
  // LOAD TASKS
  // =========================

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await todoApi.getAll({
        search,
        sort,
        page,
        limit,
      });

      setTasks(data.allData || []);
    } catch (e) {
      setError(
        e.message || "Unable to load tasks."
      );
    } finally {
      setLoading(false);
    }
  }, [search, sort, page, limit]);

  // =========================
  // LOAD WHEN FILTER CHANGES
  // =========================

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // =========================
  // COMPLETED COUNT
  // =========================

  const completed = useMemo(() => {
    return tasks.filter(
      (task) => task.completed
    ).length;
  }, [tasks]);

  // =========================
  // SUBMIT TASK
  // =========================

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (editingId) {
        await todoApi.update(editingId, {
          title: form.title.trim(),
          description: form.description.trim(),
        });

        setNotice("Task updated successfully.");
      } else {
        await todoApi.add({
          title: form.title.trim(),
          description: form.description.trim(),
        });

        setNotice("Task added successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      setPage(1);

      await loadTasks();
    } catch (e) {
      setError(
        e.message || "Unable to save task."
      );
    } finally {
      setSaving(false);

      setTimeout(() => {
        setNotice("");
      }, 2500);
    }
  };

  // =========================
  // TOGGLE COMPLETE
  // =========================

  const toggleComplete = async (task) => {
    setError("");

    try {
      await todoApi.update(task._id, {
        completed: !task.completed,
      });

      await loadTasks();
    } catch (e) {
      setError(
        e.message || "Unable to update task."
      );
    }
  };

  // =========================
  // DELETE
  // =========================

  const remove = async (id) => {
    if (!window.confirm("Delete this task?")) {
      return;
    }

    setError("");

    try {
      await todoApi.remove(id);

      setNotice("Task deleted successfully.");

      await loadTasks();

      setTimeout(() => {
        setNotice("");
      }, 2500);
    } catch (e) {
      setError(
        e.message || "Unable to delete task."
      );
    }
  };

  // =========================
  // EDIT
  // =========================

  const edit = (task) => {
    setEditingId(task._id);

    setForm({
      title: task.title,
      description: task.description || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="app">

      {/* =========================
          HEADER
      ========================= */}

      <header className="dashboard-header">

        <div className="header-inner">

          <div className="dashboard-brand">
            <div className="mini-logo">✓</div>

            <div>
              <span className="eyebrow">
                PRODUCTIVITY
              </span>

              <h1>My Todo List</h1>
            </div>
          </div>

          <div className="user-area">

            <div className="user-info">
              <div className="avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <small>Welcome back</small>
                <strong>{user.name}</strong>
              </div>
            </div>

            <button
              className="logout-btn"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">

        {/* =========================
            WELCOME
        ========================= */}

        <section className="welcome-section">

          <div>
            <span className="eyebrow">
              YOUR DASHBOARD
            </span>

            <h2>
              Good to see you, {user.name?.split(" ")[0]} 👋
            </h2>

            <p>
              Stay organized and keep moving forward.
            </p>
          </div>

          <div className="stats">

            <div className="stat-card">
              <span className="stat-icon">📋</span>

              <div>
                <strong>{tasks.length}</strong>
                <span>Visible tasks</span>
              </div>
            </div>

            <div className="stat-card completed-stat">
              <span className="stat-icon">✓</span>

              <div>
                <strong>{completed}</strong>
                <span>Completed</span>
              </div>
            </div>

          </div>
        </section>

        {/* =========================
            FORM
        ========================= */}

        <section className="card form-card">

          <div className="section-title">

            <div>
              <span className="section-label">
                {editingId ? "EDIT TASK" : "NEW TASK"}
              </span>

              <h2>
                {editingId
                  ? "Update your task"
                  : "What needs to be done?"}
              </h2>
            </div>

            {editingId && (
              <button
                className="link-btn"
                type="button"
                onClick={cancelEdit}
              >
                Cancel edit
              </button>
            )}

          </div>

          <form onSubmit={submit}>

            <div className="form-row">

              <div className="input-group">
                <label>Task title</label>

                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Finish project report"
                  maxLength={120}
                  required
                />
              </div>

            </div>

            <div className="input-group">
              <label>Description</label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Add some details about this task..."
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="primary"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Task"
                  : "Add Task"}
            </button>

          </form>
        </section>

        {/* =========================
            TOOLBAR
        ========================= */}

        <section className="toolbar">

          <div className="search-wrapper">
            <span>⌕</span>

            <input
              className="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search tasks..."
            />
          </div>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="desc">
              Newest first
            </option>

            <option value="asc">
              Oldest first
            </option>
          </select>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </select>

        </section>

        {/* =========================
            ALERTS
        ========================= */}

        {error && (
          <div className="alert error">
            <span>!</span>
            {error}
          </div>
        )}

        {notice && (
          <div className="alert success">
            <span>✓</span>
            {notice}
          </div>
        )}

        {/* =========================
            TASK LIST
        ========================= */}

        <section className="card list-card">

          <div className="section-title">

            <div>
              <span className="section-label">
                YOUR TASKS
              </span>

              <h2>Task list</h2>
            </div>

            <span className="task-count">
              {loading
                ? "Loading..."
                : `${tasks.length} shown`}
            </span>

          </div>

          {loading ? (
            <div className="empty">
              <div className="spinner"></div>
              <h3>Loading tasks...</h3>
              <p>Please wait a moment.</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty">

              <div className="empty-icon">
                ✓
              </div>

              <h3>No tasks found</h3>

              <p>
                Add your first task or change your search.
              </p>
            </div>
          ) : (
            <div className="task-list">

              {tasks.map((task) => (
                <article
                  className={`task ${
                    task.completed ? "done" : ""
                  }`}
                  key={task._id}
                >

                  <button
                    className="check"
                    aria-label="Toggle complete"
                    onClick={() =>
                      toggleComplete(task)
                    }
                  >
                    {task.completed ? "✓" : ""}
                  </button>

                  <div className="task-content">

                    <h3>{task.title}</h3>

                    {task.description && (
                      <p>{task.description}</p>
                    )}

                    <small>
                      Created{" "}
                      {new Date(
                        task.createdAt
                      ).toLocaleString()}
                    </small>

                  </div>

                  <div className="actions">

                    <button
                      onClick={() => edit(task)}
                    >
                      Edit
                    </button>

                    <button
                      className="danger"
                      onClick={() =>
                        remove(task._id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>

        {/* =========================
            PAGINATION
        ========================= */}

        <div className="pagination">

          <button
            disabled={page === 1 || loading}
            onClick={() =>
              setPage((p) => p - 1)
            }
          >
            ← Previous
          </button>

          <span>
            Page <strong>{page}</strong>
          </span>

          <button
            disabled={
              tasks.length < limit || loading
            }
            onClick={() =>
              setPage((p) => p + 1)
            }
          >
            Next →
          </button>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;