// import { useEffect, useMemo, useState } from "react";
// import { todoApi } from "./services/api";

// const emptyForm = { title: "", description: "" };

// function App() {
//   const [tasks, setTasks] = useState([]);
//   const [form, setForm] = useState(emptyForm);
//   const [editingId, setEditingId] = useState(null);
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("desc");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [notice, setNotice] = useState("");

//   const loadTasks = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const data = await todoApi.getAll({ search, sort, page, limit });
//       setTasks(data.allData || []);
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadTasks();
//   }, [search, sort, page, limit]);

//   const completed = useMemo(
//     () => tasks.filter((t) => t.completed).length,
//     [tasks],
//   );

//   const submit = async (e) => {
//     e.preventDefault();
//     if (!form.title.trim()) return setError("Title is required.");
//     setSaving(true);
//     setError("");
//     try {
//       if (editingId) {
//         await todoApi.update(editingId, form);
//         setNotice("Task updated successfully.");
//       } else {
//         await todoApi.add(form);
//         setNotice("Task added successfully.");
//       }
//       setForm(emptyForm);
//       setEditingId(null);
//       setPage(1);
//       await loadTasks();
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setSaving(false);
//       setTimeout(() => setNotice(""), 2500);
//     }
//   };

//   const toggleComplete = async (task) => {
//     setError("");
//     try {
//       await todoApi.update(task._id, { completed: !task.completed });
//       await loadTasks();
//     } catch (e) {
//       setError(e.message);
//     }
//   };

//   const remove = async (id) => {
//     if (!window.confirm("Delete this task?")) return;
//     try {
//       await todoApi.remove(id);
//       setNotice("Task deleted.");
//       await loadTasks();
//     } catch (e) {
//       setError(e.message);
//     }
//   };

//   const edit = (task) => {
//     setEditingId(task._id);
//     setForm({ title: task.title, description: task.description || "" });
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <div className="app">
//       <header className="hero">
//         <div>
//           <span className="eyebrow">PRODUCTIVITY</span>
//           <h1>My Todo List</h1>
//           <p>Create, manage and track your tasks from one simple dashboard.</p>
//         </div>
//         <div className="stats">
//           <div>
//             <strong>{tasks.length}</strong>
//             <span>Visible tasks</span>
//           </div>
//           <div>
//             <strong>{completed}</strong>
//             <span>Completed</span>
//           </div>
//         </div>
//       </header>

//       <main>
//         <section className="card form-card">
//           <div className="section-title">
//             <h2>{editingId ? "Edit task" : "Add a new task"}</h2>
//             {editingId && (
//               <button
//                 className="link-btn"
//                 onClick={() => {
//                   setEditingId(null);
//                   setForm(emptyForm);
//                 }}
//               >
//                 Cancel edit
//               </button>
//             )}
//           </div>
//           <form onSubmit={submit}>
//             <input
//               value={form.title}
//               onChange={(e) => setForm({ ...form, title: e.target.value })}
//               placeholder="Task title"
//               maxLength="120"
//             />
//             <textarea
//               value={form.description}
//               onChange={(e) =>
//                 setForm({ ...form, description: e.target.value })
//               }
//               placeholder="Description (optional)"
//               rows="3"
//             />
//             <button className="primary" disabled={saving}>
//               {saving ? "Saving..." : editingId ? "Update Task" : "Add Task"}
//             </button>
//           </form>
//         </section>

//         <section className="toolbar">
//           <input
//             className="search"
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setPage(1);
//             }}
//             placeholder="Search by title..."
//           />
//           <select
//             value={sort}
//             onChange={(e) => {
//               setSort(e.target.value);
//               setPage(1);
//             }}
//           >
//             <option value="desc">Newest first</option>
//             <option value="asc">Oldest first</option>
//           </select>
//           <select
//             value={limit}
//             onChange={(e) => {
//               setLimit(Number(e.target.value));
//               setPage(1);
//             }}
//           >
//             <option value="5">5 / page</option>
//             <option value="10">10 / page</option>
//             <option value="20">20 / page</option>
//           </select>
//         </section>

