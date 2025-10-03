import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: Number,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    pdfNotesUrl: {
        type: String
    },
    duration: {
        type: String,
        default: "00:00"
    }
}, {
    timestamps: true
});

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['development', 'design', 'marketing', 'business', 'data-science', 'photography', 'music']
    },
    regularPrice: {
        type: Number,
        required: true,
        min: 0
    },
    offerPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    finalPrice: {
        type: Number
    },
    imageUrl: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true
    },
    instructorName: {
        type: String,
        required: true
    },
    lessons: [lessonSchema],
    isListed: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    }
}, {
    timestamps: true
});

// Calculate final price before saving
courseSchema.pre('save', function(next) {
    if (this.offerPercentage > 0) {
        this.finalPrice = this.regularPrice - (this.regularPrice * this.offerPercentage / 100);
    } else {
        this.finalPrice = this.regularPrice;
    }
    next();
});

// Virtual for total lessons
courseSchema.virtual('totalLessons').get(function() {
    return this.lessons.length;
});

// Virtual for total duration
courseSchema.virtual('totalDuration').get(function() {
    // Calculate total duration from all lessons
    // This is a simplified version - you might want to implement proper time calculation
    return `${this.lessons.length * 2}:30 Hours`;
});

const Course = mongoose.model('Course', courseSchema);

export default Course;