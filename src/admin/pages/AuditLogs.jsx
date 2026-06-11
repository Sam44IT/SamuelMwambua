import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const actions = [
  "",
  "LOGIN_SUCCESS",
  "LOGIN_FAIL",
  "LOGIN_OTP_SENT",
  "LOGIN_OTP_FAIL",
  "LOGIN_OTP_EXPIRED",
  "LOGIN_OTP_SEND_FAIL",
  "LOGOUT",
  "SESSION_EXPIRED",
  "UPDATE",
  "RESTORE",
  "DELETE",
];

const formatDate = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(value));
};

const formatJson = (value) => {
  if (value === null || value === undefined) return "null";
  return JSON.stringify(value, null, 2);
};

const AuditLogs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: "",
    action: "",
    from: "",
    to: "",
  });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "50");
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }, [filters, page]);

  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then((response) => response.json())
      .then((session) => {
        if (!session.authenticated) {
          navigate("/admin/login");
          return;
        }
        setIsCheckingSession(false);
      })
      .catch(() => navigate("/admin/login"));
  }, [navigate]);

  useEffect(() => {
    if (isCheckingSession) return;

    setIsLoading(true);
    fetch(`/api/admin/audit-logs?${queryString}`, { credentials: "include" })
      .then((response) => {
        if (response.status === 401) {
          navigate("/admin/login");
          throw new Error("Admin authentication required.");
        }
        if (!response.ok) throw new Error("Unable to load audit logs.");
        return response.json();
      })
      .then(({ logs: nextLogs }) => {
        setLogs(nextLogs || []);
        setSelectedLog(null);
      })
      .catch((error) => {
        if (error.message !== "Admin authentication required.") {
          toast.error(error.message || "Unable to load audit logs.");
        }
      })
      .finally(() => setIsLoading(false));
  }, [isCheckingSession, navigate, queryString]);

  const updateFilter = (key, value) => {
    setPage(1);
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setPage(1);
    setFilters({ category: "", action: "", from: "", to: "" });
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
    toast.success("Logged out successfully!");
    navigate("/admin/login");
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-navy-900 flex items-center justify-center">
        <div className="glass-card p-6 text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-accent-cyan mb-3"></i>
          <p className="text-gray-700 dark:text-gray-200">
            Checking admin session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard min-h-screen bg-gray-100 dark:bg-navy-900 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Audit Logs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Review admin access events and portfolio content changes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 transition-colors hover:border-accent-cyan hover:text-accent-cyan dark:border-navy-700 dark:text-gray-200"
            >
              <i className="fas fa-arrow-left mr-2"></i>Dashboard
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white transition-colors hover:bg-red-600"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>Logout
            </button>
          </div>
        </header>

        <section className="glass-card p-4 md:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Category
              </span>
              <select
                value={filters.category}
                onChange={(e) => updateFilter("category", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-navy-700"
              >
                <option value="">All</option>
                <option value="ACCESS">ACCESS</option>
                <option value="ACTION">ACTION</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Action
              </span>
              <select
                value={filters.action}
                onChange={(e) => updateFilter("action", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-navy-700"
              >
                {actions.map((action) => (
                  <option key={action || "all"} value={action}>
                    {action || "All"}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                From
              </span>
              <input
                type="date"
                value={filters.from}
                onChange={(e) => updateFilter("from", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-navy-700"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                To
              </span>
              <input
                type="date"
                value={filters.to}
                onChange={(e) => updateFilter("to", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-navy-700"
              />
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 font-semibold text-gray-700 transition-colors hover:border-accent-cyan hover:text-accent-cyan dark:border-navy-700 dark:text-gray-200"
              >
                Clear
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-navy-700">
                <thead className="bg-gray-50/80 dark:bg-navy-800/80">
                  <tr>
                    {[
                      "Timestamp",
                      "Category",
                      "Action",
                      "Admin",
                      "Section",
                      "IP Address",
                      "Status",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-navy-700">
                  {isLoading && (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-8 text-center text-gray-500 dark:text-gray-300"
                      >
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Loading audit logs...
                      </td>
                    </tr>
                  )}
                  {!isLoading &&
                    logs.map((log) => (
                      <tr
                        key={log.id}
                        onClick={() => setSelectedLog(log)}
                        className={`cursor-pointer transition-colors hover:bg-accent-cyan/10 ${
                          selectedLog?.id === log.id
                            ? "bg-accent-cyan/10"
                            : "bg-white/40 dark:bg-transparent"
                        }`}
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {log.event_category}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold">
                          {log.action}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {log.admin_username || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {log.section || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {log.ip_address || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              log.status === "SUCCESS"
                                ? "bg-green-500/10 text-green-600 dark:text-green-300"
                                : "bg-red-500/10 text-red-600 dark:text-red-300"
                            }`}
                          >
                            {log.status || "-"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  {!isLoading && logs.length === 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-8 text-center text-gray-500 dark:text-gray-300"
                      >
                        No audit logs match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-navy-700">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
                disabled={page === 1 || isLoading}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold disabled:opacity-50 dark:border-navy-700"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Page {page}
              </span>
              <button
                type="button"
                onClick={() => setPage((current) => current + 1)}
                disabled={logs.length < 50 || isLoading}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold disabled:opacity-50 dark:border-navy-700"
              >
                Next
              </button>
            </div>
          </div>

          <aside className="glass-card p-4 md:p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Log Detail
            </h2>
            {selectedLog ? (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Full Timestamp
                  </p>
                  <p>{formatDate(selectedLog.timestamp)}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    User Agent
                  </p>
                  <p className="break-words text-sm">
                    {selectedLog.user_agent || "-"}
                  </p>
                </div>
                {selectedLog.event_category === "ACTION" && (
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        Old Value
                      </p>
                      <pre className="mt-2 max-h-64 overflow-auto rounded-lg bg-navy-900 p-3 text-xs text-slate-100">
                        {formatJson(selectedLog.old_value)}
                      </pre>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        New Value
                      </p>
                      <pre className="mt-2 max-h-64 overflow-auto rounded-lg bg-navy-900 p-3 text-xs text-slate-100">
                        {formatJson(selectedLog.new_value)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Select a log row to inspect request metadata and content
                changes.
              </p>
            )}
          </aside>
        </section>
      </div>
    </div>
  );
};

export default AuditLogs;
