import React, { useState, useEffect, useMemo } from 'react';
import {
    BookOpen, CheckCircle, Clock, GraduationCap, Search, LogOut, User,
    BarChart3, AlertCircle, RefreshCw, ChevronDown, ChevronUp, Filter,
    Shield, ShieldAlert, Zap
} from 'lucide-react';

// --- PLAN DE ESTUDIOS COMPLETO (2023) ---
const FULL_PLAN = [
    { year: 1, name: "Algoritmos y Estructuras de Datos" },
    { year: 1, name: "Análisis Matemático I" },
    { year: 1, name: "Sistemas y Procesos de Negocio" },
    { year: 1, name: "Inglés I" },
    { year: 1, name: "Física I" },
    { year: 1, name: "Lógica y Estructuras Discretas" },
    { year: 1, name: "Álgebra y Geometría Analítica" },
    { year: 2, name: "Análisis de Sistemas de Información" },
    { year: 2, name: "Arquitectura de Computadoras" },
    { year: 2, name: "Ingeniería y Sociedad" },
    { year: 2, name: "Sintaxis y Semántica de los Lenguajes" },
    { year: 2, name: "Análisis Matemático II" },
    { year: 2, name: "Física II" },
    { year: 2, name: "Inglés II" },
    { year: 2, name: "Paradigmas de Programación" },
    { year: 2, name: "Sistemas Operativos" },
    { year: 3, name: "Diseño de Sistemas de Información" },
    { year: 3, name: "Química para Ingeniería en Sistemas de Información" },
    { year: 3, name: "Seminario Integrador" },
    { year: 3, name: "Bases de Datos" },
    { year: 3, name: "Complejidad y Técnicas de Diseño de Algoritmos" },
    { year: 3, name: "Comunicación de Datos" },
    { year: 3, name: "Economía" },
    { year: 3, name: "Análisis Numérico" },
    { year: 3, name: "Desarrollo de Software" },
    { year: 3, name: "Planificación (Elec.)" },
    { year: 3, name: "Probabilidad y Estadística" },
    { year: 3, name: "Sistemas de Gestión de Bases de Datos (Electiva)" },
    { year: 4, name: "Administración de Sistemas de Información" },
    { year: 4, name: "Ingeniería y Calidad de Software" },
    { year: 4, name: "Investigación Operativa" },
    { year: 4, name: "Legislación" },
    { year: 4, name: "Simulación" },
    { year: 4, name: "Agilidad Avanzada (Elec.)" },
    { year: 4, name: "Aspectos Avanzados de Calidad de Software" },
    { year: 4, name: "Redes de Datos" },
    { year: 4, name: "Sistemas de Información Geográficos (Electiva)" },
    { year: 4, name: "Tecnologías para la Automatización" },
    { year: 5, name: "Proyecto Final" },
    { year: 5, name: "Análisis de Datos Empresariales (Elec.)" },
    { year: 5, name: "Formación de Emprendedores (Elec.)" },
    { year: 5, name: "Gestión Gerencial" },
    { year: 5, name: "Seguridad en los Sistemas de Información" },
    { year: 5, name: "Sistemas de Gestión" },
    { year: 5, name: "Práctica Profesional Supervisada" },
    { year: 5, name: "Aspectos Avanzados de Redes de Información" },
    { year: 5, name: "Auditoría e Informática Forense (Elec.)" },
    { year: 5, name: "Ciencia de Datos" },
    { year: 5, name: "DevOps - Cultura, Herramientas y Procesos" },
    { year: 5, name: "Fundamentos de Ciberseguridad (Elec.)" },
    { year: 5, name: "Inteligencia Artificial" },
];

