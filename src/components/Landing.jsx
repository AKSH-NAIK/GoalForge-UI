import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => {
    const navigate = useNavigate();

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const cardVariants = {
        hover: {
            y: -5,
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeOut" }
        }
    };

    return (
        <div style={{ background: 'var(--color-bg)', minHeight: '100vh', color: 'var(--color-text)' }}>
            {/* Navbar */}
            <header className="navbar" style={{ maxWidth: '1100px', margin: '20px auto' }}>
                <div className="nav-brand">
                    <img src="/favicon.svg" alt="GoalForge Logo" className="nav-logo" />
                    goal<span>forge</span>
                </div>
                <div className="nav-actions">
                    <button className="btn-ghost" onClick={() => navigate('/auth')}>Sign In</button>
                    <button className="btn-primary" onClick={() => navigate('/auth')}>Get Started</button>
                </div>
            </header>

            {/* Hero Section */}
            <motion.section
                className="hero"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                style={{ padding: '80px 20px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}
            >
                <motion.h1
                    variants={itemVariants}
                    className="text-gradient"
                    style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', lineHeight: 1.1, marginBottom: '24px' }}
                >
                    Turn your goals into structured weekly roadmaps with AI
                </motion.h1>
                <motion.p
                    variants={itemVariants}
                    style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '40px', maxWidth: '650px', margin: '0 auto 40px' }}
                >
                    No more confusion. Just clear execution. GoalForge analyzes your ambitions and builds a step-by-step path to success.
                </motion.p>
                <motion.div variants={itemVariants} style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }} onClick={() => navigate('/auth')}>
                        Get Started
                    </button>
                    <button className="btn-secondary" style={{ padding: '16px 32px', fontSize: '1.1rem' }} onClick={() => navigate('/auth')}>
                        Generate Roadmap
                    </button>
                </motion.div>
            </motion.section>

            {/* Features Section */}
            <section style={{ padding: '100px 20px', maxWidth: '1100px', margin: '0 auto' }}>
                <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <motion.div
                        className="section-glass"
                        variants={cardVariants}
                        whileHover="hover"
                        style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}
                    >
                        <div style={{ fontSize: '2rem' }}>🤖</div>
                        <h3>AI-generated roadmap</h3>
                        <p style={{ color: 'var(--color-text-muted)' }}>Advanced AI models break down your complex goals into manageable, bite-sized weekly milestones.</p>
                    </motion.div>

                    <motion.div
                        className="section-glass"
                        variants={cardVariants}
                        whileHover="hover"
                        style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}
                    >
                        <div style={{ fontSize: '2rem' }}>📅</div>
                        <h3>Weekly execution system</h3>
                        <p style={{ color: 'var(--color-text-muted)' }}>Stay focused with a dedicated weekly view. Know exactly what to learn and what to build every single day.</p>
                    </motion.div>

                    <motion.div
                        className="section-glass"
                        variants={cardVariants}
                        whileHover="hover"
                        style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}
                    >
                        <div style={{ fontSize: '2rem' }}>✅</div>
                        <h3>Task tracking</h3>
                        <p style={{ color: 'var(--color-text-muted)' }}>Comprehensive checklist for every week. Mark your progress and watch your roadmap come to life.</p>
                    </motion.div>
                </div>
            </section>

            {/* Demo Section */}
            <section style={{ padding: '100px 20px', maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '48px', fontSize: '2.5rem' }} className="text-gradient">Experience the GoalForge</h2>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="week-card section-glass"
                    style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto', cursor: 'default' }}
                >
                    <div className="week-badge">week 1</div>
                    <div className="week-card__header" style={{ marginBottom: 'var(--space-lg)' }}>
                        <h3 style={{ fontSize: '1.4rem', color: 'var(--color-primary-light)' }}>
                            Foundations of Modern Web Architecture
                        </h3>
                    </div>
                    <div className="week-grid">
                        <div className="content-section">
                            <h4><span>📚</span> core concepts</h4>
                            <ul className="content-list">
                                <li><span style={{ color: 'var(--color-primary-light)', fontWeight: 'bold' }}>•</span> React Components & Props</li>
                                <li><span style={{ color: 'var(--color-primary-light)', fontWeight: 'bold' }}>•</span> State Management Basics</li>
                                <li><span style={{ color: 'var(--color-primary-light)', fontWeight: 'bold' }}>•</span> Semantic HTML5 Structure</li>
                            </ul>
                        </div>
                        <div className="content-section">
                            <h4><span>✅</span> practical tasks</h4>
                            <ul className="content-list">
                                <li className="completed">
                                    <div className="custom-checkbox checked" />
                                    <span className="task-text">Initialize project with Vite</span>
                                </li>
                                <li>
                                    <div className="custom-checkbox" />
                                    <span className="task-text">Build first functional component</span>
                                </li>
                                <li>
                                    <div className="custom-checkbox" />
                                    <span className="task-text">Implement basic navigation</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: '120px 20px', textAlign: 'center' }}>
                <div className="section-glass" style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 40px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Start building your roadmap today</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px', fontSize: '1.1rem' }}>
                        Join thousands of users who have turned their dreams into reality with GoalForge.
                    </p>
                    <button
                        className="btn-primary"
                        style={{ padding: '16px 40px', fontSize: '1.2rem' }}
                        onClick={() => navigate('/auth')}
                    >
                        Get Started for Free
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-dim)', fontSize: '0.9rem', borderTop: '1px solid var(--color-border)' }}>
                <p>&copy; {new Date().getFullYear()} GoalForge AI. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Landing;
