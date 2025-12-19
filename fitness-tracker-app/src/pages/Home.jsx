function Home() {
    return (
                <div className="home-container" style={{ display: 'flex', gap: '2rem', justifyContent: 'space-between', alignItems: 'flex-start', padding: '2rem' }}>
                    {/* Motivational text (left) */}
                    <aside style={{ flex: 1 }}>
                        <h2>SHAPE IS A HEALTHY <span style={{ color: '#22c55e' }}>WORKOUT</span></h2>
                        <section>
                            <h3>Recent Workouts</h3>
                            <ul>
                                <li>Bench Press - Dec 1 | 3 sets × 10 reps @ 150 lbs</li>
                                <li>Squats - Nov 30 | 4 sets × 8 reps @ 200 lbs</li>
                                <li>Deadlift - Nov 29 | 3 sets × 5 reps @ 250 lbs</li>
                            </ul>
                        </section>
                    </aside>

                    {/* Main content (center) */}
                    <main style={{ flex: 2, textAlign: 'center' }}>
                        <h1>
                            Let’s <span style={{ color: '#22c55e' }}>Transform Your Body</span> Now
                        </h1>
                        <p>Track, train and crush your goals – all in one app.</p>
                        {/* Central image */}
                        <img src="/src/assets/react.svg" alt="Workout" style={{ width: '200px', margin: '2rem auto' }} />
                        <button style={{ padding: '0.5rem 1.5rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>+ Log New Workout</button>
                    </main>

                    {/* Statistics (right) */}
                    <section style={{ flex: 1, textAlign: 'right' }}>
                        <div>
                            <h4>Best Lift</h4>
                            <p>250 lbs</p>
                        </div>
                        <div>
                            <h4>Total Workouts</h4>
                            <p>42</p>
                        </div>
                        <div>
                            <h4>This Week</h4>
                            <p>5</p>
                        </div>
                    </section>
                </div>
    );
}

export default Home;