// --- STATUS DEFINITIONS ---
const STATUS_CONFIG = {
    APROBADA: { label: "Aprobada", color: "bg-emerald-500", text: "text-emerald-700", bgLight: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle },
    REGULAR: { label: "Regular", color: "bg-amber-500", text: "text-amber-700", bgLight: "bg-amber-50", border: "border-amber-200", icon: Clock },
    CURSANDO: { label: "Cursando", color: "bg-blue-500", text: "text-blue-700", bgLight: "bg-blue-50", border: "border-blue-200", icon: Zap },
    LIBRE: { label: "Libre", color: "bg-red-500", text: "text-red-700", bgLight: "bg-red-50", border: "border-red-200", icon: ShieldAlert },
    PENDIENTE: { label: "Pendiente", color: "bg-slate-300", text: "text-slate-500", bgLight: "bg-slate-50", border: "border-slate-200", icon: BookOpen },
};

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [academicData, setAcademicData] = useState(null);

    // --- LOGIN LOGIC ---
    const handleLogin = async (username, password) => {
        setLoading(true);
        setError(null);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/student/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error('Credenciales inválidas o error en el servidor');

            const data = await response.json();
            const subjects = data.data || data;

            setUser({
                username,
                cached: data.cached || false,
                auth_status: data.auth_status || 'OK',
                last_updated: data.last_updated // Store timestamp
            });
            setAcademicData(subjects);

        } catch (err) {
            console.warn("Login error:", err);
            setError("Error de conexión o credenciales inválidas.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setUser(null);
        setAcademicData(null);
        setError(null);
    };

    if (!user) return <LoginPage onLogin={handleLogin} loading={loading} error={error} />;

    return (
        <Dashboard
            user={user}
            data={academicData}
            onLogout={handleLogout}
            onUpdatePassword={(username, newPassword) => handleLogin(username, newPassword)}
            onReload={() => handleLogin(user.username, '')} // Re-fetch (password not needed if cached, but API requires it... wait, API requires password for POST. If we don't have it, we can't re-login easily without storing it. 
        // Actually, if we just want to refresh from DB, we can use a GET endpoint if we had one for data. 
        // But we don't. We need the password to call POST /api/student/status.
        // Issue: We don't store the password in state for security. 
        // Workaround: The user is already logged in. If we want to refresh, we might need to prompt for password or store it in memory (risky but common in SPA).
        // BETTER: The polling endpoint tells us new data is ready. We can add a GET /api/student/data/<username> that returns data WITHOUT password if we trust the frontend (not secure).
        // OR: We just ask the user to re-login? No, that's annoying.
        // OR: We store the password in memory (React state) while the user is logged in.
        />
    );
}

// Wait, I need to store the password in memory to allow re-fetching without re-entering it.
// Let's modify App to store password in user state (it's client-side memory, acceptable for this session).

function AppWithPassword() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [academicData, setAcademicData] = useState(null);
    const [currentPassword, setCurrentPassword] = useState(''); // Store password for refresh

    const handleLogin = async (username, password) => {
        setLoading(true);
        setError(null);
        setCurrentPassword(password); // Save it

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/student/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error('Credenciales inválidas o error en el servidor');

            const data = await response.json();
            const subjects = data.data || data;

            setUser({
                username,
                cached: data.cached || false,
                auth_status: data.auth_status || 'OK',
                last_updated: data.last_updated
            });
            setAcademicData(subjects);

        } catch (err) {
            console.warn("Login error:", err);
            setError("Error de conexión o credenciales inválidas.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setUser(null);
        setAcademicData(null);
        setError(null);
        setCurrentPassword('');
    };

    if (!user) return <LoginPage onLogin={handleLogin} loading={loading} error={error} />;

    return (
        <Dashboard
            user={user}
            data={academicData}
            onLogout={handleLogout}
            onUpdatePassword={(username, newPassword) => handleLogin(username, newPassword)}
            onReload={() => handleLogin(user.username, currentPassword)}
        />
    );
}

