import { CheckCircle, BarChart3, Star, Clock } from "lucide-react";

export default function StudentOverview() {
  const kpis = [
    { label: "Attendance Status", value: "TBA", color: "#0F6E56", bg: "#E1F5EE", icon: CheckCircle },
    { label: "Overall Performance", value: "-", color: "#1e40af", bg: "#EFF6FF", icon: BarChart3 },
    { label: "Quizzes Completed", value: "-", color: "#7c3aed", bg: "#F3F0FF", icon: Star },
    { label: "Classes Scheduled", value: "TBA", color: "#b45309", bg: "#FEF9EC", icon: Clock },
  ];

  const scores = [
    { sub: "Mathematics", exam: "Unit Test 3", status: "Pending Evaluation", date: "Recent" },
    { sub: "Physics", exam: "Mid-Term", status: "Awaiting Score", date: "Recent" },
    { sub: "Chemistry", exam: "Unit Test 3", status: "Evaluation in progress", date: "Recent" },
  ];

  const timetable = [
    { time: "Morning Batch", sub: "Mathematics", teacher: "Dr. R. Kumar", room: "B-2" },
    { time: "Noon Batch", sub: "Physics", teacher: "Ms. P. Sharma", room: "A-1" },
    { time: "Evening Batch", sub: "Chemistry", teacher: "Mr. A. Kapoor", room: "C-3" },
  ];

  return (
    <div className="font-sans text-gray-900">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white border border-border rounded-xl p-5 shadow-[0_1px_4px_rgba(0,0,0,.05)]">
            <div className="flex justify-between items-center mb-3">
              <div style={{ backgroundColor: k.bg }} className="w-9 h-9 rounded-lg flex items-center justify-center">
                <k.icon size={17} color={k.color} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-navy">{k.value}</p>
            <p className="text-muted text-xs mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Timetable */}
        <div className="bg-white border border-border rounded-xl p-5">
          <p className="font-bold text-navy text-[14px] mb-4">Upcoming Schedule</p>
          {timetable.map((t, i) => (
            <div key={i} className={`flex items-center gap-3 py-3 ${i < timetable.length - 1 ? "border-b border-border" : ""}`}>
              <div className={`w-1 h-10 rounded-sm shrink-0 ${i === 0 ? "bg-teal-600" : i === 1 ? "bg-purple-600" : "bg-amber-600"}`} />
              <div className="flex-1">
                <p className="font-semibold text-[13px] text-navy">{t.sub}</p>
                <p className="text-muted text-[11px]">{t.teacher} · Room {t.room}</p>
              </div>
              <span className="text-muted text-[11px] bg-surface px-2 py-1 rounded-md border border-border">{t.time}</span>
            </div>
          ))}
        </div>

        {/* Scores */}
        <div className="bg-white border border-border rounded-xl p-5">
          <p className="font-bold text-navy text-[14px] mb-4">Recent Evaluations</p>
          {scores.map((s, i) => (
            <div key={i} className={`flex items-center gap-3 py-2.5 ${i < scores.length - 1 ? "border-b border-border" : ""}`}>
              <div className="flex-1">
                <p className="font-semibold text-[13px] text-navy">{s.sub}</p>
                <p className="text-muted text-[11px]">{s.exam} · {s.date}</p>
              </div>
              <div className="text-right">
                <span className="font-semibold text-muted text-[13px] bg-surface px-2 py-1 rounded border border-border">
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