//         {error && <div className="alert error">{error}</div>}
//         {notice && <div className="alert success">{notice}</div>}

//         <section className="card list-card">
//           <div className="section-title">
//             <h2>Tasks</h2>
//             <span>{loading ? "Loading..." : `${tasks.length} shown`}</span>
//           </div>
//           {loading ? (
//             <div className="empty">Loading tasks...</div>
//           ) : tasks.length === 0 ? (
//             <div className="empty">
//               <h3>No tasks found</h3>
//               <p>Add a task or change your search.</p>
//             </div>
//           ) : (
//             <div className="task-list">
//               {tasks.map((task) => (
//                 <article
//                   className={`task ${task.completed ? "done" : ""}`}
//                   key={task._id}
//                 >
//                   <button
//                     className="check"
//                     aria-label="Toggle complete"
//                     onClick={() => toggleComplete(task)}
//                   >
//                     {task.completed ? "✓" : ""}
//                   </button>
//                   <div className="task-content">
//                     <h3>{task.title}</h3>
//                     {task.description && <p>{task.description}</p>}
//                     <small>{new Date(task.createdAt).toLocaleString()}</small>
//                   </div>
//                   <div className="actions">
//                     <button onClick={() => edit(task)}>Edit</button>
//                     <button className="danger" onClick={() => remove(task._id)}>
//                       Delete
//                     </button>
//                   </div>
//                 </article>
//               ))}
//             </div>
//           )}
//         </section>

//         <div className="pagination">
//           <button
//             disabled={page === 1 || loading}
//             onClick={() => setPage((p) => p - 1)}
//           >
//             ← Previous
//           </button>
//           <span>Page {page}</span>
//           <button
//             disabled={tasks.length < limit || loading}
//             onClick={() => setPage((p) => p + 1)}
//           >
//             Next →
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// }
// export default App;


import { useEffect, useMemo, useState } from "react";
import { todoApi, authApi } from "./services/api";

const emptyForm = {
  title: "",
  description: "",
};