// --- LOGIN PAGE ---
function LoginPage({ onLogin, loading, error }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username && password) onLogin(username, password);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10">
                <div className="p-8 text-center">
                    <div className="mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform rotate-3 hover:rotate-6 transition-transform">
                        <GraduationCap className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Sysacad Portal</h1>
                    <p className="text-blue-200 text-sm">Accede a tu historial académico</p>
                </div>

                <div className="p-8 pt-0">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">Legajo</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-blue-300 group-focus-within:text-white transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Ej: 28410"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">Contraseña</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Shield className="h-5 w-5 text-blue-300 group-focus-within:text-white transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-4 rounded-xl flex items-center animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-900/20 transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                                    Conectando...
                                </>
                            ) : (
                                'Ingresar'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// --- DASHBOARD ---
function Dashboard({ user, data, onLogout, onUpdatePassword, onReload }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showReloadButton, setShowReloadButton] = useState(false);
    const [filterStatus, setFilterStatus] = useState('ALL');

    // Polling Logic
    useEffect(() => {
        if (user.cached) {
            const intervalId = setInterval(async () => {
                try {
                    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                    const response = await fetch(`${API_URL}/api/student/status/${user.username}`);
                    if (response.ok) {
                        const statusData = await response.json();

                        // Check Auth Error
                        if (statusData.auth_status === 'AUTH_ERROR') {
                            setShowPasswordModal(true);
                            clearInterval(intervalId);
                            return;
                        }

                        // Check for New Data (Timestamp comparison)
                        if (statusData.last_updated && user.last_updated && statusData.last_updated !== user.last_updated) {
                            setShowReloadButton(true);
                            clearInterval(intervalId);
                        }
                    }
                } catch (e) { console.error("Polling error", e); }
            }, 5000);
            return () => clearInterval(intervalId);
        }
    }, [user]);

    // --- DATA PROCESSING ---
    const processedData = useMemo(() => {
        if (!data) return [];

        return FULL_PLAN.map(planSubject => {
            const found = data.find(d =>
                d.subject.toLowerCase() === planSubject.name.toLowerCase() ||
                d.subject.toLowerCase().includes(planSubject.name.toLowerCase()) ||
                planSubject.name.toLowerCase().includes(d.subject.toLowerCase())
            );

            let statusKey = 'PENDIENTE';
            let rawStatus = found ? found.status : 'Pendiente';

            if (found) {
                const s = found.status.toLowerCase();
                if (s.includes('aprobada')) statusKey = 'APROBADA';
                else if (s.includes('regular')) statusKey = 'REGULAR';
                else if (s.includes('cursa')) statusKey = 'CURSANDO';
                else if (s.includes('libre')) statusKey = 'LIBRE';
            }

            return {
                ...planSubject,
                statusKey,
                rawStatus,
                subject: planSubject.name
            };
        });
    }, [data]);

    // --- STATS ---
    const stats = useMemo(() => {
        const counts = { APROBADA: 0, REGULAR: 0, CURSANDO: 0, LIBRE: 0, PENDIENTE: 0 };
        processedData.forEach(item => counts[item.statusKey]++);

        const total = FULL_PLAN.length;
        const percent = Math.round((counts.APROBADA / total) * 100);

        return { ...counts, total, percent };
    }, [processedData]);

    // --- FILTERING ---
    const filteredData = useMemo(() => {
        return processedData.filter(item => {
            const matchesSearch = item.subject.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === 'ALL' || item.statusKey === filterStatus;
            return matchesSearch && matchesFilter;
        });
    }, [processedData, searchTerm, filterStatus]);

    // --- GROUP BY YEAR ---
    const groupedData = useMemo(() => {
        const groups = {};
        filteredData.forEach(item => {
            if (!groups[item.year]) groups[item.year] = [];
            groups[item.year].push(item);
        });
        return groups;
    }, [filteredData]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 relative">
            {showPasswordModal && (
                <ChangePasswordModal
                    username={user.username}
                    onUpdate={onUpdatePassword}
                    onClose={() => setShowPasswordModal(false)}
                />
            )}

            {/* Floating Reload Button */}
            {showReloadButton && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-500">
                    <button
                        onClick={onReload}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 font-bold transition-all hover:scale-105"
                    >
                        <RefreshCw className="w-5 h-5 animate-spin-slow" />
                        Nuevos datos disponibles
                    </button>
                </div>
            )}

            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg shadow-md">
                                <BarChart3 className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-800 leading-tight">Mi Carrera</h1>
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-slate-500 font-medium">Ingeniería en Sistemas</span>
                                    {user.cached && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide">Cache</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-semibold text-slate-700">{user.username}</p>
                                <p className="text-xs text-slate-400">Alumno Regular</p>
                            </div>
                            <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Progress Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Progress Circle */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden lg:col-span-1">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-blue-500"></div>
                        <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Progreso Total</h2>
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={552} strokeDashoffset={552 - (552 * stats.percent) / 100} className="text-blue-600 transition-all duration-1000 ease-out" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-bold text-slate-800 tracking-tighter">{stats.percent}%</span>
                                <span className="text-sm text-slate-400 font-medium mt-1">Completado</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard label="Aprobadas" value={stats.APROBADA} total={stats.total} config={STATUS_CONFIG.APROBADA} />
                        <StatCard label="Regularizadas" value={stats.REGULAR} total={stats.total} config={STATUS_CONFIG.REGULAR} />
                        <StatCard label="Cursando" value={stats.CURSANDO} total={stats.total} config={STATUS_CONFIG.CURSANDO} />
                        <StatCard label="Pendientes" value={stats.PENDIENTE} total={stats.total} config={STATUS_CONFIG.PENDIENTE} />
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar materia..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                        <FilterButton label="Todas" active={filterStatus === 'ALL'} onClick={() => setFilterStatus('ALL')} />
                        {Object.keys(STATUS_CONFIG).map(key => (
                            <FilterButton
                                key={key}
                                label={STATUS_CONFIG[key].label}
                                active={filterStatus === key}
                                onClick={() => setFilterStatus(key)}
                                color={STATUS_CONFIG[key].text}
                            />
                        ))}
                    </div>
                </div>

                {/* Subjects List (Grouped by Year) */}
                <div className="space-y-6">
                    {Object.keys(groupedData).length > 0 ? (
                        Object.keys(groupedData).sort().map(year => (
                            <div key={year} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                                    <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">
                                        {year}°
                                    </div>
                                    <h3 className="font-bold text-slate-700">Año {year}</h3>
                                    <span className="text-xs text-slate-400 font-medium ml-auto">{groupedData[year].length} materias</span>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {groupedData[year].map((subject, idx) => (
                                        <SubjectRow key={idx} subject={subject} />
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-slate-400">
                            <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No se encontraron materias</p>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}

// --- COMPONENTS ---

function StatCard({ label, value, total, config }) {
    const Icon = config.icon;
    return (
        <div className={`bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 p-3 opacity-10`}>
                <Icon className={`w-16 h-16 ${config.text}`} />
            </div>
            <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 rounded-lg ${config.bgLight} ${config.text}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
            </div>
            <div>
                <span className="text-3xl font-bold text-slate-800">{value}</span>
                <span className="text-xs text-slate-400 ml-1">/ {total}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                    className={`h-full ${config.color}`}
                    style={{ width: `${(value / total) * 100}%` }}
                ></div>
            </div>
        </div>
    );
}

function SubjectRow({ subject }) {
    const config = STATUS_CONFIG[subject.statusKey];
    const Icon = config.icon;

    return (
        <div className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
            <div className="flex items-start gap-4">
                <div className={`mt-1 p-2 rounded-full ${config.bgLight} ${config.text} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4" />
                </div>
                <div>
                    <h4 className="font-semibold text-slate-800 text-sm sm:text-base">{subject.subject}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Plan {subject.plan}</p>
                </div>
            </div>
            <div className="flex items-center gap-3 pl-12 sm:pl-0">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${config.bgLight} ${config.text} ${config.border} flex items-center gap-1.5`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${config.color}`}></span>
                    {config.label}
                </span>
            </div>
        </div>
    );
}

function FilterButton({ label, active, onClick, color }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${active
                ? 'bg-slate-800 text-white shadow-lg shadow-slate-200'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
        >
            {label}
        </button>
    );
}

function ChangePasswordModal({ username, onUpdate, onClose }) {
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await onUpdate(username, newPassword);
            onClose();
        } catch (err) {
            setError("Error al actualizar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">Actualizar Contraseña</h2>
                    <p className="text-sm text-slate-500 mt-1">Tu contraseña de Sysacad ha cambiado. Ingrésala nuevamente para sincronizar.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                        placeholder="Nueva contraseña"
                        required
                    />
                    {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                    <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2.5 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-bold transition-colors">Cancelar</button>
                        <button type="submit" disabled={loading} className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-200 transition-all disabled:opacity-50">
                            {loading ? '...' : 'Actualizar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
