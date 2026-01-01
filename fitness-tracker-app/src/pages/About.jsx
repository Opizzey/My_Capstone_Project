import { Card, AccentCard } from '../components/Card';

function About() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-16">
        {/* Hero section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-4">About FitVerse</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">Your ultimate fitness companion for tracking, analyzing, and achieving your workout goals.</p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card>
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-bold text-xl mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your workouts with detailed logs and visual charts to see your improvement over time.</p>
          </Card>
          <Card>
            <div className="text-4xl mb-3">🏋️</div>
            <h3 className="font-bold text-xl mb-2">Set Goals</h3>
            <p className="text-gray-600">Define your fitness targets and track them in real-time with our intelligent goal-setting system.</p>
          </Card>
          <Card>
            <div className="text-4xl mb-3">🔥</div>
            <h3 className="font-bold text-xl mb-2">Stay Motivated</h3>
            <p className="text-gray-600">Get insights into your fitness journey and celebrate milestones with personalized feedback.</p>
          </Card>
        </div>

        {/* Mission section */}
        <AccentCard className="p-8 mb-12">
          <h2 className="text-3xl font-bold mb-4 text-green-700">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            At FitVerse, we believe that fitness is a personal journey unique to everyone. Our mission is to empower you with tools and insights to track your workouts, understand your progress, and maintain the discipline needed to achieve your fitness goals. Whether you're a beginner or an experienced athlete, FitVerse is designed to grow with you.
          </p>
        </AccentCard>

        {/* Team section */}
        <Card className="text-center p-8">
          <h2 className="text-3xl font-bold mb-4">Built with Passion</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            FitVerse is built by fitness enthusiasts who understand the importance of tracking and consistency. We're committed to providing the best tools for your fitness journey.
          </p>
        </Card>
      </div>
    </div>
  );
}

export default About;