function App() {
  // =========================
  // TODO STATE
  // =========================

  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // =========================
  // AUTH STATE
  // =========================

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [authMode, setAuthMode] = useState("login");

  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // =========================
  // LOAD TASKS
  // =========================

  const loadTasks = async () => {
    if (!user) return;

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
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CHECK LOGIN
  // =========================

  useEffect(() => {
    const checkUser = async () => {
      try {
        const data = await authApi.me();

        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkUser();
  }, []);

  // =========================
  // LOAD TASKS AFTER LOGIN
  // =========================

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user, search, sort, page, limit]);

  // =========================
  // COMPLETED COUNT
  // =========================

  const completed = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  // =========================
  // ADD / UPDATE TASK
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
      setError(e.message);
    }
  };

  // =========================
  // DELETE TASK
  // =========================

  const remove = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await todoApi.remove(id);

      setNotice("Task deleted successfully.");

      await loadTasks();

      setTimeout(() => {
        setNotice("");
      }, 2500);
    } catch (e) {
      setError(e.message);
    }
  };

  // =========================
  // EDIT TASK
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
  // LOGIN / SIGNUP
  // =========================

  const handleAuth = async (e) => {
    e.preventDefault();

    setError("");
    setNotice("");

    try {
      let data;

      if (authMode === "signup") {
        data = await authApi.signup(authForm);
      } else {
        data = await authApi.login({
          email: authForm.email,
          password: authForm.password,
        });
      }

      setUser(data.user);

      setAuthForm({
        name: "",
        email: "",
        password: "",
      });

      setNotice(
        authMode === "signup"
          ? "Account created successfully."
          : "Login successful."
      );
    } catch (e) {
      setError(e.message);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    try {
      await authApi.logout();

      setUser(null);
      setTasks([]);
      setForm(emptyForm);
      setEditingId(null);

      setSearch("");
      setPage(1);

      setError("");
      setNotice("");
    } catch (e) {
      setError(e.message);
    }
  };

  // =========================
  // AUTH LOADING
  // =========================

  if (authLoading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>Loading...</h2>
          <p>Checking your account.</p>
        </div>
      </div>
    );
  }

  // =========================
  // LOGIN / SIGNUP PAGE
  // =========================

  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <span className="eyebrow">TODO LIST</span>

            <h1>
              {authMode === "login"
                ? "Welcome Back"
                : "Create Account"}
            </h1>

            <p>
              {authMode === "login"
                ? "Login to manage your tasks."
                : "Create an account to start managing your tasks."}
            </p>
          </div>

          {error && (
            <div className="alert error">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth}>
            {authMode === "signup" && (
              <input
                type="text"
                placeholder="Your name"
                value={authForm.name}
                onChange={(e) =>
                  setAuthForm({
                    ...authForm,
                    name: e.target.value,
                  })
                }
                required
              />
            )}

            <input
              type="email"
              placeholder="Email address"
              value={authForm.email}
              onChange={(e) =>
                setAuthForm({
                  ...authForm,
                  email: e.target.value,
                })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={authForm.password}
              onChange={(e) =>
                setAuthForm({
                  ...authForm,
                  password: e.target.value,
                })
              }
              minLength="6"
              required
            />

            <button
              type="submit"
              className="primary"
            >
              {authMode === "login"
                ? "Login"
                : "Create Account"}
            </button>
          </form>

          <div className="auth-switch">
            {authMode === "login" ? (
              <>
                <span>Don't have an account?</span>

                <button
                  type="button"
                  className="switch-auth"
                  onClick={() => {
                    setAuthMode("signup");
                    setError("");
                  }}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <span>Already have an account?</span>

                <button
                  type="button"
                  className="switch-auth"
                  onClick={() => {
                    setAuthMode("login");
                    setError("");
                  }}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN TODO APPLICATION
  // =========================

  return (
    <div className="app">
      {/* =========================
          HEADER
      ========================= */}

      <header className="hero">
        <div>
          <span className="eyebrow">PRODUCTIVITY</span>

          <h1>My Todo List</h1>

          <p>
            Create, manage and track your tasks
            from one simple dashboard.
          </p>

          <div className="user-area">
            <span>
              Hi, <strong>{user.name}</strong>
            </span>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
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
        {/* =========================
            ADD / EDIT FORM
        ========================= */}

        <section className="card form-card">
          <div className="section-title">
            <h2>
              {editingId
                ? "Edit task"
                : "Add a new task"}
            </h2>

            {editingId && (
              <button
                className="link-btn"
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                  setError("");
                }}
              >
                Cancel edit
              </button>
            )}
          </div>

          <form onSubmit={submit}>
            <input
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              placeholder="Task title"
              maxLength="120"
              required
            />

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              placeholder="Description (optional)"
              rows="3"
            />

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
            SEARCH / FILTER
        ========================= */}

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
            <option value="5">5 / page</option>
            <option value="10">10 / page</option>
            <option value="20">20 / page</option>
          </select>
        </section>

        {/* =========================
            ALERTS
        ========================= */}

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}

        {notice && (
          <div className="alert success">
            {notice}
          </div>
        )}

        {/* =========================
            TASK LIST
        ========================= */}

        <section className="card list-card">
          <div className="section-title">
            <h2>Tasks</h2>

            <span>
              {loading
                ? "Loading..."
                : `${tasks.length} shown`}
            </span>
          </div>

          {loading ? (
            <div className="empty">
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty">
              <h3>No tasks found</h3>

              <p>
                Add a task or change your search.
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
                  {/* COMPLETE BUTTON */}

                  <button
                    className="check"
                    aria-label="Toggle complete"
                    onClick={() =>
                      toggleComplete(task)
                    }
                  >
                    {task.completed ? "✓" : ""}
                  </button>

                  {/* TASK INFORMATION */}

                  <div className="task-content">
                    <h3>{task.title}</h3>

                    {task.description && (
                      <p>{task.description}</p>
                    )}

                    <small>
                      {new Date(
                        task.createdAt
                      ).toLocaleString()}
                    </small>
                  </div>

                  {/* ACTIONS */}

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
            disabled={
              page === 1 || loading
            }
            onClick={() =>
              setPage((p) => p - 1)
            }
          >
            ← Previous
          </button>

          <span>Page {page}</span>

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

export default App;