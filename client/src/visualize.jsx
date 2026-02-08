import React, { useState, useEffect } from 'react';
import './visualize.css';

const Visualize = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGraphData();
  }, []);

  const fetchGraphData = async () => {
    setLoading(true);
    try {
      // Fetch graph data
      const graphResponse = await fetch('http://localhost:5000/api/graph');
      const graphJson = await graphResponse.json();

      // Fetch documents for labels
      const docsResponse = await fetch('http://localhost:5000/api/documents');
      const docsData = await docsResponse.json();

      // Process graph data into visualization format
      const processedData = processGraphData(graphJson, docsData);
      setGraphData(processedData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching graph:', err);
      setError('No graph data available. Please upload documents first.');
      setLoading(false);
    }
  };

  const processGraphData = (graph, docs) => {
    // Create nodes from documents
    const nodeCount = docs.length;
    const radius = 280;
    const centerX = 400;
    const centerY = 340;

    const nodes = docs.map((doc, index) => {
      // Arrange nodes in a circle
      const angle = (index / nodeCount) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Calculate impact score based on connections
      // NOTE: Graph uses 'source' and 'target', not 'from' and 'to'
      const connections = graph.edges.filter(
        edge => edge.source === doc.id || edge.target === doc.id
      ).length;

      return {
        id: doc.id,
        x: x,
        y: y,
        label: doc.title.length > 30 ? doc.title.substring(0, 30) + '...' : doc.title,
        fullTitle: doc.title,
        impact: Math.min(5, Math.max(1, connections)),
        wordCount: doc.word_count,
        date: doc.date,
        connections: connections
      };
    });

    // Normalize edges to use 'from' and 'to' for consistency
    const normalizedEdges = (graph.edges || []).map(edge => ({
      from: edge.source,
      to: edge.target,
      type: edge.type,
      similarity: edge.similarity
    }));

    return {
      nodes: nodes,
      edges: normalizedEdges
    };
  };

  const getEdgeColor = (edgeType) => {
    switch (edgeType) {
      case 'contradicts':
        return '#ff4d4d';
      case 'updates':
        return '#4CAF50';
      case 'relates_to':
        return '#9333ea';
      default:
        return '#666';
    }
  };

  const getConnectedNodes = (nodeId) => {
    const connectedEdges = graphData.edges.filter(
      edge => edge.from === nodeId || edge.to === nodeId
    );

    return connectedEdges.map(edge => {
      const connectedNodeId = edge.from === nodeId ? edge.to : edge.from;
      const connectedNode = graphData.nodes.find(n => n.id === connectedNodeId);
      return {
        ...connectedNode,
        edgeType: edge.type,
        relationship: edge.from === nodeId ? 'outgoing' : 'incoming'
      };
    }).filter(node => node !== undefined);
  };

  if (loading) {
    return (
      <div className="visualize-page">
        <div className="visualize-container">
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-color)' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem', width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #9333ea', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p>Loading knowledge graph...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || graphData.nodes.length === 0) {
    return (
      <div className="visualize-page">
        <div className="visualize-container">
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-color)' }}>
            <p>{error || 'No graph data available.'}</p>
            <button
              onClick={() => window.location.href = '/upload'}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Upload Documents
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="visualize-page">
      <div className="visualize-container">
        <header className="viz-header">
          <p className="eyebrow">Knowledge Mapping</p>
          <h1>Relationship Graph</h1>
          <p style={{ opacity: 0.6, marginTop: '0.5rem', fontSize: '0.9rem' }}>
            {graphData.nodes.length} documents • {graphData.edges.length} relationships
          </p>
        </header>

        <div className="viz-canvas-wrapper">
          <svg className="graph-svg" viewBox="0 0 800 700">
            {/* Draw Edges (Lines) */}
            {graphData.edges.map((edge, i) => {
              const fromNode = graphData.nodes.find(n => n.id === edge.from);
              const toNode = graphData.nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              return (
                <line
                  key={i}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  className={`edge-line ${edge.type}`}
                  stroke={getEdgeColor(edge.type)}
                  strokeWidth="2"
                  opacity="0.6"
                />
              );
            })}

            {/* Draw Nodes (Circles) */}
            {graphData.nodes.map((node) => (
              <g
                key={node.id}
                className="node-group"
                onClick={() => setSelectedNode(node)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={15 + node.impact * 5}
                  className={`node-dot ${selectedNode?.id === node.id ? 'active' : ''}`}
                  fill={selectedNode?.id === node.id ? '#9333ea' : '#667eea'}
                  stroke="#fff"
                  strokeWidth="2"
                />
                <text
                  x={node.x}
                  y={node.y + 55}
                  className="node-text"
                  textAnchor="middle"
                  fill="var(--text-color)"
                  fontSize="12"
                  fontWeight="500"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>

          {/* Sidebar for Node Details */}
          <aside className={`viz-drawer ${selectedNode ? 'open' : ''}`}>
            {selectedNode && (
              <div className="drawer-content">
                <h3>{selectedNode.fullTitle}</h3>
                <div className="stat-row">
                  <span>Impact Score: </span>
                  <strong>{selectedNode.impact}/5</strong>
                </div>
                <div className="stat-row">
                  <span>Connections: </span>
                  <strong>{selectedNode.connections}</strong>
                </div>
                <div className="stat-row">
                  <span>Word Count: </span>
                  <strong>{selectedNode.wordCount}</strong>
                </div>
                <div className="stat-row">
                  <span>Date: </span>
                  <strong>{selectedNode.date}</strong>
                </div>
                <p className="node-desc">
                  This document has {selectedNode.connections} relationship{selectedNode.connections !== 1 ? 's' : ''} with other documents in the knowledge graph.
                </p>

                {/* Connected Nodes Section */}
                {selectedNode.connections > 0 && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', opacity: 0.8 }}>
                      Connected Documents ({selectedNode.connections})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {getConnectedNodes(selectedNode.id).map((connectedNode) => (
                        <button
                          key={connectedNode.id}
                          onClick={() => setSelectedNode(connectedNode)}
                          style={{
                            padding: '0.75rem',
                            background: 'rgba(147, 51, 234, 0.1)',
                            border: `1px solid ${getEdgeColor(connectedNode.edgeType)}`,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            color: 'var(--text-color)',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(147, 51, 234, 0.2)';
                            e.currentTarget.style.transform = 'translateX(4px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(147, 51, 234, 0.1)';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                        >
                          <div style={{ fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                            {connectedNode.label}
                          </div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                            {connectedNode.edgeType === 'contradicts' && '⚠️ Contradicts'}
                            {connectedNode.edgeType === 'updates' && '✅ Updates'}
                            {connectedNode.edgeType === 'relates_to' && '🔗 Related'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setSelectedNode(null)}
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    background: '#9333ea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </aside>
        </div>

        {/* Legend */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(147, 51, 234, 0.1)',
          border: '1px solid rgba(147, 51, 234, 0.3)',
          borderRadius: '8px',
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '30px', height: '3px', background: '#9333ea' }}></div>
            <span>Relates To</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '30px', height: '3px', background: '#4CAF50' }}></div>
            <span>Updates</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '30px', height: '3px', background: '#ff4d4d' }}></div>
            <span>Contradicts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualize;
