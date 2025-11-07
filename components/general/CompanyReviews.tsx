'use client';
import { useEffect, useState } from 'react';

export default function ReviewSubmissionForm({ companyId }: { companyId: string }) {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    const checkReview = async () => {
      const res = await fetch(`/api/reviews/check/${companyId}`);
      const data = await res.json();
      setHasReviewed(data.hasReviewed);
    };
    checkReview();
  }, [companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/reviews/${companyId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, reviewText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }

      setReviewText('');
      setRating(5);
      setSubmitSuccess(true);
      setHasReviewed(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasReviewed) {
    return (
      <div className="mt-4 p-4 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm shadow-sm max-w-md">
        ✅ You’ve already submitted a review for this company.
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl shadow-md p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 max-w-md w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Write a Review</h3>

      {submitSuccess && (
        <div className="mb-4 p-2 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
          Your review has been submitted successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 p-2 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-xl transition ${
                  star <= rating ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-600'
                }`}
              >
                {star <= rating ? '★' : '☆'}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Review
          </label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            rows={4}
            placeholder="Share your experience with this company..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium transition"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
