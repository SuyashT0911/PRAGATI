/**
 * PRAGATI — Chapter Controller
 */
'use strict';
const Chapter = require('../models/Chapter');
const Progress = require('../models/Progress');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// GET /api/v1/chapters/:id — Get chapter content (enrollment check optional)
exports.getChapter = async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        if (!chapter) return res.status(404).json({ success: false, error: 'Chapter not found' });

        // Get all chapters for sidebar navigation
        const allChapters = await Chapter.find({ course: chapter.course, isPublished: true })
            .select('title slug order isLocked readTimeMinutes')
            .sort({ order: 1 });

        // Get user's progress if authenticated
        let userProgress = null;
        let allProgress = [];
        if (req.user) {
            userProgress = await Progress.findOne({ user: req.user.id, chapter: chapter._id });
            allProgress = await Progress.find({ user: req.user.id, course: chapter.course });
        }

        // Build chapter response (strip correct answers from quiz if not completed)
        const chapterData = chapter.toObject();
        if (chapterData.quiz && chapterData.quiz.questions) {
            chapterData.quiz.questions = chapterData.quiz.questions.map(q => ({
                question: q.question,
                options: q.options,
                // Only send correct answers if user already passed this quiz
                ...(userProgress && userProgress.quizPassed ? { correctAnswer: q.correctAnswer, explanation: q.explanation } : {}),
            }));
        }

        // Map progress to chapters for sidebar
        const chaptersWithProgress = allChapters.map(ch => {
            const prog = allProgress.find(p => p.chapter.toString() === ch._id.toString());
            return {
                ...ch.toObject(),
                isCompleted: prog ? prog.isCompleted : false,
                quizPassed: prog ? prog.quizPassed : false,
            };
        });

        res.json({
            success: true,
            chapter: chapterData,
            chapters: chaptersWithProgress,
            progress: userProgress,
        });
    } catch (err) {
        console.error('Chapter error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// POST /api/v1/chapters/:id/quiz — Submit quiz answers
exports.submitQuiz = async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        if (!chapter) return res.status(404).json({ success: false, error: 'Chapter not found' });

        if (!chapter.quiz || !chapter.quiz.questions || chapter.quiz.questions.length === 0) {
            return res.status(400).json({ success: false, error: 'This chapter has no quiz' });
        }

        const { answers } = req.body; // Array of answer indices
        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ success: false, error: 'Answers array required' });
        }

        // Grade the quiz
        let correct = 0;
        const total = chapter.quiz.questions.length;
        const results = chapter.quiz.questions.map((q, i) => {
            const isCorrect = answers[i] === q.correctAnswer;
            if (isCorrect) correct++;
            return {
                question: q.question,
                yourAnswer: answers[i],
                correctAnswer: q.correctAnswer,
                isCorrect,
                explanation: q.explanation,
            };
        });

        const score = Math.round((correct / total) * 100);
        const passed = score >= (chapter.quiz.passingScore || 70);

        // Save progress
        let progress = await Progress.findOne({ user: req.user.id, chapter: chapter._id });
        if (!progress) {
            progress = new Progress({
                user: req.user.id,
                chapter: chapter._id,
                course: chapter.course,
            });
        }
        progress.quizScore = score;
        progress.attempts += 1;
        if (passed) {
            progress.quizPassed = true;
            progress.isCompleted = true;
            progress.completedAt = new Date();
        }
        await progress.save();

        // Update overall enrollment progress
        if (passed) {
            await updateCourseProgress(req.user.id, chapter.course);
        }

        res.json({
            success: true,
            score,
            passed,
            correct,
            total,
            passingScore: chapter.quiz.passingScore || 70,
            results,
        });
    } catch (err) {
        console.error('Quiz submit error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Helper: recalculate course progress
async function updateCourseProgress(userId, courseId) {
    const totalChapters = await Chapter.countDocuments({ course: courseId, isPublished: true });
    const completedChapters = await Progress.countDocuments({
        user: userId,
        course: courseId,
        isCompleted: true,
    });
    const progress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (enrollment) {
        enrollment.overallProgress = progress;
        if (progress >= 100) {
            enrollment.isCompleted = true;
            enrollment.completedAt = new Date();
        }
        await enrollment.save();
    }
}

// POST /api/v1/admin/chapters — Create chapter (admin)
exports.create = async (req, res) => {
    try {
        const chapter = await Chapter.create(req.body);
        // Update course total chapters
        const count = await Chapter.countDocuments({ course: chapter.course });
        await Course.findByIdAndUpdate(chapter.course, { totalChapters: count });
        res.status(201).json({ success: true, chapter });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
