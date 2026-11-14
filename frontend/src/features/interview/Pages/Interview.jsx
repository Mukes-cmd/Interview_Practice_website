import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import '../styles/Interview.scss';
import { useInterview } from '../Hoooks/userInterview';

// ── Navigation Items ──────────────────────────────────────

const NAV_ITEMS = [
    {
        id: 'technical',
        label: 'Technical Questions',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        )
    },
    {
        id: 'behavioral',
        label: 'Behavioral Questions',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        id: 'roadmap',
        label: 'Road Map',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
        )
    }
];

// ── Download helpers ──────────────────────────────────────

const buildReportMarkdown = ({ technical, behavioral, plan, skillGaps }) => {
    const qSection = (title, list) =>
        `## ${title}\n\n` +
        (list.length
            ? list
                  .map(
                      (q, i) =>
                          `### Q${i + 1}. ${q.question}\n\n` +
                          `**Intention:** ${q.intention}\n\n` +
                          `**Model Answer:** ${q.answer}\n`
                  )
                  .join('\n')
            : '_No questions available._\n');

    const roadmap =
        `## Preparation Road Map\n\n` +
        (plan.length
            ? plan
                  .map(
                      day =>
                          `### Day ${day.day}: ${day.focus}\n\n` +
                          (day.tasks ?? []).map(t => `- ${t}`).join('\n') +
                          '\n'
                  )
                  .join('\n')
            : '_No plan available._\n');

    const gaps =
        `## Skill Gaps\n\n` +
        (skillGaps.length
            ? skillGaps.map(g => `- ${g.skill} (${g.severity})`).join('\n')
            : '_None identified._') +
        '\n';

    return [
        '# Interview Preparation Report\n',
        qSection('Technical Questions', technical),
        qSection('Behavioral Questions', behavioral),
        roadmap,
        gaps
    ].join('\n');
};

const downloadFile = (content, filename, type = 'text/markdown') => {
    const blob = new Blob([content], { type: `${type};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
};

// ── Sub-components ────────────────────────────────────────

// Question Card

const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="q-card">
            <div
                className="q-card__header"
                onClick={() => setOpen(prev => !prev)}
            >
                <span className="q-card__index">Q{index + 1}</span>

                <p className="q-card__question">{item.question}</p>

                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </div>

            {open && (
                <div className="q-card__body">
                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--intention">
                            Intention
                        </span>
                        <p>{item.intention}</p>
                    </div>

                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--answer">
                            Model Answer
                        </span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// Roadmap Day

const RoadMapDay = ({ day }) => {
    return (
        <div className="roadmap-day">
            <div className="roadmap-day__header">
                <span className="roadmap-day__badge">Day {day.day}</span>
                <h3 className="roadmap-day__focus">{day.focus}</h3>
            </div>

            <ul className="roadmap-day__tasks">
                {(day.tasks ?? []).map((task, index) => (
                    <li key={index}>
                        <span className="roadmap-day__bullet" />
                        {task}
                    </li>
                ))}
            </ul>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────

const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical');
    const [error, setError] = useState(null);

    const { report, loading, getReportByid } = useInterview();
    const { interviewId } = useParams(); // must match the param name in your route

    useEffect(() => {
        if (!interviewId) return;
        setError(null);
        getReportByid(interviewId).catch((err) => {
            console.error(err);
            setError(err.response?.data?.message || "Could not load this report.");
        });
    }, [interviewId]);

    if (error) {
        return (
            <main className="loading-container">
                <h2>Something went wrong</h2>
                <p>{error}</p>
            </main>
        );
    }

    if (loading || !report) {
        return (
            <main className="loading-container">
                <div className="loader"></div>
                <h2>Loading your report...</h2>
            </main>
        );
    }

    // Field names exactly as saved by InterviewReport.model.js
    const technicalQuestions = report.technicalQuestion ?? [];
    const behavioralQuestions = report.behaviourQuestion ?? [];
    const preparationPlan = report.plan ?? [];
    const skillGaps = report.skillgaps ?? [];

    const questions =
        activeNav === 'technical' ? technicalQuestions : behavioralQuestions;

    const handleDownload = () => {
        const md = buildReportMarkdown({
            technical: technicalQuestions,
            behavioral: behavioralQuestions,
            plan: preparationPlan,
            skillGaps
        });
        downloadFile(md, `interview-report-${interviewId}.md`);
    };

    return (
        <div className="interview-page">
            <div className="interview-layout">

                {/* ── Left Navigation ── */}
                <nav className="interview-nav">
                    <div className="nav-content">
                        <p className="interview-nav__label">Sections</p>

                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${
                                    activeNav === item.id
                                        ? 'interview-nav__item--active'
                                        : ''
                                }`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className="interview-nav__icon">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </nav>

                <div className="interview-divider" />

                {/* ── Center Content ── */}
                <main className="interview-content">

                    {(activeNav === 'technical' || activeNav === 'behavioral') && (
                        <section>
                            <div className="content-header">
                                <h2>
                                    {activeNav === 'technical' ? 'Technical' : 'Behavioral'} Questions
                                </h2>
                                <span className="content-header__count">
                                    {questions.length} Questions
                                </span>
                            </div>

                            <div className="q-list">
                                {questions.map((item, index) => (
                                    <QuestionCard
                                        key={index}
                                        item={item}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className="content-header">
                                <h2>Preparation Road Map</h2>
                                <span className="content-header__count">
                                    {preparationPlan.length} Days Plan
                                </span>
                            </div>

                            <div className="roadmap-list">
                                {preparationPlan.map(day => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}

                </main>

                <div className="interview-divider" />

                {/* ── Right Sidebar ── */}
                <aside className="interview-sidebar">
                    <button
                        type="button"
                        className="download-btn"
                        onClick={handleDownload}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download Report
                    </button>

                    <div className="skill-gaps">
                        <p className="skill-gaps__label">Skill Gaps</p>

                        <div className="skill-gaps__list">
                            {skillGaps.map((gap, index) => (
                                <span
                                    key={index}
                                    className={`skill-tag skill-tag--${gap.severity}`}
                                >
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
};

export default Interview;