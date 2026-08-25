const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    url: {
      type: String,
      trim: true,
    },
    text: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    author: {
      type: String,
    },
    source: {
      type: String,
    },
    credibilityScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    category: {
      type: String,
      enum: ['reliable', 'partially_false', 'false', 'satire', 'propaganda', 'misleading'],
      required: true,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      required: true,
    },
    sentimentScore: {
      type: Number,
      min: -1,
      max: 1,
    },
    detectedPatterns: {
      type: [String],
      default: [],
    },
    claimsFound: {
      type: [String],
      default: [],
    },
    sourceCredibility: {
      type: Number,
      min: 0,
      max: 100,
    },
    analysisDetails: {
      type: Object,
      default: {},
    },
    isSaved: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ url: 1 });

module.exports = mongoose.model('Analysis', analysisSchema);
