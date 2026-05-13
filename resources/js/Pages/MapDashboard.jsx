import React, { useState, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';

var MapSection = React.lazy(function() { return import('./MapSection'); });

export default function MapDashboard() {
  var _useState1 = useState([]);
  var quests = _useState1[0];
  var setQuests = _useState1[1];

  var _useState2 = useState([
    { id: 2, name: 'Technician Bob', lat: 28.6140, lng: 77.2100, status: 'idle' },
    { id: 3, name: 'Technician Alice', lat: 28.6180, lng: 77.2040, status: 'idle' },
  ]);
  var technicians = _useState2[0];
  var setTechnicians = _useState2[1];

  var _useState3 = useState('');
  var message = _useState3[0];
  var setMessage = _useState3[1];

  function handleCreateQuest() {
    axios.post('/quests', {
      required_skill: 'Software',
      priority: 'high',
      location: { coordinates: [77.2090, 28.6139] }
    }).then(function(response) {
      setMessage('Quest dispatched! ' + response.data.message);
      if (response.data.quest) {
        setQuests(function(prev) { return prev.concat([response.data.quest]); });
      }
    }).catch(function(error) {
      console.error(error);
      setMessage('Error: ' + (error.response ? error.response.data.message : error.message));
    });
  }

  function handleAcceptQuest(questId) {
    axios.post('/quests/' + questId + '/accept').then(function(response) {
      setMessage('Quest accepted! ' + response.data.message);
      setQuests(function(prev) {
        return prev.map(function(q) {
          return q._id === questId ? Object.assign({}, q, { status: 'accepted' }) : q;
        });
      });
      setTechnicians(function(prev) {
        return prev.map(function(tech, i) {
          return i === 0 ? Object.assign({}, tech, { status: 'running' }) : tech;
        });
      });
    }).catch(function(error) {
      console.error(error);
      setMessage('Error accepting quest.');
    });
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#e2e8f0', fontFamily: "'Inter', 'Figtree', sans-serif" }}>
      <Head title="SchneidLink - Dispatch Map" />

      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderBottom: '1px solid #334155',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', fontWeight: 'bold', color: '#fff',
          }}>⚡</div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0, letterSpacing: '-0.5px' }}>
            <span style={{ color: '#22c55e' }}>Schneid</span>Link
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Overview</span>
          <span style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: '600', borderBottom: '2px solid #22c55e', paddingBottom: '2px' }}>Map</span>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Quests</span>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Reports</span>
        </div>
        <div style={{
          padding: '6px 14px', borderRadius: '20px',
          backgroundColor: '#1e293b', border: '1px solid #334155',
          fontSize: '12px', color: '#94a3b8',
        }}>
          🟢 System Online
        </div>
      </header>

      {/* Main Content */}
      <div style={{ padding: '24px 32px', display: 'flex', gap: '24px', height: 'calc(100vh - 73px)' }}>

        {/* Left Sidebar */}
        <div style={{ width: '340px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Create Quest Card */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #162032 100%)',
            border: '1px solid #334155', borderRadius: '16px', padding: '24px',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Manager Actions
            </h3>
            <button
              onClick={handleCreateQuest}
              style={{
                width: '100%', padding: '14px 20px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                color: '#fff', fontWeight: '700', fontSize: '15px',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
              }}
            >
              🚨 Create Emergency Quest
            </button>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>
              Skill: Software · Priority: High · Area: Delhi NCR
            </p>
          </div>

          {/* Status Message */}
          {message ? (
            <div style={{
              background: '#162032', border: '1px solid rgba(34,197,94,0.25)',
              borderRadius: '12px', padding: '16px', fontSize: '13px', color: '#22c55e',
            }}>
              ✅ {message}
            </div>
          ) : null}

          {/* Active Quests Log */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #162032 100%)',
            border: '1px solid #334155', borderRadius: '16px', padding: '24px', flex: 1,
            overflowY: 'auto',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Active Quest Log
            </h3>
            {quests.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#475569', padding: '40px 0', fontSize: '14px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗺️</div>
                No active quests yet.
                <br />Click the button above to dispatch!
              </div>
            ) : (
              quests.map(function(quest, index) {
                return (
                  <div key={quest._id || index} style={{
                    backgroundColor: '#0f172a', borderRadius: '10px', padding: '14px',
                    marginBottom: '10px', border: '1px solid #334155',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '600', fontSize: '14px' }}>#{index + 1} {quest.required_skill || 'Software'}</span>
                      <span style={{
                        fontSize: '11px', fontWeight: '700',
                        padding: '3px 10px', borderRadius: '20px',
                        backgroundColor: quest.status === 'accepted' ? 'rgba(22,163,74,0.2)' : 'rgba(234,179,8,0.2)',
                        color: quest.status === 'accepted' ? '#22c55e' : '#eab308',
                      }}>
                        {quest.status === 'accepted' ? '🏃 ACCEPTED' : '⏳ PENDING'}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Priority: {quest.priority || 'high'}</div>
                    {quest.status === 'pending' ? (
                      <button
                        onClick={function() { handleAcceptQuest(quest._id); }}
                        style={{
                          marginTop: '10px', width: '100%', padding: '8px',
                          borderRadius: '8px', backgroundColor: '#16a34a',
                          color: '#fff', fontWeight: '600', fontSize: '13px',
                          border: 'none', cursor: 'pointer',
                        }}
                      >
                        ⚔️ Accept Quest
                      </button>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>

          {/* Team Status */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #162032 100%)',
            border: '1px solid #334155', borderRadius: '16px', padding: '16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>👷</span>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Team Status</span>
            </div>
            <span style={{
              fontSize: '12px', fontWeight: '700', padding: '4px 12px',
              borderRadius: '20px', backgroundColor: 'rgba(22,163,74,0.2)', color: '#22c55e',
            }}>
              {technicians.length} online
            </span>
          </div>
        </div>

        {/* Map Area */}
        <div style={{
          flex: 1, borderRadius: '16px', overflow: 'hidden',
          border: '1px solid #334155', position: 'relative',
        }}>
          <Suspense fallback={
            <div style={{
              height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: '#1e293b', color: '#94a3b8', fontSize: '16px',
            }}>
              Loading map...
            </div>
          }>
            <MapSection quests={quests} technicians={technicians} onAcceptQuest={handleAcceptQuest} />
          </Suspense>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: '* { box-sizing: border-box; margin: 0; padding: 0; }' }} />
    </div>
  );
}
