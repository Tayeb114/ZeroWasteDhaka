import React, { useState, useEffect } from "react";
import { Star, X, MessageSquare, User, MapPin, Info } from "lucide-react";
import { API_BASE_URL } from "../config/api";

export default function ReviewsDrawer({ isOpen, onClose, restaurantId, restaurantName }) {
  const [reviewsData, setReviewsData] = useState(null);
  const [loading, setLoading] = useState(false);

  // We are treating 'restaurantId' generically as 'userId' now.
  const userId = restaurantId;

  useEffect(() => {
    if (isOpen && userId) {
      fetchReviews();
    }
  }, [isOpen, userId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setReviewsData(data);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[9998]" 
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[9999] flex flex-col transform transition-transform">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
          <div>
            <h2 className="font-display text-xl font-semibold text-gray-900">
              User Profile
            </h2>
            <p className="text-sm font-medium text-gray-500 mt-1">
              {reviewsData?.targetUser?.role === 'manager' 
                ? (reviewsData?.targetUser?.restaurantName || restaurantName) 
                : (reviewsData?.targetUser?.name || restaurantName)}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="w-8 h-8 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin inline-block" />
            </div>
          ) : reviewsData ? (
            <>
              {/* Profile Details Section */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Info className="w-4 h-4 text-emerald-600" />
                  About
                </h3>
                {reviewsData.targetUser?.bio ? (
                  <p className="text-sm text-gray-600 italic">"{reviewsData.targetUser.bio}"</p>
                ) : (
                  <p className="text-xs text-gray-400">No bio provided.</p>
                )}
                {reviewsData.targetUser?.address && (
                  <div className="flex items-start gap-2 mt-2 pt-2 border-t border-gray-50">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">{reviewsData.targetUser.address}</p>
                  </div>
                )}
              </div>

              {/* Summary Section */}
              <div className="bg-emerald-50 rounded-2xl p-6 text-center border border-emerald-100">
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 mb-2">Overall Rating</p>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
                  <span className="font-display text-4xl font-bold text-gray-900">
                    {reviewsData.averageRating > 0 ? reviewsData.averageRating : "-"}
                  </span>
                </div>
                <p className="text-xs font-medium text-emerald-700">
                  Based on {reviewsData.totalReviews} feedback entries
                </p>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  Recent Feedback
                </h3>
                
                {reviewsData.reviews.length === 0 ? (
                  <p className="text-sm text-gray-500 italic py-4">No reviews yet.</p>
                ) : (
                  reviewsData.reviews.map((review) => (
                    <div key={review._id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-emerald-700" />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {review.reviewer_id?.name || "Anonymous User"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`} 
                          />
                        ))}
                      </div>

                      {review.comment && (
                        <p className="text-sm text-gray-600 leading-relaxed bg-white p-3 rounded-lg border border-gray-100">
                          "{review.comment}"
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">Failed to load profile.</p>
          )}
        </div>
      </div>
    </>
  );
}
