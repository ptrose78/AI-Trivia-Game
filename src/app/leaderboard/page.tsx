'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      let { data } = await supabase   
        .from('leaderboard')
        .select('name, score')
        .order('score', { ascending: false })
        .limit(10);

      setLeaderboard(data || []);
    };

    fetchLeaderboard();

    // Listen for real-time updates
    const subscription = supabase
      .channel('leaderboard')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leaderboard' },
        (payload) => {
          setLeaderboard((prev) => [...prev, payload.new as { name: string; score: number }].sort((a, b) => b.score - a.score).slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div>
      <h1>Live Trivia Leaderboard</h1>
      <ol>
        {leaderboard.map((player, index) => (
          <li key={index}>
            {player.name} - {player.score} pts
          </li>
        ))}
      </ol>
    </div>
  );
}
