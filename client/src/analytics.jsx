import React, { useState, useEffect } from 'react';
import './analytics.css';

const Analytics = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [documents, setDocuments] = useState([]);
    const [insights, setInsights] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch documents
            const docsResponse = await fetch('http://localhost:5000/api/documents');
            const docsData = await docsResponse.json();

            // Fetch insights
            const insightsResponse = await fetch('http://localhost:5000/api/insights');
            const insightsData = await insightsResponse.json();

            // Fetch stats
            const statsResponse = await fetch('http://localhost:5000/api/stats');
            const statsData = await statsResponse.json();

            setDocuments(docsData);
            setInsights(insightsData.insights || []);
            setStats(statsData);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('No data available. Please upload documents first.');
            setLoading(false);
        }
    };

    const getFileExtension = (filename) => {
        const ext = filename.split('.').pop().toUpperCase();
        return ext === 'MD' ? 'Markdown' : ext;
    };

    const formatFileSize = (wordCount) => {
        return `${wordCount} words`;
    };

    const getDocumentStatus = (docId) => {
        // Check if document has contradictions or is obsolete
        // NOTE: Insights use 'nodes' array for contradictions and 'obsolete_doc' for obsolete
        const hasContradiction = insights.some(i =>
            i.type === 'contradiction' && i.nodes && i.nodes.includes(docId)
        );
        const isObsolete = insights.some(i =>
            i.type === 'obsolete' && i.obsolete_doc === docId
        );

        if (isObsolete) return 'obsolete';
        if (hasContradiction) return 'contradiction';
        return 'processed';
    };

    const getStatusLabel = (status) => {
        if (status === 'obsolete') return 'Obsolete';
        if (status === 'contradiction') return 'Has Conflicts';
        return 'Transmuted';
    };

    const filteredDocs = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="analytics-page">
                <div className="analytics-container">
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-color)' }}>
                        <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                        <p>Loading analytics...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="analytics-page">
                <div className="analytics-container">
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-color)' }}>
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.href = '/upload'}
                            style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
                        >
                            Upload Documents
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-page">
        <div className="analytics-container">
            <div className="analytics-header">
                <h1>Analytics Vault</h1>
                <input
                    type="text"
                    placeholder="Search documents..."
                    className="search-input"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Statistics Cards */}
            {stats && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        padding: '1.5rem',
                        background: 'rgba(147, 51, 234, 0.1)',
                        border: '1px solid rgba(147, 51, 234, 0.3)',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-color)' }}>
                            {stats.documents?.total || 0}
                        </div>
                        <div style={{ opacity: 0.7, marginTop: '0.5rem' }}>Total Documents</div>
                    </div>
                    <div style={{
                        padding: '1.5rem',
                        background: 'rgba(255, 77, 77, 0.1)',
                        border: '1px solid rgba(255, 77, 77, 0.3)',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff4d4d' }}>
                            {stats.insights?.contradictions || 0}
                        </div>
                        <div style={{ opacity: 0.7, marginTop: '0.5rem' }}>Contradictions</div>
                    </div>
                    <div style={{
                        padding: '1.5rem',
                        background: 'rgba(255, 215, 0, 0.1)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'rgb(218, 165, 32)' }}>
                            {stats.insights?.obsolete || 0}
                        </div>
                        <div style={{ opacity: 0.7, marginTop: '0.5rem' }}>Obsolete Docs</div>
                    </div>
                    <div style={{
                        padding: '1.5rem',
                        background: 'rgba(102, 126, 234, 0.1)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'rgb(102, 126, 234)' }}>
                            {stats.relationships?.total || 0}
                        </div>
                        <div style={{ opacity: 0.7, marginTop: '0.5rem' }}>Relationships</div>
                    </div>
                </div>
            )}

            <div className="file-list-wrapper">
                <div className="list-header">
                    <span>Document Title</span>
                    <span>Type</span>
                    <span>Size</span>
                    <span>Status</span>
                </div>

                <div className="scrollable-list">
                    {filteredDocs.map(doc => {
                        const status = getDocumentStatus(doc.id);
                        return (
                            <div key={doc.id} className="file-row">
                                <span className="file-name">{doc.title}</span>
                                <span className="file-type">{getFileExtension(doc.filename)}</span>
                                <span className="file-size">{formatFileSize(doc.word_count)}</span>
                                <span className={`file-status ${status}`}>
                                    {getStatusLabel(status)}
                                </span>
                            </div>
                        );
                    })}
                    {filteredDocs.length === 0 && (
                        <p className="no-results">
                            {documents.length === 0 ? 'No documents yet. Upload some to get started!' : 'No matches found.'}
                        </p>
                    )}
                </div>
            </div>

            {/* Insights Section */}
            {insights.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem', color: 'var(--text-color)' }}>🔍 Detected Insights</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {insights.map((insight, idx) => (
                            <div key={idx} style={{
                                padding: '1rem',
                                background: insight.type === 'contradiction'
                                    ? 'rgba(255, 77, 77, 0.1)'
                                    : 'rgba(255, 215, 0, 0.1)',
                                border: insight.type === 'contradiction'
                                    ? '1px solid rgba(255, 77, 77, 0.3)'
                                    : '1px solid rgba(255, 215, 0, 0.3)',
                                borderRadius: '8px',
                                color: 'var(--text-color)'
                            }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                    {insight.type === 'contradiction' ? '⚠️ Contradiction' : '📦 Obsolete Information'}
                                </div>
                                <div style={{ opacity: 0.8 }}>
                                    {insight.reason || insight.description || 'Detected by knowledge graph analysis'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default Analytics;